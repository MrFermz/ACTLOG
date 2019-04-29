import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  ScrollView,
} from 'react-native'
import styles from '../../styles'
import {
  Card,
} from 'react-native-elements'

class CommentScreen extends Component {
  render() {
    return (
      <View>
        <Text>
          Comment Screen
        </Text>
      </View>
      // <ScrollView style={styles.common.scrollView}>
      //   {comment.map((cm, i) => {
      //       return (
      //         <View key={i} style={styles.comment.container}>
      //           <Card containerStyle={styles.common.card}>
      //             <Text style={styles.comment.label}>{cm.staff}</Text>
      //             <Text style={styles.comment.labelSub}>{cm.staffComment}</Text>
      //           </Card>
      //           <Card containerStyle={styles.common.card}>
      //             <Text style={styles.comment.label}>{cm.boss}</Text>
      //             <Text style={styles.comment.labelSub}>{cm.bossComment}</Text>
      //           </Card>
      //           <Card containerStyle={styles.common.card}>
      //             <Text style={styles.comment.label}>{cm.subject}</Text>
      //             <Text style={styles.comment.labelSub}>{cm.subComment}</Text>
      //           </Card>
      //         </View >
      //       )
      //     })}
      // </ScrollView>
    )
  }
}

export default CommentScreen