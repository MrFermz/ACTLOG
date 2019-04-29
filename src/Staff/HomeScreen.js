import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import styles from '../styles'
import {
  StackActions,
  NavigationActions
} from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5'

class HomeScreen extends Component {

  Activity() {
    this.props.navigation.navigate('StaffActivityList')
  }

  SelectCompany() {
    this.props.navigation.navigate('StaffSelCom')
  }

  AddStudent() {
    this.props.navigation.navigate('StaffAddStudent')
  }

  Logout() {
    firebase.auth().signOut().then(() => {
      console.log('Logout...')
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
      this.props.navigation.dispatch(resetAction)
    })
  }

  render() {
    var icoSize = 100
    return (
      <View style={styles.view.home}>
        <TouchableOpacity
          style={styles.icon.homeMenuContainer}
          onPress={() => this.Activity(this)}>
          <Icon
            name='book'
            size={icoSize}
            style={styles.icon.color} />
          <Text style={styles.label.homeMenu}>ดูกิจกรรม</Text>
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
        <TouchableOpacity
          style={styles.icon.homeMenuContainer}
          onPress={() => this.SelectCompany(this)}>
          <Icon
            name='building'
            size={icoSize}
            style={styles.icon.color} />
          <Text style={styles.label.homeMenu}>เลือกบริษัท</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon.homeMenuContainer} />
      </View>
    )
  }
}

export default HomeScreen