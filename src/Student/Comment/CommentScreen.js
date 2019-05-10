import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import styles from '../../styles'
import {
  Card,
} from 'react-native-elements'

export default class CommentScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      timeCome: '',
      timeBack: '',
      comment: ''
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    var key = this.props.navigation.getParam('key')
    var uid = this.props.navigation.getParam('uid')
    firebase.database().ref(`timeTable/${uid}/${key}`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        this.setState({
          date: val.date,
          timeCome: val.timeCome,
          timeBack: val.timeBack,
          comment: val.comment
        })
      })
  }

  render() {
    const { date, timeCome, timeBack, comment } = this.state
    return (
      <ScrollView
        style={styles.view.scrollView}>
        <Card
          containerStyle={styles.view.cards}>
          <View style={styles.view.timeTableContainer}>
            <Text style={styles.label.headerTimeTable}>{date}</Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <TouchableOpacity
                style={styles.button.timeButtonLeft}>
                <Text style={styles.label._sub}>{timeCome}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button.timeButtonRight}>
                <Text style={styles.label._sub}>{timeBack}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label.sub}>{comment}</Text>
          </View>
        </Card>
      </ScrollView>
    )
  }
}