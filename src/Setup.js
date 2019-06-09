import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native'
import styles from './styles'
import {
  StackActions,
  NavigationActions
} from 'react-navigation'
import ImagePicker from 'react-native-image-picker'
import { Avatar, Icon } from 'react-native-elements'

const options = {
  title: 'เลือกรูปภาพ',
  takePhotoButtonTitle: 'ถ่ายจากกล้อง...',
  chooseFromLibraryButtonTitle: 'เลือกจากคลัง...'
}

export default class Setup extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      title: 'ตั้งค่าผู้ใช้',
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
      sid: '',
      fname: null,
      lname: null,
      group: '',
      telNum: '',
      avatar: ''
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ save: this.saveDetail.bind(this) })
  }

  saveDetail() {
    const { sid, fname, lname, group, telNum } = this.state
    var type = this.props.navigation.getParam('type')
    var uid = firebase.auth().currentUser.uid
    if (fname && lname) {
      if (type == 'Student') {
        firebase.database().ref(`users/${uid}`).update({
          suid: sid,
          fname,
          lname,
          group,
          tel_number: telNum,
          setup: false
        }).then(() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
              routeName: type
            })]
          })
          this.props.navigation.dispatch(resetAction)
        })
      } else if (type == 'Teacher' || type == 'Staff') {
        firebase.database().ref(`users/${uid}`).update({
          fname,
          lname,
          tel_number: telNum,
          stat_setup: false,
        }).then(() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
              routeName: type
            })]
          })
          this.props.navigation.dispatch(resetAction)
        })
      }
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'กรุณาใส่ชื่อจริงและนามสกุล',
        [{ text: 'ตกลง' }],
        { cancelable: false }
      )
    }
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

      imageRef
        .put(imagePath, { contentType: mime })
        .then(async () => {
          return imageRef.getDownloadURL()
            .then((url) => {
              console.log(url)
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
    firebase.database().ref(`users/${uid}`).update({ avatar: url })
      .then(() => {
        Alert.alert(
          'แจ้งเตือน',
          'อัพโหลดรูปโปรไฟล์เสร็จแล้ว',
          [
            { text: 'ตกลง' },
          ],
          { cancelable: false },
        )
      })
  }

  inputLoader(type) {
    if (type == 'Student') {
      return (
        <View>
          <TextInput
            style={styles.input.borderWithFont}
            placeholderTextColor='gray'
            placeholder='รหัสนักศึกษา'
            keyboardType='number'
            onChangeText={(text) => this.setState({ sid: text })}
            autoCapitalize='none'
            autoCorrect={false} />
          <TextInput
            style={styles.input.borderWithFont}
            placeholderTextColor='gray'
            placeholder='ชื่อจริง'
            onChangeText={(text) => this.setState({ fname: text })}
            autoCapitalize='none'
            autoCorrect={false} />
          <TextInput
            style={styles.input.borderWithFont}
            placeholderTextColor='gray'
            placeholder='นามสกุล'
            onChangeText={(text) => this.setState({ lname: text })}
            autoCapitalize='none'
            autoCorrect={false} />
          <TextInput
            style={styles.input.borderWithFont}
            placeholderTextColor='gray'
            placeholder='กลุ่ม'
            onChangeText={(text) => this.setState({ group: text })}
            autoCorrect={false} />
          <TextInput
            style={styles.input.borderWithFont}
            placeholderTextColor='gray'
            placeholder='เบอร์โทร'
            onChangeText={(text) => this.setState({ telNum: text })}
            keyboardType='phone-pad'
            autoCorrect={false} />
        </View>
      )
    } else if (type == 'Teacher' || type == 'Staff') {
      return (
        <View>
          <TextInput
            style={styles.input.borderWithFont}
            placeholderTextColor='gray'
            placeholder='ชื่อจริง'
            onChangeText={(text) => this.setState({ fname: text })}
            autoCapitalize='none'
            autoCorrect={false} />
          <TextInput
            style={styles.input.borderWithFont}
            placeholderTextColor='gray'
            placeholder='นามสกุล'
            onChangeText={(text) => this.setState({ lname: text })}
            autoCapitalize='none'
            autoCorrect={false} />
          <TextInput
            style={styles.input.borderWithFont}
            placeholderTextColor='gray'
            placeholder='เบอร์โทร'
            onChangeText={(text) => this.setState({ telNum: text })}
            keyboardType='phone-pad'
            autoCorrect={false} />
        </View>
      )
    }
  }

  render() {
    const type = this.props.navigation.getParam('type')
    return (
      <ScrollView style={styles.view.scrollView}>
        <Avatar
          source={{ uri: this.state.avatar }}
          size='xlarge'
          onEditPress={() => this._pickImage()}
          showEditButton
          rounded
          containerStyle={{ alignSelf: 'center', margin: 20 }} />
        {this.inputLoader(type)}
      </ScrollView>
    )
  }
}