import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native'
import styles from './styles'
import {
  StackActions,
  NavigationActions
} from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Input } from 'react-native-elements'

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      type: '',
      loading: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && this.state.type != 'none') {
        this.getUserType()
      }
    })
  }

  onLoginPressed() {
    const { email, password } = this.state
    this.setState({ loading: true })
    if (email && password && (email != '' || password != '')) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          // if (user.user.emailVerified) {
          this.getUserType()
          // }
          // this.setState({ loading: false })
        })
        .catch((msgError) => {
          this.setState({ loading: false })
          Alert.alert(msgError.message)
        })
    } else {
      this.setState({ loading: false })
      Alert.alert(
        'แจ้งเตือน',
        'กรุณาป้อนข้อมูล!',
        [
          { text: 'ตกลง' },
        ],
        { cancelable: false },
      )
    }
  }

  getUserType() {
    var uid = firebase.auth().currentUser.uid

    this.setState({ type: '' })
    firebase.database().ref(`users/${uid}/typeStat`)
      .once('value').then((snapshot) => {
        if (snapshot.val() == false) {
          this.setState({ loading: false })
        } else {
          firebase.database().ref(`users/${uid}`)
            .once('value').then((snapshot) => {
              var currYear = new Date().getFullYear()
              var val = snapshot.val().type
              var setup = snapshot.val().setup
              var year = snapshot.val().year
              console.log(currYear, year)
              this.setState({ type: val })
              if (this.state.type == val && this.state.type != 'none') {
                if ((val == 'Student') || val == 'Teacher' || val == 'Admin' || val == 'Staff') {
                  this.goHomeScreen(val, setup)
                } else {
                  Alert.alert('invalid years.')
                }
              } else {
                this.setState({ loading: false })
              }
            })
        }
      })
  }

  goHomeScreen(type, setup) {
    if (setup == true) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({
          routeName: 'Setup',
          params: { type: type }
        })]
      })
      this.props.navigation.dispatch(resetAction)
    } else {
      if (type) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
            routeName: type
          })]
        })
        this.props.navigation.dispatch(resetAction)
      }
    }
  }

  onRegisterPressed() {
    this.props.navigation.navigate('Register')
  }

  buttonLoader() {
    if (this.state.loading) {
      return (
        <TouchableOpacity
          disabled={true}
          style={styles.button.main}>
          <ActivityIndicator size='large' color='white' />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        style={styles.button.main}
        onPress={this.onLoginPressed.bind(this)}>
        <Text style={styles.button.mainLabel}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>
    )
  }

  render() {
    var icoSize = 30
    return (
      <View style={styles.view.loginContainer}>
        <Image
          resizeMode='center'
          style={{ width: 220, height: 220 }}
          source={require('../assets/logo.png')} />
        <Text>1.4.0-BETA2</Text>
        <Input
          containerStyle={styles.input.container}
          inputContainerStyle={styles.input.inputContainer}
          inputStyle={styles.input.label}
          placeholderTextColor='#34495E'
          leftIcon={
            <Icon
              name='user-alt'
              size={icoSize}
              style={styles.icon.color}
            />
          }
          placeholder='อีเมลล์'
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='email-address'
          onChangeText={(text) => this.setState({ email: text })} />
        <Input
          containerStyle={styles.input.container}
          inputContainerStyle={styles.input.inputContainer}
          inputStyle={styles.input.label}
          placeholderTextColor='#34495E'
          leftIcon={
            <Icon
              name='key'
              size={icoSize}
              style={styles.icon.color}
            />
          }
          placeholder='รหัสผ่าน'
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })} />
        {this.buttonLoader()}
        <TouchableOpacity
          style={styles.button.sub}
          onPress={this.onRegisterPressed.bind(this)}>
          <Text
            style={styles.button.subLabel}>
            สมัครสมาชิก
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default LoginScreen