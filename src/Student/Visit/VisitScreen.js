import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal
} from 'react-native'
import {
  Card,
  Rating,
  AirbnbRating
} from 'react-native-elements'
import firebase from 'react-native-firebase'
import styles from '../../styles'

class VisitScreen extends Component {
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
    var suid = firebase.auth().currentUser.uid
    var items = []

    firebase.database().ref('visit')
      .orderByChild('suid')
      .equalTo(suid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          firebase.database().ref(`users/${val.tuid}`)
            .once('value').then((snapshot) => {
              var val1 = snapshot.val()
              items.push({
                fname: val1.fname,
                lname: val1.lname,
                email: val1.email,
                comment: val.comment,
                score1: val.score1,
                score2: val.score2,
                score3: val.score3,
                score4: val.score4,
                score5: val.score5,
              })
              this.setState({ list: items })
            })
        })
      })
  }

  render() {
    const { list } = this.state
    return (
      <ScrollView style={styles.view.scrollView}>
        {list.map((user, i) => {
          return (
            <View style={styles.view.container}>
              <Card key={i} containerStyle={styles.view.cards}>
                <View style={styles.view.headerContainer}>
                  <Text style={styles.label.header}>{user.fname}  {user.lname}</Text>
                  <Text style={styles.label.sub}>{user.email}</Text>
                  <View style={{ marginTop: 40 }}>
                    <Text style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      marginBottom: 5
                    }}>ความรับผิดชอบต่องานที่ได้รับมอบหมาย</Text>
                    <Rating
                      key={i}
                      readonly
                      count={5}
                      fractions={1}
                      startingValue={user.score1}
                      size={40} />
                  </View>
                  <View style={{ marginTop: 40 }}>
                    <Text style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      marginBottom: 5
                    }}>มีความรอบคอบในการทำงาน</Text>
                    <Rating
                      key={i}
                      readonly
                      count={5}
                      fractions={1}
                      startingValue={user.score2}
                      size={40} />
                  </View>
                  <View style={{ marginTop: 40 }}>
                    <Text style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      marginBottom: 5
                    }}>มีมนุษย์สัมพันธ์</Text>
                    <Rating
                      key={i}
                      readonly
                      count={5}
                      fractions={1}
                      startingValue={user.score3}
                      size={40} />
                  </View>
                  <View style={{ marginTop: 40 }}>
                    <Text style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      marginBottom: 5
                    }}>การตรงต่อเวลา</Text>
                    <Rating
                      key={i}
                      readonly
                      count={5}
                      fractions={1}
                      startingValue={user.score4}
                      size={40} />
                  </View>
                  <View style={{ marginTop: 40 }}>
                    <Text style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      marginBottom: 5
                    }}>ปฏิบัติตนถูกต้องตามระเบียบข้อบังคับของสถานที่ฝึกงาน</Text>
                    <Rating
                      key={i}
                      readonly
                      count={5}
                      fractions={1}
                      startingValue={user.score5}
                      size={40} />
                  </View>
                  <Text style={styles.label.visitComment}>{user.comment}</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('StudentViewVisit', {
                      key: user.key
                    })}
                    style={styles.button.sub}>
                    <Text style={styles.button.subLabel}>ดูรูปเพิ่มเติม</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          )
        })}
      </ScrollView>
    )
  }
}

export default VisitScreen;