import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput
} from 'react-native'
import styles from '../../styles'
import Icon from 'react-native-vector-icons/FontAwesome5'

class AddCompany extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: 'เพิ่มที่ฝึกงาน',
      headerRight: (
        <TouchableOpacity
          onPress={() => Alert.alert(
            'แจ้งเตือน',
            'แน่ใจที่จะเพิ่มที่ฝึกงาน ?',
            [
              {
                text: 'ยกเลิก',
                style: 'cancel',
              },
              { text: 'ตกลง', onPress: () => params.add() },
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
      name: '',
      address: ''
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      add: this.addCom.bind(this)
    })
  }

  addCom() {
    const { name, address } = this.state
    firebase.database().ref(`company/${name}`).update({
      name: name,
      address: address
    }).then(() => {
      this.props.navigation.goBack()
    })
  }

  render() {
    return (
      <ScrollView style={styles.view.scrollView}>
        <TextInput
          style={styles.input.borderWithFont}
          placeholderTextColor='gray'
          placeholder='ชื่อที่ฝึกงาน'
          onChangeText={(text) => this.setState({ name: text })}
          autoCapitalize='none'
          autoCorrect={false} />
        <TextInput
          style={styles.input.actField}
          placeholderTextColor='gray'
          placeholder='ที่อยู่'
          multiline={true}
          onChangeText={(text) => this.setState({ address: text })}
          autoCapitalize='none'
          autoCorrect={false} />
      </ScrollView>
    )
  }
}

export default AddCompany