import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  ScrollView,
  Image
} from 'react-native'
import { Card } from 'react-native-elements'

export default class ViewVisit extends Component {
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
    var items = []
    const { navigation } = this.props
    var key = navigation.getParam('key')
    firebase.database().ref(`visit/${key}/photos`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          items.push({ photo: child.val().photo })
        })
        this.setState({ list: items })
      })
  }

  render() {
    const { list } = this.state
    return (
      <ScrollView>
        {list.map((user, i) => {
          return (
            <Card key={i}>
              <Image
                style={{ width: '100%', height: 300 }}
                source={{ uri: user.photo }} />
            </Card>
          )
        })}
      </ScrollView>
    )
  }
}