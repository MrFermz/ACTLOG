import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  Picker,
  Modal,
  ActivityIndicator
} from 'react-native'
import styles from '../styles'
import ImagePicker from 'react-native-image-picker'
import DatePicker from 'react-native-datepicker'
import { Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'

const options = {
  title: 'เลือกรูปภาพ',
  takePhotoButtonTitle: 'ถ่ายจากกล้อง...',
  chooseFromLibraryButtonTitle: 'เลือกจากคลัง...'
}

class EditDetailScreen extends Component {
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
      uid: '',
      avatar: '',
      modalVisible: false,
      dateStartPicker: '',
      dateEndPicker: ''
    }
  }

  componentDidMount() {
    this.getDetail()
    this.props.navigation.setParams({ save: this.saveDetail.bind(this) })
  }

  getDetail() {
    var sid = this.props.navigation.getParam('sid')
    var fname = this.props.navigation.getParam('fname')
    var lname = this.props.navigation.getParam('lname')
    var group = this.props.navigation.getParam('group')
    var subject = this.props.navigation.getParam('subject')
    var email = this.props.navigation.getParam('email')
    var telNum = this.props.navigation.getParam('telNum')
    var dateStartPicker = this.props.navigation.getParam('dateStartPicker')
    var dateEndPicker = this.props.navigation.getParam('dateEndPicker')
    var sidStat = this.props.navigation.getParam('sidStat')
    var uuid = this.props.navigation.getParam('uuid')
    var avatar = this.props.navigation.getParam('avatar')
    this.setState({
      sid: sid,
      fname: fname,
      lname: lname,
      group: group,
      subject: subject,
      email: email,
      telNum: telNum,
      dateStartPicker: dateStartPicker,
      dateEndPicker: dateEndPicker,
      sidStat: sidStat,
      uid: uuid,
      avatar: avatar
    })
  }

  saveDetail() {
    const { sid, fname, lname, group, subject, telNum, email, dateStartPicker, dateEndPicker, uid } = this.state
    // console.log(`Start = ${dateStartPicker}\nEnd = ${dateEndPicker}`)
    firebase.database().ref(`users/${uid}`).update({
      sid: sid,
      fname: fname,
      lname: lname,
      group: group,
      subject: subject,
      email: email,
      telNum: telNum,
      dateStart: dateStartPicker,
      dateEnd: dateEndPicker,
      sidStat: false,
      setup: false
    }).then(() => {
      Alert.alert(
        'แจ้งเตือน',
        'แก้ไขข้อมูลแล้ว.',
        [
          { text: 'ตกลง' },
        ],
        { cancelable: false },
      )
      this.props.navigation.goBack()
    })
  }

  sidLoader(sidStat, sid) {
    if (sidStat) {
      return (
        <TextInput
          editable={true}
          style={styles.input.borderWithFont}
          placeholderTextColor='gray'
          defaultValue={sid}
          placeholder='รหัสนักศึกษา'
          keyboardType='number-pad'
          onFocus={() => Alert.alert('รหัสนักศึกษาแก้ไขได้ครั้งเดียวเท่านั้น')}
          onChangeText={(text) => this.setState({ sid: text })}
          autoCapitalize='none'
          autoCorrect={false} />
      )
    } else {
      return (
        <TextInput
          editable={false}
          style={styles.input.borderWithFont}
          defaultValue={sid}
          placeholder='รหัสนักศึกษา' />
      )
    }
  }

  _pickImage() {
    ImagePicker.showImagePicker(options, (res) => {
      console.log(res.uri)
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

      imageRef
        .put(imagePath, { contentType: mime })
        .then(async () => {
          return imageRef.getDownloadURL()
            .then((url) => {
              this.setModalVisible(true)
              // console.log(url)
              this.setState({ avatar: url })
              this.saveUrl(url)
            })
        })
        .then(resolve)
        .catch(reject)
    })
  }

  saveUrl(url) {
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref(`users/${uid}`).update({
      avatar: url
    }).then(() => {
      this.setModalVisible(!this.state.modalVisible)
    })
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  render() {
    const { sid, fname, lname, group, subject, telNum, email, sidStat, dateStartPicker, dateEndPicker } = this.state
    return (
      <ScrollView style={styles.view.scrollView}>
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator
              size='large'
              color='red' />
          </View>
        </Modal>
        <Avatar
          source={{ uri: this.state.avatar }}
          size='xlarge'
          onEditPress={() => this._pickImage()}
          showEditButton
          rounded
          containerStyle={{ alignSelf: 'center', margin: 20 }} />
        {this.sidLoader(sidStat, sid)}
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
          defaultValue={group}
          placeholder='กลุ่ม'
          onChangeText={(text) => this.setState({ group: text })}
          autoCorrect={false} />
        <TextInput
          editable={false}
          style={styles.input.borderWithFont}
          defaultValue={subject} />
        <TextInput
          style={styles.input.borderWithFont}
          placeholderTextColor='gray'
          defaultValue={telNum}
          placeholder='เบอร์โทร'
          onChangeText={(text) => this.setState({ telNum: text })}
          keyboardType='phone-pad'
          autoCorrect={false} />
        <DatePicker
          style={{ width: 350 }}
          // locale={TH}
          date={new Date(dateStartPicker)}
          onDateChange={(date) => this.setState({ dateStartPicker: new Date(date) }, console.log(new Date(date)))}
          // format='DD MMMM YYYY'
          placeholder='วันที่เริ่มฝึกงาน' />
        <DatePicker
          style={{ width: 350 }}
          // locale={TH}
          date={new Date(dateEndPicker)}
          onDateChange={(date) => this.setState({ dateEndPicker: new Date(date) }, console.log(new Date(date)))}
          // format='LL'
          placeholder='วันที่จบฝึกงาน' />
        <TextInput
          editable={false}
          style={styles.input.borderWithFont}
          defaultValue={email} />
      </ScrollView>
    )
  }
}

export default EditDetailScreen