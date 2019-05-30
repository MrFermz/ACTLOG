import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  View,
  Image,
  ActivityIndicator
} from 'react-native'
import styles from '../../styles'
import {
  Card,
  Rating
} from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Modal from 'react-native-modal'

export default class SaveVisitScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    var fname = navigation.getParam('fname')
    var lname = navigation.getParam('lname')
    return {
      title: fname + '  ' + lname,
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
              { text: 'ตกลง', onPress: () => params.save() }
            ],
            { cancelable: false }
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
      comment: '',
      vid: '',
      list: [],
      score1: '',
      score2: '',
      score3: '',
      score4: '',
      score5: '',
      open: false,
      count: 0,
      total: 0
    }
  }

  componentDidMount() {
    this.getList()
    this.props.navigation.setParams({ save: this.saveVisit.bind(this) })
  }

  getList() {
    var suid = this.props.navigation.getParam('suid')
    var tuid = this.props.navigation.getParam('tuid')
    var key = this.props.navigation.getParam('key')
    var items = []
    firebase.database().ref('visit')
      .orderByChild('tuid')
      .equalTo(tuid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          if (suid == child.val().suid) {
            firebase.database().ref(`visit/${child.key}`)
              .once('value').then((snapshot) => {
                var val = snapshot.val()
                this.setState({
                  comment: val.comment,
                  vid: child.key,
                  score1: val.score1,
                  score2: val.score2,
                  score3: val.score3,
                  score4: val.score4,
                  score5: val.score5
                })
              })
          }
        })
      })

    firebase.database().ref(`visit/${key}/photos`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          items.push({
            photo: child.val().photo
          })
        })
        this.setState({ list: items })
      })
  }

  saveVisit() {
    const { comment, vid, score1, score2, score3, score4, score5 } = this.state
    firebase.database().ref(`visit/${vid}`).update({
      comment,
      score1,
      score2,
      score3,
      score4,
      score5
    }).then(() => {
      Alert.alert(
        'แจ้งเตือน',
        'บันทึกข้อมูลสำเร็จ.',
        [{ text: 'ตกลง' }],
        { cancelable: false }
      )
      this.props.navigation.goBack()
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
      const imageRef = firebase
        .storage()
        .ref(`visit/${key}`)
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
    firebase.database().ref(`visit/${key}/photos`).push({
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
    const { comment, list, score1, score2, score3, score4, score5 } = this.state
    var count = 3
    return (
      <ScrollView style={styles.view.scrollView}>
        {this.renderModal()}
        {/* <TouchableOpacity onPress={() => this.handleModal()}>
          <Text>Open Modal</Text>
        </TouchableOpacity> */}
        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>ความรับผิดชอบต่องานที่ได้รับมอบหมาย</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score1: value }) }}
            count={count}
            ratingCount={count}
            fractions={1}
            startingValue={score1}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>มีความรอบคอบในการทำงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score2: value }) }}
            count={count}
            ratingCount={count}
            fractions={1}
            startingValue={score2}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>มีมนุษย์สัมพันธ์</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score3: value }) }}
            count={count}
            ratingCount={count}
            fractions={1}
            startingValue={score3}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>การตรงต่อเวลา</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score4: value }) }}
            count={count}
            ratingCount={count}
            fractions={1}
            startingValue={score4}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>ปฏิบัติตนถูกต้องตามระเบียบข้อบังคับของสถานที่ฝึกงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score5: value }) }}
            count={count}
            ratingCount={count}
            fractions={1}
            startingValue={score5}
            size={40} />
        </View>

        <TextInput
          style={styles.input.actField}
          multiline={true}
          placeholderTextColor='gray'
          defaultValue={comment}
          placeholder='แสดงความคิดเห็น'
          onChangeText={(text) => this.setState({ comment: text })}
          autoCapitalize='none'
          autoCorrect={false}>
        </TextInput>

        <TouchableOpacity
          onPress={() => this._pickImage()}
          style={styles.button.sub}>
          <Text style={styles.button.subLabel}>อัปโหลดรูป</Text>
        </TouchableOpacity>
        {list.map((user, i) => {
          return (
            <Card key={i}>
              <Image
                style={{ width: '100%', height: 300 }}
                source={{ uri: user.photo }} />
            </Card>
          )
        })}
      </ScrollView>
    )
  }
}