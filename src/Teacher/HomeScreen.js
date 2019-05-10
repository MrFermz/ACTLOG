import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import styles from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default class HomeScreen extends Component {
  Visit() {
    this.props.navigation.navigate('TeachVisit')
  }

  Detail() {
    this.props.navigation.navigate('TeachDetail')
  }

  AddStudent() {
    this.props.navigation.navigate('TeachAddStudent')
  }

  render() {
    var icoSize = 100
    return (
      <View style={styles.view.home}>
        <TouchableOpacity
          style={styles.icon.homeMenuContainer}
          onPress={() => this.Visit(this)}>
          <Icon
            name='book'
            size={icoSize}
            style={styles.icon.color} />
          <Text style={styles.label.homeMenu}>บันทึกนิเทศ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon.homeMenuContainer}
          onPress={() => this.AddStudent(this)}>
          <Icon
            name='user-plus'
            size={icoSize}
            style={styles.icon.color} />
          <Text style={styles.label.homeMenu}>เพิ่มนักศึกษา</Text>
        </TouchableOpacity>
      </View>
    )
  }
}