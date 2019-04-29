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
import { Card } from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'

class AddStudent extends Component {
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
          // console.log(val.suid)
          vsuid.push(val.suid)
        })
        this.setState({ Vsuid: vsuid })
      })

    firebase.database().ref('users')
      .orderByChild('type')
      .equalTo('Student')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          // console.log(val.uid)
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
        { cancelable: false },
      )
    })
  }

  render() {
    const { list } = this.state
    // console.log(list.length)
    return (
      <ScrollView style={styles.view.scrollView}>
        <View style={styles.view.container}>
          {list.map((user, i) => {
            return (
              <Card key={i} containerStyle={styles.view.cards}>
                <View style={styles.view.headerContainer}>
                  <Text style={styles.label.header}>{user.fname}  {user.lname}</Text>
                  <Text style={styles.label.sub}>{user.email}</Text>
                  <Text style={styles.label.sub}>{user.sid}</Text>
                  <Text style={styles.label.sub}>{user.uid}</Text>
                  {/* <Text style={{ color: 'gray', marginBottom: 20 }}>{user.uid}</Text> */}
                  <TouchableOpacity
                    onPress={() => this.addStudent(user.uid)}
                    style={styles.button.sub}>
                    <Text style={styles.button.subLabel}>เพิ่ม</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

export default AddStudent