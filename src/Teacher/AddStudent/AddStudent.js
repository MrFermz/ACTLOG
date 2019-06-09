import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native'
import styles from '../../styles'
import { Card, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default class AddStudent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      Vsuid: [],
      suid: []
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    var vsuid = [], suid = []
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref('visit')
      .orderByChild('tuid')
      .equalTo(uid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          vsuid.push(val.suid)
        })
        this.setState({ Vsuid: vsuid })
      })
    firebase.database().ref('users')
      .orderByChild('type_user')
      .equalTo('Student')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          suid.push(val.uid)
        })
        this.setState({ suid })
      }).then(() => {
        this.renerList()
      })
  }

  renerList() {
    const { Vsuid, suid } = this.state
    var final = [], items = []
    final = suid.filter(val => !Vsuid.includes(val))
    final.forEach((val) => {
      firebase.database().ref(`users/${val}`)
        .once('value').then((snapshot) => {
          var val = snapshot.val()
          items.push({
            fname: val.fname,
            lname: val.lname,
            email: val.email,
            sid: val.sid,
            uid: val.uid
          })
          this.setState({ list: items })
        })
    })
  }

  addStudent(suid) {
    const { list } = this.state
    var tuid = firebase.auth().currentUser.uid
    firebase.database().ref('visit').push({
      suid,
      tuid,
      comment: ''
    }).then(() => {
      Alert.alert(
        'แจ้งเตือน',
        'เพิ่มนักศึกษาแล้ว !',
        [
          {
            text: 'ตกลง', onPress: () => {
              if (list.length == 1) {
                this.props.navigation.goBack()
              } else {
                this.componentDidMount()
              }
            }
          },
        ],
        { cancelable: false }
      )
    })
  }

  searchStudent(word) {
    var vsuid = [], suid = []
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref('visit')
      .orderByChild('tuid')
      .equalTo(uid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          vsuid.push(val.suid)
        })
        this.setState({ Vsuid: vsuid })
      })
    firebase.database().ref('users')
      .orderByChild('sid')
      .equalTo(word)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          suid.push(val.uid)
        })
        this.setState({ suid })
      }).then(() => {
        this.renerList()
      })
  }

  render() {
    const { list } = this.state
    var icoSize = 30
    return (
      <View style={{ flex: 1 }}>
        <Input
          containerStyle={styles.input.container}
          inputContainerStyle={styles.input.inputContainer}
          inputStyle={styles.input.label}
          placeholderTextColor='#34495E'
          leftIcon={
            <Icon
              name='search'
              size={icoSize}
              style={styles.icon.color} />
          }
          placeholder='ค้นหา รหัสนักศึกษา'
          keyboardType='numeric'
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) => this.searchStudent(text)} />
        <ScrollView style={styles.view.scrollView}>
          {list.map((user, i) => {
            return (
              <Card key={i} containerStyle={styles.view.cards}>
                <View style={styles.view.headerContainer}>
                  <Text style={styles.label.header}>{user.fname}  {user.lname}</Text>
                  <Text style={styles.label.sub}>{user.email}</Text>
                  <Text style={styles.label.sub}>{user.sid}</Text>
                  {/* <Text style={styles.label.sub}>{user.uid}</Text> */}
                  {/* <Text style={{ color: 'gray', marginBottom: 20 }}>{user.uid}</Text> */}
                  <TouchableOpacity
                    onPress={() => this.addStudent(user.uid)}
                    style={styles.button.subAdd}>
                    <Icon
                      name='plus'
                      size={icoSize}
                      style={styles.icon._color} />
                  </TouchableOpacity>
                </View>
              </Card>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}