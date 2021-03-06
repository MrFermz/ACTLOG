import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import styles from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default class HomeScreen extends Component {
  TimeTable() {
    this.props.navigation.navigate('StudentTimeTable')
  }

  Visit() {
    this.props.navigation.navigate('StudentVisit')
  }

  render() {
    var icoSize = 100
    return (
      <View style={styles.view.home} >
        <TouchableOpacity
          style={styles.icon.homeMenuContainer}
          onPress={() => this.TimeTable()}>
          <Icon
            name='table'
            size={icoSize}
            style={styles.icon.color} />
          <Text style={styles.label.homeMenu}>ตารางลงเวลา</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon.homeMenuContainer}
          onPress={() => this.Visit(this)}>
          <Icon
            name='suitcase-rolling'
            size={icoSize}
            style={styles.icon.color} />
          <Text style={styles.label.homeMenu}>ดูผลการนิเทศ</Text>
        </TouchableOpacity>
      </View>
    )
  }
}