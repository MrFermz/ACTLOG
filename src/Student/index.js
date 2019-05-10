import React, { Component } from 'react';
import firebase from 'react-native-firebase'
import {
  createAppContainer,
  createBottomTabNavigator,
  StackActions,
  NavigationActions,
} from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5'

import StdHome from './HomeScreen'
import StdDetail from './DetailScreen'

class Logout extends Component {
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
    return [this.Logout()]
  }
}

var iconSize = 25
const TabStack = createBottomTabNavigator({
  StudentDetail: {
    screen: StdDetail,
    navigationOptions: {
      title: 'ข้อมูลส่วนตัว',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name='info-circle'
          size={iconSize}
          color={tintColor} />
      )
    }
  },
  StudentHome: {
    screen: StdHome,
    navigationOptions: {
      title: 'หน้าแรก',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name='home'
          size={iconSize}
          color={tintColor} />
      )
    }
  },
  StudentLogout: {
    screen: Logout,
    navigationOptions: {
      title: 'ออกจากระบบ',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name='sign-out-alt'
          size={iconSize}
          color={tintColor} />
      )
    }
  }
}, { initialRouteName: 'StudentHome' })

export default createAppContainer(TabStack)