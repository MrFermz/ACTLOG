import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
  Picker,
  Modal
} from 'react-native'
import styles from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  Avatar,
  Card
} from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'

class DetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fname: '',
      lname: '',
      email: '',
      telNum: '',
      uuid: '',
      avatar: '',
      company: '',
      companyId: '',
      modalVisible: false,
      score: '',
      scoreButton: null,
      dateStartPicker: '',
      dateEndPicker: ''
    }
  }

  componentDidMount() {
    this.getDetail()
  }

  getDetail() {
    var uid = firebase.auth().currentUser.uid

    firebase.database().ref(`users/${uid}`)
      .once('value').then(snapshot => {
        var data = snapshot.val()
        firebase.database().ref('comment')
          .orderByChild('suid')
          .equalTo(uid)
          .once('value').then((snapshot) => {
            snapshot.forEach((child) => {
              var val = child.val()
              var cuid = val.cuid
              firebase.database().ref(`users/${cuid}/company`)
                .once('value').then((snapshot) => {
                  var val2 = snapshot.val()
                  var key = val2
                  firebase.database().ref(`company/${key}`)
                    .once('value').then((snapshot) => {
                      var val3 = snapshot.val()
                      this.setState({
                        uuid: uid,
                        sid: data.sid,
                        fname: data.fname,
                        lname: data.lname,
                        group: data.group,
                        subject: data.subject,
                        telNum: data.telNum,
                        email: data.email,
                        dateStartPicker: data.dateStart,
                        dateEndPicker: data.dateEnd,
                        sidStat: data.sidStat,
                        avatar: data.avatar,
                        company: val3.name,
                        companyId: data.company
                      })
                    })
                })
            })
          })

      })
  }

  editDetail() {
    const { sid, fname, lname, group, subject, telNum, email, sidStat, uuid, avatar, dateStartPicker, dateEndPicker } = this.state
    this.props.navigation.navigate('StudentEditDetail', {
      sid: sid,
      fname: fname,
      lname: lname,
      email: email,
      group: group,
      subject: subject,
      telNum: telNum,
      sidStat: sidStat,
      uuid: uuid,
      avatar: avatar,
      dateStartPicker: dateStartPicker,
      dateEndPicker: dateEndPicker
    })
  }

  render() {
    const { sid, fname, lname, group, subject, telNum, email, dateStartPicker, dateEndPicker, avatar, company } = this.state
    var options = { year: 'numeric', month: 'long', day: 'numeric' }
    var start = new Date(dateStartPicker).toLocaleDateString('th-TH', options)
    var end = new Date(dateEndPicker).toLocaleDateString('th-TH', options)
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        <ScrollView style={styles.view.scrollView}>
          <View style={styles.view.detailContainer}>
            <Card containerStyle={styles.view.card}>
              <View style={styles.view.headerContainer}>
                <Avatar
                  source={{ uri: avatar }}
                  size='xlarge'
                  rounded
                  containerStyle={{ alignSelf: 'center', margin: 20 }} />

                <Text style={styles.label.header}>{fname + '  ' + lname}</Text>

                <View style={styles.view.containerWithBorder}>
                  <Icon
                    style={styles.icon.detail}
                    name='id-card'
                    size={22} />
                  <Text style={styles.label.detail}>{sid}</Text>
                </View>

                <View style={styles.view.containerWithBorder}>
                  <Icon
                    style={styles.icon.detail}
                    name='shapes'
                    size={22} />
                  <Text style={styles.label.detail}>{group}</Text>
                </View>

                <View style={styles.view.containerWithBorder}>
                  <Icon
                    style={styles.icon.detail}
                    name='graduation-cap'
                    size={22} />
                  <Text style={styles.label.detail}>{subject}</Text>
                </View>

                <View style={styles.view.containerWithBorder}>
                  <Icon
                    style={styles.icon.detail}
                    name='phone'
                    size={22} />
                  <Text style={styles.label.detail}>{telNum}</Text>
                </View>

                <View style={styles.view.containerWithBorder}>
                  <View style={{ flex: 2, flexDirection: 'row' }}>
                    <Icon
                      style={styles.icon.detail}
                      name='building'
                      size={22} />
                    <Text style={styles.label.detail}>{company}</Text>
                  </View>
                </View>

                <View style={styles.view.containerWithBorder}>
                  <Icon
                    style={styles.icon.detail}
                    name='envelope'
                    size={22} />
                  <Text style={styles.label.detail}>{email}</Text>
                </View>

                <View style={styles.view.containerWithBorder}>
                  <Icon
                    style={styles.icon.detail}
                    name='clock'
                    size={22} />
                  <Text style={styles.label.detail}>{`${start}\nถึง\n${end}`}</Text>
                </View>

              </View>
            </Card >
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.button.sub}
          onPress={this.editDetail.bind(this)}>
          <Text style={styles.button.subLabel}>แก้ไขข้อมูล</Text>
        </TouchableOpacity>
        {/* <Text style={{ alignSelf: 'center' }}>{uuid}</Text> */}
      </View>
    )
  }
}

export default DetailScreen