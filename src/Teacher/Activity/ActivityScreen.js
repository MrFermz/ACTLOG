import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import styles from '../../styles'
import {
  Card,
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'

class ActivityScreen extends Component {
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
    var suid = this.props.navigation.getParam('suid')
    var items = []
    firebase.database().ref(`timeTable/${suid}`)
      .once('value').then((snapshot) => {
        // console.log(snapshot.val())
        snapshot.forEach((child) => {
          val = child.val()
          key = child.key
          // console.log(key)
          items.push({
            date: val.date,
            timeCome: val.timeCome,
            timeBack: val.timeBack,
            morning: val.morning,
            afternoon: val.afternoon,
            key: key,
            suid: suid,
            stat: val.stat
          })
          this.setState({
            list: items
          })
        })
      })
  }

  renderCheck(stat) {
    if (stat == 0) {
      return (
        <React.Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat}>
            <Text style={styles.button.subLabel}>ปกติ</Text>
          </TouchableOpacity>
        </React.Fragment>
      )
    } else if (stat == 1) {
      return (
        <React.Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat1}>
            <Text style={styles.button.subLabel}>ขาด</Text>
          </TouchableOpacity>
        </React.Fragment>
      )
    } else if (stat == 2) {
      return (
        <React.Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat2}>
            <Text style={styles.button.subLabel}>สาย</Text>
          </TouchableOpacity>
        </React.Fragment>
      )
    } else if (stat == 3) {
      return (
        <React.Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat3}>
            <Text style={styles.button.subLabel}>ป่วย</Text>
          </TouchableOpacity>
        </React.Fragment>
      )
    } else if (stat == 4) {
      return (
        <React.Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat4}>
            <Text style={styles.button.subLabel}>ลา</Text>
          </TouchableOpacity>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStatWait}>
            <Text style={styles.button.subLabel}>รอตรวจ</Text>
          </TouchableOpacity>
        </React.Fragment>
      )
    }
  }

  render() {
    const { list } = this.state
    return (
      <ScrollView style={styles.view.scrollView}>
        <View style={styles.view.container}>
          {list.slice(0).reverse().map((user, i) => {
            return (
              <Card key={i} containerStyle={styles.view.cards}>
                <View style={styles.view.headerContainer}>
                  <Text style={styles.label.header}>{user.date}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.button.timeButtonLeft}>
                      <Text style={styles.label._sub}>{user.timeCome}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button.timeButtonRight}>
                      <Text style={styles.label._sub}>{user.timeBack}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('TeachViewActivity', {
                        ACT: user.morning,
                        date: user.date,
                        key: user.key,
                        suid: user.suid
                      })}
                      style={styles.button.actMorning}>
                      <Text style={styles.button.subLabel}>เช้า</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('TeachViewActivity', {
                        ACT: user.afternoon,
                        date: user.date,
                        key: user.key,
                        suid: user.suid
                      })}
                      style={styles.button.actAfternoon}>
                      <Text style={styles.button.subLabel}>บ่าย</Text>
                    </TouchableOpacity>
                  </View>
                  {this.renderCheck(user.stat)}
                </View>
              </Card>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

export default ActivityScreen