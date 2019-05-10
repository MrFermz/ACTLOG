import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
  Image
} from 'react-native'
import styles from '../../styles'
import {
  Card,
} from 'react-native-elements'

export default class CheckActivityScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('date')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    this.getDetail()
  }

  getDetail() {
    var items = []
    var key = this.props.navigation.getParam('key')
    var suid = this.props.navigation.getParam('suid')
    firebase.database().ref(`timeTable/${suid}/${key}/photos`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          items.push({ photo: child.val().photo })
        })
        this.setState({ list: items })
      })
  }

  render() {
    const { list } = this.state
    var ACT = this.props.navigation.getParam('ACT')
    return (
      <ScrollView style={styles.view.scrollView}>
        <View style={styles.view.headerContainer}>
          <Card containerStyle={styles.view.cards}>
            <View style={styles.label.header}>
              <Text style={styles.label.sub}>{ACT}</Text>
            </View>
            {list.map((user, i) => {
              return (
                <Card key={i}>
                  <Image
                    style={{ width: '100%', height: 300 }}
                    source={{ uri: user.photo }} />
                </Card>
              )
            })}
          </Card>
        </View>
      </ScrollView>
    )
  }
}