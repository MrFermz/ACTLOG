import React, { Component } from 'react'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import firebase from 'react-native-firebase'
import { Card, Input, Rating } from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5'
import styles from '../../styles'

class SelectCompany extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: 'เลือกที่ฝึกงาน',
      headerRight: (
        <TouchableOpacity
          onPress={() => params.add()}
          style={styles.button.headerRight}>
          <Icon name='plus' size={30} color='white' />
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      add: () => this.props.navigation.navigate('StudentAddCom')
    })
    this.getDate()
  }

  getDate() {
    var items = []
    firebase.database().ref('company')
      .once('value').then((snapshot) => {
        // console.log(snapshot.val())
        snapshot.forEach((child) => {
          var key = child.key
          var val = child.val()
          firebase.database().ref(`company/${key}/score`)
            .once('value').then((snapshot) => {
              var sum = 0, avg = 0
              var count = snapshot.numChildren()
              // console.log(count)
              snapshot.forEach((child) => {
                // console.log(child.val().score)
                var score = child.val().score
                sum = sum + score
              })
              console.log(sum)
              avg = sum / count
              avg = parseFloat(Math.round(avg * 100) / 100).toFixed(1)
              console.log(avg)
              items.push({
                name: key,
                address: val.address,
                score: avg
              })
              this.setState({ list: items })
            })
        })
      })
  }

  searchCompany(word) {
    console.log(word)
    var items = []
    firebase.database().ref('company').orderByChild('name').startAt(word).endAt(word + '\uf8ff')
      .once('value').then((snapshot) => {
        console.log(snapshot.val())
        snapshot.forEach((child) => {
          var key = child.key
          var val = child.val()
          firebase.database().ref(`company/${key}/score`)
            .once('value').then((snapshot) => {
              var sum = 0, avg = 0
              var count = snapshot.numChildren()
              console.log(count)
              snapshot.forEach((child) => {
                console.log(child.val().score)
                var score = child.val().score
                sum = sum + score
              })
              avg = sum / count
              avg = parseFloat(Math.round(avg * 100) / 100).toFixed(1)
              items.push({
                name: key,
                address: val.address,
                score: avg
              })
              this.setState({ list: items })
            })
        })
      })
  }

  addCom(name) {
    console.log(name)
    var uid = firebase.auth().currentUser.uid
    firebase.database().ref(`users/${uid}`)
      .update({
        company: name
      })
  }

  render() {
    const { list } = this.state
    // console.log(list)
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
              style={styles.icon.color}
            />
          }
          placeholder='ค้นหา'
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) => this.searchCompany(text)}
        />
        <ScrollView style={styles.view.scrollView}>
          {
            list.map((user, i) => {
              return (
                <Card
                  key={i}
                  containerStyle={styles.view.cards}>
                  <View style={styles.view.headerContainer}>
                    <Text style={styles.label.sub}>{user.name}</Text>
                    <Text style={styles.label.sub}>{user.address}</Text>
                    <Rating
                      type='star'
                      ratingTextColor='orange'
                      readonly
                      // showRating={true}
                      count={5}
                      fractions={1}
                      startingValue={`${user.score}`}
                      size={40}
                    />
                    <TouchableOpacity
                      onPress={() => Alert.alert(
                        'แจ้งเตือน',
                        'แน่ใจที่จะเพิ่มที่ฝึกงาน ?',
                        [
                          {
                            text: 'ยกเลิก',
                            style: 'cancel',
                          },
                          { text: 'ตกลง', onPress: () => this.addCom(user.name) },
                        ],
                        { cancelable: false },
                      )}
                      style={styles.button.main}>
                      <Text style={styles.button.mainLabel}>เพิ่มที่ฝึกงาน</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              )
            })
          }
        </ScrollView >
      </View>
    )
  }
}

export default SelectCompany