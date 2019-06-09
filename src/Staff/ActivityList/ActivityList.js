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
import {
  Card
} from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default class ActivityList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    var items = []
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref('comment')
      .orderByChild('cuid')
      .equalTo(uid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          var key = child.key
          var suid = val.suid
          firebase.database().ref(`users/${suid}`)
            .once('value').then((snapshot) => {
              var val1 = snapshot.val()
              console.log(val1)
              items.push({
                fname: val1.fname,
                lname: val1.lname,
                sid: val1.suid,
                key,
                suid,
                cuid: uid
              })
              this.setState({ list: items })
            })
        })
      })
  }

  onDelete(key) {
    const { list } = this.state
    Alert.alert(
      'แจ้งเตือน',
      'แน่ใจที่จะลบนักศึกษา ?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel'
        },
        {
          text: 'ลบ', onPress: () => {
            firebase.database().ref(`comment/${key}`)
              .remove().then(() => {
                if (list.length == 1) {
                  this.props.navigation.goBack()
                } else {
                  this.componentDidMount()
                }
              })
          }
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    const { list } = this.state
    var icoSize = 30
    return (
      <ScrollView style={styles.view.scrollView}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        <View style={styles.view.container}>
          {list.map((user, i) => {
            return (
              <Card key={i} containerStyle={styles.view.cards}>
                <View style={styles.view.headerContainer}>
                  <Text style={styles.label.header}>{user.fname}  {user.lname}</Text>
                  <Text style={styles.label.sub}>{user.sid}</Text>
                  <TouchableOpacity
                    style={styles.button.sub}
                    onPress={() =>
                      this.props.navigation.navigate('StaffSaveScore', {
                        suid: user.suid,
                        cuid: user.cuid,
                        fname: user.fname,
                        lname: user.lname,
                        key: user.key
                      })}>
                    <Text style={styles.button.subLabel}>ประเมินผล</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button.sub}
                    onPress={() =>
                      this.props.navigation.navigate('StaffActivity', {
                        suid: user.suid,
                      })}>
                    <Text style={styles.button.subLabel}>ตรวจกิจกรรม</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button.subDelete}
                    onPress={() => this.onDelete(user.key)}>
                    <Icon
                      name='trash-alt'
                      size={icoSize}
                      style={styles.icon._color} />
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