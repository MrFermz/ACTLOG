import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native'
import styles from '../../styles'
import { Card } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationEvents } from 'react-navigation'

export default class ActivityScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: 'บันทึกกิจกรรม',
      headerRight: (
        <TouchableOpacity
          onPress={() => params.edit()}
          style={styles.button.headerRight}>
          {<Icon name='edit' size={30} color='white' />}
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      key: '',
      date: '',
      morning: '',
      afternoon: '',
      list: []
    }
  }

  componentDidMount() {
    const { date, morning, afternoon, key } = this.state
    this.props.navigation.setParams({
      edit: () => this.props.navigation.navigate('StudentAddActivity', {
        key,
        date,
        morning,
        afternoon
      })
    })
    this.getList()
  }

  getList() {
    var uid, items = []
    var date = this.props.navigation.getParam('date')
    var key = this.props.navigation.getParam('key')
    uid = firebase.auth().currentUser.uid
    firebase.database().ref(`timeTable/${uid}/${key}`)
      .once('value').then(snapshot => {
        child = snapshot.val()
        this.setState({
          key,
          date,
          morning: child.morning,
          afternoon: child.afternoon
        })
      })
    firebase.database().ref(`timeTable/${uid}/${key}/photos`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          items.push({
            photo: child.val().photo
          })
        })
        this.setState({ list: items })
      })
  }

  render() {
    const { date, morning, afternoon, list } = this.state
    return (
      <ScrollView style={styles.view.scrollView}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        <View style={styles.view.container}>
          <Card containerStyle={styles.view.cards}>
            <View style={styles.view.headerContainer}>
              <Text style={styles.label.headerTimeTable}>{date}</Text>
              <Text style={styles.label.actLabel}>ช่วงเช้า</Text>
              <Text style={styles.label.subAct}>{morning}</Text>
              <Text style={styles.label.actLabel}>ช่วงบ่าย</Text>
              <Text style={styles.label.subAct}>{afternoon}</Text>
            </View>
          </Card>
        </View>
        {list.map((p, i) => {
          return (
            <Card key={i}>
              <Image
                style={{ width: '100%', height: 300 }}
                source={{ uri: p.photo }} />
            </Card>
          )
        })}
      </ScrollView>
    )
  }
}