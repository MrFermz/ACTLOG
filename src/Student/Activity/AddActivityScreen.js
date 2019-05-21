import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native'
import styles from '../../styles'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Modal from 'react-native-modal'

export default class AddActivity extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: navigation.getParam('date'),
      headerRight: (
        <TouchableOpacity
          onPress={() => Alert.alert(
            'แจ้งเตือน',
            'แน่ใจที่จะแก้ไขกิจกรรม ?',
            [
              {
                text: 'ยกเลิก',
                style: 'cancel'
              },
              { text: 'ตกลง', onPress: () => params.save() }
            ],
            { cancelable: false }
          )}
          style={styles.button.headerRight}>
          {<Icon name='save' size={30} color='white' />}
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      morning: '',
      afternoon: '',
      open: false,
      total: 0,
      count: 0
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ save: this.saveActivity.bind(this) })
    this.getActivity()
  }

  saveActivity() {
    const { morning, afternoon } = this.state
    var { navigation } = this.props
    var uid, timeTable
    var key = navigation.getParam('key')
    uid = firebase.auth().currentUser.uid
    timeTable = firebase.database().ref(`timeTable/${uid}/${key}`)
    timeTable.update({
      morning,
      afternoon
    }).then(() => {
      Alert.alert(
        'แจ้งเตือน',
        'แก้ไขกิจกรรมแล้ว.',
        [{ text: 'ตกลง' }],
        { cancelable: false },
      )
      this.props.navigation.goBack()
    })
  }

  getActivity() {
    var { navigation } = this.props
    var date = navigation.getParam('date')
    var morning = navigation.getParam('morning')
    var afternoon = navigation.getParam('afternoon')
    this.setState({
      date,
      morning,
      afternoon
    })
  }

  generator() {
    var length = 20
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      value = ''
    for (var i = 0, n = charset.length; i < length; ++i) {
      value += charset.charAt(Math.floor(Math.random() * n))
    }
    return value
  }

  _pickImage() {
    ImagePicker.openPicker({
      width: 1280,
      height: 720,
      multiple: true,
      mediaType: 'photo'
    }).then((img) => {
      var name = '', total = img.length
      this.setState({ total })
      img.forEach((e) => {
        name = this.generator()
        this.uploadImage(e.path, name)
      })
    })
  }

  uploadImage(uri, name, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      var { navigation } = this.props
      var key = navigation.getParam('key')
      let mime = 'image/jpg'
      const imagePath = uri
      const uid = firebase.auth().currentUser.uid
      const imageRef = firebase
        .storage()
        .ref(`activity/${uid}/${key}`)
        .child(name)
      imageRef.put(imagePath, { contentType: mime })
        .then(async () => {
          this.setState({ open: true })
          return imageRef.getDownloadURL()
            .then((url) => {
              this.saveUrl(url, key)
            })
        })
        .then(resolve)
        .catch(reject)
    })
  }

  saveUrl(url, key) {
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref(`timeTable/${uid}/${key}/photos`).push({
      photo: url
    }).then(() => {
      this.setState({ count: this.state.count + 1 })
    })
  }

  handleModal() {
    this.setState({ open: !this.state.open })
  }

  renderModal() {
    const { open, total, count } = this.state
    return (
      <Modal
        isVisible={open}
        animationIn='fadeIn'
        animationOut='fadeOut'
        onModalHide={() => {
          this.setState({ progress: '', count: 0, total: 0 })
        }}
        onBackButtonPress={() => {
          if (count == total) {
            this.handleModal()
          }
        }}
        onBackdropPress={() => {
          if (count == total) {
            this.handleModal()
          }
        }}>
        <View
          style={{
            justifyContent: 'center',
            backgroundColor: 'white',
            width: '100%', height: '30%',
            borderRadius: 20
          }}>
          <Text
            style={{ fontSize: 25, alignSelf: 'center' }}>
            {`${count} / ${total}`}</Text>
          {count == total
            ? <TouchableOpacity
              onPress={() => this.handleModal()}
              style={styles.button.subAdd}>
              <Icon
                size={30}
                name='check' />
            </TouchableOpacity>
            : <ActivityIndicator
              size='large' />}
        </View>
      </Modal>
    )
  }

  render() {
    const { morning, afternoon } = this.state
    return (
      <ScrollView style={styles.view.scrollView}>
        {this.renderModal()}
        {/* <TouchableOpacity onPress={() => this.handleModal()}>
          <Text>Open Modal</Text>
        </TouchableOpacity> */}
        <TextInput
          style={styles.input.actField}
          placeholderTextColor='black'
          defaultValue={morning}
          onChangeText={(text) => this.setState({ morning: text })}
          multiline={true}
          autoCapitalize='none'
          autoCorrect={false} />
        <TextInput
          style={styles.input.actField}
          placeholderTextColor='black'
          defaultValue={afternoon}
          onChangeText={(text) => this.setState({ afternoon: text })}
          multiline={true}
          autoCapitalize='none'
          autoCorrect={false} />
        <TouchableOpacity
          onPress={() => this._pickImage()}
          style={styles.button.main}>
          <Text style={styles.button.mainLabel}>อัปโหลดรูป</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}