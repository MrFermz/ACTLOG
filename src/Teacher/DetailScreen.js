import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import styles from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  Avatar,
  Card
} from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'

export default class DetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fname: '',
      lname: '',
      email: '',
      telNum: '',
      uuid: '',
      avatar: ''
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref(`users/${uid}`)
      .once('value').then(snapshot => {
        var data = snapshot.val()
        this.setState({
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          telNum: data.tel_number,
          uuid: uid,
          avatar: data.avatar
        })
      })
  }

  editDetail() {
    const { fname, lname, email, telNum, avatar } = this.state
    this.props.navigation.navigate('TeachEditDetail', {
      fname,
      lname,
      email,
      telNum,
      avatar
    })
  }

  render() {
    const { fname, lname, email, telNum, uuid, avatar } = this.state
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
                    name='phone'
                    size={22} />
                  <Text style={styles.label.detail}>{telNum}</Text>
                </View>

                <View style={styles.view.containerWithBorder}>
                  <Icon
                    style={styles.icon.detail}
                    name='envelope'
                    size={22} />
                  <Text style={styles.label.detail}>{email}</Text>
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