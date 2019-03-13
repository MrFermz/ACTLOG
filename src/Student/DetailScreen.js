import React, { Component } from 'react'
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
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  Avatar,
  Card,
  Rating
} from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'
import firebase from 'react-native-firebase'
import styles from '../styles'

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
      modalVisible: false,
      score: '',
      scoreButton: null
    }
  }

  componentDidMount() {
    this.getDetail()
  }

  getDetail() {
    var data
    var uid = firebase.auth().currentUser.uid
    var users = firebase.database().ref('users/' + uid)
    users.once('value').then(snapshot => {
      data = snapshot.val()
      this.setState({
        uuid: uid,
        sid: data.sid,
        fname: data.fname,
        lname: data.lname,
        group: data.group,
        subject: data.subject,
        telNum: data.telNum,
        email: data.email,
        date: data.date,
        sidStat: data.sidStat,
        avatar: data.avatar,
        company: data.company
      })
      console.log(data)
    })
  }

  editDetail() {
    const { sid, fname, lname, group, subject, telNum, email, date, sidStat, uuid, avatar } = this.state
    this.props.navigation.navigate('StudentEditDetail', {
      sid: sid,
      fname: fname,
      lname: lname,
      email: email,
      group: group,
      subject: subject,
      telNum: telNum,
      date: date,
      sidStat: sidStat,
      uuid: uuid,
      avatar: avatar
    })
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  showModal() {
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={{ marginTop: 22 }}>
          <View>
            <Rating
              type='star'
              ratingTextColor='orange'
              showRating={true}
              count={5}
              fractions={1}
              startingValue={2.5}
              size={40}
              onFinishRating={(value) => { this.saveRating(value) }}
            />
            <TouchableOpacity
              style={styles.button.main}
              onPress={() => this.saveScore()}>
              <Text style={styles.button.mainLabel}>บันทึกคะแนน</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  saveRating(value) {
    this.setState({ score: value })
  }

  saveScore() {
    const { score, company } = this.state
    var uid = firebase.auth().currentUser.uid
    console.log(company, score)
    firebase.database().ref(`company/${company}/score/${uid}`)
      .update({
        score: score
      }).then(() => {
        Alert.alert(
          'แจ้งเตือน',
          'บันทึกคะแนนสำเร็จ',
          [
            { text: 'ตกลง', onPress: () => this.setModalVisible(!this.state.modalVisible) }
          ],
          { cancelable: false }
        )
      })
  }

  scoreButtonLoader() {
    const { scoreButton } = this.state
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref(`users/${uid}/company`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        this.setState({ scoreButton: val })
      })
    if (scoreButton) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true)
          }}
          style={{
            width: 100, height: 50,
            alignSelf: 'center', justifyContent: 'center',
            backgroundColor: '#34495E'
          }}>
          <Text style={{ alignSelf: 'center', color: 'white', fontSize: 20 }}>
            ให้คะแนน</Text>
        </TouchableOpacity>
      )
    }
  }

  render() {
    const { sid, fname, lname, group, subject, telNum, email, date, avatar, score, company } = this.state
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        {this.showModal()}
        <ScrollView style={styles.view.scrollView}>
          <View style={styles.view.detailContainer}>
            <Card containerStyle={styles.view.card}>
              <View style={styles.view.headerContainer}>
                <Avatar
                  source={{ uri: avatar }}
                  size='xlarge'
                  rounded
                  containerStyle={{ alignSelf: 'center', margin: 20 }}
                />

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
                  <View style={{ flex: 1, alignSelf: 'center' }}>
                    {this.scoreButtonLoader()}
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
                  <Text style={styles.label.detail}>{date}</Text>
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

export default DetailScreen;