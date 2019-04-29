import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Button,
  Picker
} from 'react-native'
import styles from './styles'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Input } from 'react-native-elements'

class RegisterScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      rePassword: '',
      loading: false,
      error: '',
      type: ''
    }
  }

  onRegisterPressed() {
    const { email, password, rePassword, type } = this.state
    firebaseAuth = firebase.auth()
    if (email != '' && password != '') {
      if (password == rePassword) {
        this.setState({ loading: true })
        firebaseAuth.createUserWithEmailAndPassword(email, password)
          .then(() => {
            var year = new Date().getFullYear()
            var uid = firebaseAuth.currentUser.uid
            firebase.database().ref(`users/${uid}`).set({
              uid: uid,
              email: email,
              fname: 'ชื่อจริง',
              lname: 'นามสกุล',
              telNum: 'เบอร์โทร',
              type: type,
              avatar: '',
              setup: false,
              typeStat: false,
              year: String(year)
            }).then((sendVerify) => {
              if (sendVerify == false) {
                return false
              } else {
                firebase.auth().currentUser.sendEmailVerification()
                this.setState({ loading: false })
                Alert.alert(
                  'แจ้งเตือน',
                  'สมัครสมาชิกสำเร็จ.\nติดต่อแอดมินเพื่อยืนยันการเข้าใช้งาน',
                  [
                    { text: 'ตกลง', onPress: () => this.props.navigation.goBack() },
                  ],
                  { cancelable: false },
                )
              }
            })
          }).catch((error) => {
            this.setState({ loading: false })
            Alert.alert(error.message)
          })
      } else {
        this.setState({ error: 'รหัสผ่านไม่ตรงกัน' })
      }
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'กรุณากรอกข้อมูลให้ครบ!',
        [
          { text: 'ตกลง' },
        ],
        { cancelable: false },
      )
    }
  }

  buttonLoader() {
    const { loading } = this.state
    if (loading) {
      return (
        <TouchableOpacity
          disabled={true}
          style={styles.button.sub}>
          <ActivityIndicator size='large' color='white' />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        style={styles.button.sub}
        onPress={this.onRegisterPressed.bind(this)}>
        <Text style={styles.button.subLabel}>สมัครสมาชิก</Text>
      </TouchableOpacity>
    )
  }

  render() {
    var icoSize = 30
    return (
      <ScrollView style={styles.view.scrollView}>
        <Input
          containerStyle={styles.input.container}
          inputContainerStyle={styles.input.inputContainer}
          inputStyle={styles.input.label}
          placeholderTextColor='#34495E'
          onChangeText={(text) => this.setState({ email: text })}
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType={'email-address'}
          leftIcon={
            <Icon
              name='user-alt'
              size={icoSize}
              style={styles.icon.color} />
          }
          placeholder='อีเมลล์' />
        <Input
          containerStyle={styles.input.container}
          inputContainerStyle={styles.input.inputContainer}
          inputStyle={styles.input.label}
          placeholderTextColor='#34495E'
          onChangeText={(text) => this.setState({ password: text })}
          autoCorrect={false}
          autoCapitalize='none'
          secureTextEntry={true}
          clearTextOnFocus={true}
          leftIcon={
            <Icon
              name='key'
              size={icoSize}
              style={styles.icon.color} />
          }
          placeholder='รหัสผ่าน' />
        <Input
          containerStyle={styles.input.container}
          inputContainerStyle={styles.input.inputContainer}
          inputStyle={styles.input.label}
          placeholderTextColor='#34495E'
          onChangeText={(text) => this.setState({ rePassword: text })}
          autoCorrect={false}
          autoCapitalize='none'
          secureTextEntry={true}
          clearTextOnFocus={true}
          leftIcon={
            <Icon
              name='key'
              size={icoSize}
              style={styles.icon.color} />
          }
          placeholder='รหัสผ่านอีกครั้ง' />
        <Picker
          selectedValue={this.state.type}
          mode='dialog'
          style={{ height: 50, width: '90%', alignSelf: 'center', marginTop: 10 }}
          onValueChange={(value, i) => this.setState({ type: value })}>
          <Picker.Item label='- เลือกประเภทผู้ใช้ -' value='none' />
          <Picker.Item label='นักศึกษา' value='Student' />
          <Picker.Item label='อาจารย์' value='Teacher' />
          <Picker.Item label='ผูดูแล' value='Staff' />
        </Picker>
        <Text style={styles.error.password}>{this.state.error}</Text>
        {this.buttonLoader()}
      </ScrollView>
    )
  }
}

export default RegisterScreen