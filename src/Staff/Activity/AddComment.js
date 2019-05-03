import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  View,
  Image
} from 'react-native'
import styles from '../../styles'
import {
  Card,
  AirbnbRating,
  Rating
} from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/FontAwesome5'

class AddComment extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    var date = navigation.getParam('date')
    return {
      title: date,
      headerRight: (
        <TouchableOpacity
          onPress={() => Alert.alert(
            'แจ้งเตือน',
            'แน่ใจที่จะบันทึกข้อมูล ?',
            [
              {
                text: 'ยกเลิก',
                style: 'cancel',
              },
              { text: 'ตกลง', onPress: () => params.save() },
            ],
            { cancelable: false },
          )}
          style={styles.button.headerRight}>
          <Icon name='save' size={30} color='white' />
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      comment: ''
    }
  }

  componentDidMount() {
    this.getData()
    this.props.navigation.setParams({ save: this.saveComment.bind(this) })
  }

  getData() {
    var key = this.props.navigation.getParam('key')
    var suid = this.props.navigation.getParam('suid')
    firebase.database().ref(`timeTable/${suid}/${key}`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        this.setState({ comment: val.comment })
      })
  }

  saveComment() {
    const { comment } = this.state
    var key = this.props.navigation.getParam('key')
    var suid = this.props.navigation.getParam('suid')
    firebase.database().ref(`timeTable/${suid}/${key}`).update({
      comment
    }).then(() => {
      Alert.alert(
        'แจ้งเตือน',
        'บันทึกความคิดเห็นแล้ว',
        [
          { text: 'ตกลง', onPress: () => this.props.navigation.goBack() },
        ],
        { cancelable: false },
      )
    })
  }

  render() {
    const { comment } = this.state
    return (
      <ScrollView style={styles.view.scrollView}>
        <TextInput
          style={styles.input.actField}
          multiline={true}
          placeholderTextColor='gray'
          defaultValue={comment}
          placeholder='แสดงความคิดเห็น'
          onChangeText={(text) => this.setState({ comment: text })}
          autoCapitalize='none'
          autoCorrect={false}>
        </TextInput>
      </ScrollView>
    )
  }
}

export default AddComment