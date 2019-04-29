import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import styles from '../../styles'
import {
  Card
} from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'

class ActivityList extends Component {
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
              items.push({
                fname: val1.fname,
                lname: val1.lname,
                sid: val1.sid,
                key: key,
                suid: suid,
                cuid: uid
              })
              this.setState({ list: items })
            })
        })
      })
  }

  render() {
    const { list } = this.state
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
                </View>
              </Card>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

export default ActivityList