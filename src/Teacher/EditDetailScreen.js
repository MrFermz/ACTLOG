import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Text
} from 'react-native'
import styles from '../styles'
import ImagePicker from 'react-native-image-picker'
import { Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Modal from 'react-native-modal'

const options = {
  title: 'เลือกรูปภาพ',
  takePhotoButtonTitle: 'ถ่ายจากกล้อง...',
  chooseFromLibraryButtonTitle: 'เลือกจากคลัง...'
}

export default class EditDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      title: 'แก้ไขข้อมูลส่วนตัว',
      headerRight: (
        <TouchableOpacity
          onPress={() => Alert.alert(
            'แจ้งเตือน',
            'แน่ใจที่จะบันทึกข้อมูล ?',
            [
              {
                text: 'ยกเลิก',
                style: 'cancel',
              },
              { text: 'ตกลง', onPress: () => params.save() },
            ],
            { cancelable: false },
          )}
          style={styles.button.headerRight}>
          <Icon name='save' size={30} color='white' />
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      fname: '',
      lname: '',
      email: '',
      telNum: '',
      avatar: '',
      progress: 0,
      open: false
    }
  }

  componentDidMount() {
    this.getDetail()
    this.props.navigation.setParams({ save: this.saveDetail.bind(this) })
  }

  getDetail() {
    var fname = this.props.navigation.getParam('fname')
    var lname = this.props.navigation.getParam('lname')
    var email = this.props.navigation.getParam('email')
    var telNum = this.props.navigation.getParam('telNum')
    var avatar = this.props.navigation.getParam('avatar')
    this.setState({
      fname,
      lname,
      email,
      telNum,
      avatar
    })
  }

  saveDetail() {
    const { fname, lname, telNum } = this.state
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref(`users/${uid}`).update({
      fname,
      lname,
      tel_number: telNum
    }).then(() => {
      Alert.alert(
        'แจ้งเตือน',
        'บันทึกข้อมูลแล้ว.',
        [{ text: 'ตกลง' }],
        { cancelable: false },
      )
      this.props.navigation.goBack()
    })
  }

  _pickImage() {
    ImagePicker.showImagePicker(options, (res) => {
      this.uploadImage(res.uri)
    })
  }

  uploadImage(uri, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const imagePath = uri
      const uid = firebase.auth().currentUser.uid
      const imageRef = firebase
        .storage()
        .ref(`avatar/${uid}`)
        .child('avatar.jpg')
      let mime = 'image/jpg'
      imageRef.putFile(imagePath, { contentType: mime })
        .on('state_changed', (snapshot) => {
          this.setState({ open: true })
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.setState({ progress })
          imageRef.getDownloadURL()
            .then((url) => {
              this.saveUrl(url)
            })
            .then(resolve)
            .catch(reject)
        })
    })
  }

  saveUrl(url) {
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref(`users/${uid}`).update({
      avatar: url
    }).then(() => {
      this.setState({ avatar: url })
    })
  }

  handleModal() {
    this.setState({ open: !this.state.open })
  }

  renderModal() {
    const { progress, open } = this.state
    return (
      <Modal
        isVisible={open}
        animationIn='fadeIn'
        animationOut='fadeOut'
        onModalHide={() => {
          this.setState({ progress: 0 })
        }}
        onBackButtonPress={() => {
          if (progress == 100) {
            this.handleModal()
          }
        }}
        onBackdropPress={() => {
          if (progress == 100) {
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
          {progress == 100
            ? <TouchableOpacity
              onPress={() => this.handleModal()}
              style={styles.button.loadingButton}>
              <Icon color='white'
                size={30}
                name='check'
                style={styles.button.loadingIcon} />
              <Text style={{
                fontSize: 20, color: '#2ECC71',
                alignSelf: 'center'
              }}>อัปโหลดสำเร็จ</Text>
            </TouchableOpacity>
            : <ActivityIndicator
              size='large' />}
        </View>
      </Modal>
    )
  }

  render() {
    const { fname, lname, telNum, email } = this.state
    return (
      <ScrollView style={styles.view.scrollView}>
        {this.renderModal()}
        <Avatar
          source={{ uri: this.state.avatar }}
          size='xlarge'
          onEditPress={() => this._pickImage()}
          showEditButton
          rounded
          containerStyle={{ alignSelf: 'center', margin: 20 }} />
        {/* <TouchableOpacity onPress={() => this.handleModal()}>
          <Text>Open Modal</Text>
        </TouchableOpacity> */}
        <TextInput
          style={styles.input.borderWithFont}
          placeholderTextColor='gray'
          defaultValue={fname}
          placeholder='ชื่อจริง'
          onChangeText={(text) => this.setState({ fname: text })}
          autoCapitalize='none'
          autoCorrect={false} />
        <TextInput
          style={styles.input.borderWithFont}
          placeholderTextColor='gray'
          defaultValue={lname}
          placeholder='นามสกุล'
          onChangeText={(text) => this.setState({ lname: text })}
          autoCapitalize='none'
          autoCorrect={false} />
        <TextInput
          style={styles.input.borderWithFont}
          placeholderTextColor='gray'
          defaultValue={telNum}
          placeholder='เบอร์โทร'
          onChangeText={(text) => this.setState({ telNum: text })}
          keyboardType='phone-pad'
          autoCorrect={false} />
        <TextInput
          editable={false}
          style={styles.input.borderWithFont}
          defaultValue={email} />
      </ScrollView>
    )
  }
}