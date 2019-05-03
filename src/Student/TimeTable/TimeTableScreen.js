import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import styles from '../../styles'
import {
  Card,
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icon2 from 'react-native-vector-icons/FontAwesome'

class TimeTableScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: 'ตารางลงเวลา',
      headerRight: (
        <TouchableOpacity
          onPress={() => Alert.alert(
            'แจ้งเตือน',
            'แน่ใจที่จะเพิ่มตางราง ?',
            [
              {
                text: 'ยกเลิก',
                style: 'cancel',
              },
              { text: 'เพิ่ม', onPress: () => params.add() },
            ],
            { cancelable: false },
          )}
          style={styles.button.headerRight}>
          {<Icon name='plus' size={30} color='white' />}
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      currentDate: '',
      timeCome: '',
      timeBack: '',
      loading: false
    }
  }

  componentDidMount() {
    this.getList()
    this.props.navigation.setParams({ add: this.addNewList.bind(this) })
  }

  getList() {
    var uid, child, key, currentDate, items = []
    uid = firebase.auth().currentUser.uid
    firebase.database().ref(`timeTable/${uid}`)
      .once('value').then(snapshot => {
        snapshot.forEach((childSnapshot) => {
          key = childSnapshot.key
          child = childSnapshot.val()
          currentDate = child.date
          items.push({
            uid,
            key: key,
            date: child.date,
            timeCome: child.timeCome,
            timeBack: child.timeBack,
            stat: child.stat,
            comment: child.comment
          })
          this.setState({
            currentDate: currentDate,
            timeCome: child.timeCome,
            timeBack: child.timeBack
          })
        })
        this.setState({
          list: items,
        })
      })
  }

  addNewList() {
    var uid = firebase.auth().currentUser.uid
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    date = year + '-' + month + '-' + day

    if (this.state.currentDate != date) {
      this.setState({ loading: true })
      firebase.database().ref(`timeTable/${uid}`).push({
        date: date,
        timeCome: 'ลงเวลามา',
        timeBack: 'ลงเวลากลับ',
        morning: 'ช่วงเช้า',
        afternoon: 'ช่วงบ่าย',
      }).then(() => {
        this.setState({ loading: false })
        this.componentDidMount()
      })
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'วันนี้ลงตารางเวลาแล้ว !',
        [
          { text: 'ปิด' },
        ],
        { cancelable: false },
      )
    }
  }

  timeStampCome = (timeCome, key, date) => {
    var uid, hour, minute, timeStamp
    uid = firebase.auth().currentUser.uid

    hour = new Date().getHours()
    minute = new Date().getMinutes()
    timeStamp = hour + ':' + minute

    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var day = now.getDate()
    now = year + '-' + month + '-' + day

    if ((timeCome == 'ลงเวลามา') && (date == now)) {
      firebase.database().ref(`timeTable/${uid}/${key}`).update({
        timeCome: timeStamp
      }).then(() => {
        this.componentDidMount()
      })
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'ลงเวลามาแล้ว !',
        [
          { text: 'ปิด' },
        ],
        { cancelable: false },
      )
    }
  }

  timeStampBack = (timeBack, key, date) => {
    var uid, hour, minute, timeStamp
    uid = firebase.auth().currentUser.uid

    hour = new Date().getHours()
    minute = new Date().getMinutes()
    timeStamp = hour + ':' + minute

    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var day = now.getDate()
    now = year + '-' + month + '-' + day
    console.log(date, now)

    if ((timeBack == 'ลงเวลากลับ') && (date == now)) {
      firebase.database().ref(`timeTable/${uid}/${key}`).update({
        timeBack: timeStamp
      }).then(() => {
        this.componentDidMount()
      })
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'ลงเวลากลับแล้ว !',
        [
          { text: 'ปิด' },
        ],
        { cancelable: false },
      )
    }
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

  onDelete(uid, key) {
    const { list } = this.state
    Alert.alert(
      'แจ้งเตือน',
      'แน่ใจที่จะลบ ?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ลบ', onPress: () => {
            firebase.database().ref(`timeTable/${uid}/${key}`)
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
      <View style={{ flex: 1, marginBottom: 20 }}>
        <ScrollView style={styles.view.scrollView}>
          {list.slice(0).reverse().map((user, i) => {
            return (
              <Card key={i} containerStyle={styles.view.cards} >
                <View style={styles.view.timeTableContainer}>
                  <Text style={styles.label.headerTimeTable}>{user.date}</Text>
                  <View style={{ flexDirection: 'row', alignSelf: 'center' }}>

                    <TouchableOpacity
                      style={styles.button.timeButtonLeft}
                      onPress={() => this.timeStampCome(user.timeCome, user.key, user.date)}>
                      <Text style={styles.label._sub}>{user.timeCome}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button.timeButtonRight}
                      onPress={() => this.timeStampBack(user.timeBack, user.key, user.date)}>
                      <Text style={styles.label._sub}>{user.timeBack}</Text>
                    </TouchableOpacity>

                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('StudentActivity', {
                        date: user.date,
                        key: user.key
                      })
                    }
                    style={styles.button.actEdit}>
                    <Icon
                      name='edit'
                      size={30}
                      color='white' />
                  </TouchableOpacity>
                  <View
                    style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    {this.renderCheck(user.stat)}
                    <TouchableOpacity
                      style={styles.button.subComment}
                      onPress={() =>
                        this.props.navigation.navigate('StudentComment', {
                          key: user.key,
                          uid: user.uid,
                          date: user.date,
                          timeCome: user.timeCome,
                          timeBack: user.timeBack,
                          comment: user.comment
                        })
                      }>
                      <Icon2
                        name='wechat'
                        size={icoSize}
                        style={styles.icon.color} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button.subDelete}
                      onPress={() => this.onDelete(user.uid, user.key)}>
                      <Icon
                        name='trash-alt'
                        size={icoSize}
                        style={styles.icon._color} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card >
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

export default TimeTableScreen