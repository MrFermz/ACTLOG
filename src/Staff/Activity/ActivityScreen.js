import React, { Component, Fragment } from 'react'
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

export default class Activity extends Component {
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
    var suid, items = []
    suid = this.props.navigation.getParam('suid')
    firebase.database().ref(`timeTable/${suid}`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          val = child.val()
          key = child.key
          items.push({
            date: val.date,
            timeCome: val.work_come,
            timeBack: val.work_back,
            morning: val.morning,
            afternoon: val.afternoon,
            key,
            suid,
            stat: val.stat_approve
          })
          this.setState({ list: items })
        })
      })
  }

  onCheck(stat, uid, key) {
    firebase.database().ref(`timeTable/${uid}/${key}`).update({
      stat_approve: stat
    }).then(() => {
      this.componentDidMount()
    })
  }

  renderCheck(stat, suid, key) {
    if (stat == 0) {
      return (
        <Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat}>
            <Text style={styles.button.subLabel}>ปกติ</Text>
          </TouchableOpacity>
        </Fragment>
      )
    } else if (stat == 1) {
      return (
        <Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat1}>
            <Text style={styles.button.subLabel}>ขาด</Text>
          </TouchableOpacity>
        </Fragment>
      )
    } else if (stat == 2) {
      return (
        <Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat2}>
            <Text style={styles.button.subLabel}>สาย</Text>
          </TouchableOpacity>
        </Fragment>
      )
    } else if (stat == 3) {
      return (
        <Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat3}>
            <Text style={styles.button.subLabel}>ป่วย</Text>
          </TouchableOpacity>
        </Fragment>
      )
    } else if (stat == 4) {
      return (
        <Fragment>
          <TouchableOpacity
            disabled
            style={styles.button.subStat4}>
            <Text style={styles.button.subLabel}>ลา</Text>
          </TouchableOpacity>
        </Fragment>
      )
    } else {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => Alert.alert(
              'แจ้งเตือน',
              'แน่ใจหรือไม่ ?',
              [
                {
                  text: 'ยกเลิก',
                  style: 'cancel'
                },
                { text: 'ตกลง', onPress: () => this.onCheck(1, suid, key) }
              ],
              { cancelable: false },
            )}
            style={styles.button.subStat1}>
            <Text style={styles.button.subLabel}>ขาด</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert(
              'แจ้งเตือน',
              'แน่ใจหรือไม่ ?',
              [
                {
                  text: 'ยกเลิก',
                  style: 'cancel'
                },
                { text: 'ตกลง', onPress: () => this.onCheck(2, suid, key) }
              ],
              { cancelable: false },
            )}
            style={styles.button.subStat2}>
            <Text style={styles.button.subLabel}>สาย</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert(
              'แจ้งเตือน',
              'แน่ใจหรือไม่ ?',
              [
                {
                  text: 'ยกเลิก',
                  style: 'cancel'
                },
                { text: 'ตกลง', onPress: () => this.onCheck(0, suid, key) }
              ],
              { cancelable: false },
            )}
            style={styles.button.subStat}>
            <Text style={styles.button.subLabel}>ปกติ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert(
              'แจ้งเตือน',
              'แน่ใจหรือไม่ ?',
              [
                {
                  text: 'ยกเลิก',
                  style: 'cancel'
                },
                { text: 'ตกลง', onPress: () => this.onCheck(3, suid, key) }
              ],
              { cancelable: false },
            )}
            style={styles.button.subStat3}>
            <Text style={styles.button.subLabel}>ป่วย</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert(
              'แจ้งเตือน',
              'แน่ใจหรือไม่ ?',
              [
                {
                  text: 'ยกเลิก',
                  style: 'cancel'
                },
                { text: 'ตกลง', onPress: () => this.onCheck(4, suid, key) }
              ],
              { cancelable: false },
            )}
            style={styles.button.subStat4}>
            <Text style={styles.button.subLabel}>ลา</Text>
          </TouchableOpacity>
        </View>
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
                  <View>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('StaffAddComment', {
                        date: user.date,
                        key: user.key,
                        suid: user.suid
                      })}
                      style={styles.button.sub}>
                      <Text style={styles.button.subLabel}>แสดงความคิดเห็น</Text>
                    </TouchableOpacity>
                  </View>
                  {this.renderCheck(user.stat, user.suid, user.key)}
                </View>
              </Card>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}