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

class VisitScreen extends Component {
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
    var uid = firebase.auth().currentUser.uid
    var items = []

    firebase.database().ref('visit')
      .orderByChild('tuid')
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
                tuid: uid
              })
              this.setState({ list: items })
            })
        })
      })
  }

  render() {
    const { list } = this.state
    // console.log(list)
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
                      this.props.navigation.navigate('TeachSaveVisit', {
                        suid: user.suid,
                        tuid: user.tuid,
                        fname: user.fname,
                        lname: user.lname,
                        key: user.key
                      })}>
                    <Text style={styles.button.subLabel}>บันทึกนิเทศ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button.sub}
                    onPress={() =>
                      this.props.navigation.navigate('TeachActivity', {
                        suid: user.suid,
                      })}>
                    <Text style={styles.button.subLabel}>ดูบันทึกกิจกรรม</Text>
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

export default VisitScreen