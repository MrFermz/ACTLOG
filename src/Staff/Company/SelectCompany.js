import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import styles from '../../styles'
import { Card, Input, Rating } from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5'

class SelectCompany extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    this.getDate()
  }

  getDate() {
    var items = []
    firebase.database().ref('company')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var key = child.key
          var val = child.val()
          items.push({
            key: child.key,
            name: val.name,
            address: val.address,
            address1: val.address1,
            address2: val.address2,
            province: val.province,
            zip: val.zip
          })
          this.setState({ list: items })
        })
      })
  }

  searchCompany(word) {
    // console.log(word)
    var items = []
    firebase.database().ref('company')
      .orderByChild('name')
      .startAt(word)
      .endAt(word + '\uf8ff')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var key = child.key
          var val = child.val()
          items.push({
            key,
            name: val.name,
            address: val.address,
            address1: val.address1,
            address2: val.address2,
            province: val.province,
            zip: val.zip
          })
          this.setState({ list: items })
        })
      })
  }

  addCom(key) {
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref(`users/${uid}`).update({
      company: key
    }).then(() => {
      this.props.navigation.navigate('StaffDetail')
    })
  }

  render() {
    const { list } = this.state
    var icoSize = 30
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        <Input
          containerStyle={styles.input.container}
          inputContainerStyle={styles.input.inputContainer}
          inputStyle={styles.input.label}
          placeholderTextColor='#34495E'
          leftIcon={
            <Icon
              name='search'
              size={icoSize}
              style={styles.icon.color} />
          }
          placeholder='ค้นหา'
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) => this.searchCompany(text)} />
        <ScrollView style={styles.view.scrollView}>
          {list.map((user, i) => {
            return (
              <Card
                key={i}
                containerStyle={styles.view.cards}>
                <View style={styles.view.headerContainer}>
                  <Text style={styles.label.sub}>{user.name}</Text>
                  <Text style={styles.label.sub}>
                    {`${user.address} ${user.address1} ${user.address2} ${user.province} ${user.zip}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert(
                      'แจ้งเตือน',
                      'แน่ใจที่จะเพิ่มที่ฝึกงาน ?',
                      [
                        {
                          text: 'ยกเลิก',
                          style: 'cancel',
                        },
                        { text: 'ตกลง', onPress: () => this.addCom(user.key) },
                      ],
                      { cancelable: false },
                    )}
                    style={styles.button.main}>
                    <Text style={styles.button.mainLabel}>เลือกบริษัท</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            )
          })}
        </ScrollView >
      </View>
    )
  }
}

export default SelectCompany