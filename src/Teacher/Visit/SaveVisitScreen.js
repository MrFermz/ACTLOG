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

class SaveVisitScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    var fname = navigation.getParam('fname')
    var lname = navigation.getParam('lname')
    return {
      title: fname + '  ' + lname,
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
      comment: '',
      vid: '',
      list: [],
      score1: '',
      score2: '',
      score3: '',
      score4: '',
      score5: ''
    }
  }

  componentDidMount() {
    this.getList()
    this.props.navigation.setParams({ save: this.saveVisit.bind(this) })
  }

  getList() {
    var suid = this.props.navigation.getParam('suid')
    var tuid = this.props.navigation.getParam('tuid')
    var key = this.props.navigation.getParam('key')
    var items = []
    // console.log(`${suid} ${tuid} ${key}`)

    firebase.database().ref('visit')
      .orderByChild('tuid')
      .equalTo(tuid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          if (suid == child.val().suid) {
            firebase.database().ref(`visit/${child.key}`)
              .once('value').then((snapshot) => {
                var val = snapshot.val()
                this.setState({
                  comment: val.comment,
                  vid: child.key,
                  score1: val.score1,
                  score2: val.score2,
                  score3: val.score3,
                  score4: val.score4,
                  score5: val.score5
                })
              })
          }
        })
      })

    firebase.database().ref(`visit/${key}/photos`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          // console.log(child.val().photo)
          items.push({
            photo: child.val().photo
          })
        })
        this.setState({ list: items })
      })
  }

  saveVisit() {
    const { comment, vid, score1, score2, score3, score4, score5 } = this.state
    firebase.database().ref(`visit/${vid}`).update({
      comment,
      score1,
      score2,
      score3,
      score4,
      score5
    }).then(() => {
      Alert.alert(
        'แจ้งเตือน',
        'บันทึกข้อมูลสำเร็จ.',
        [
          { text: 'ตกลง' },
        ],
        { cancelable: false },
      )
      this.props.navigation.goBack()
    })
  }

  _pickImage() {
    ImagePicker.openPicker({
      width: 1280,
      height: 720,
      multiple: true,
      mediaType: 'photo'
    }).then((img) => {
      console.log(img)
      img.forEach((e) => {
        console.log(e.path)
        this.uploadImage(e.path, new Date().getTime())
      })
    })
  }

  uploadImage(uri, time, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      var { navigation } = this.props
      var key = navigation.getParam('key')
      const imagePath = uri
      const imageRef = firebase
        .storage()
        .ref(`visit/${key}`)
        .child(time)
      let mime = 'image/jpg'

      imageRef
        .put(imagePath, { contentType: mime })
        .then(async () => {
          return imageRef.getDownloadURL()
            .then((url) => {
              console.log(url)
              this.saveUrl(url, key)
            })
        })
        .then(resolve)
        .catch(reject)
    })
  }

  saveUrl(url, key) {
    firebase.database().ref(`visit/${key}/photos`).push({
      photo: url
    }).then(() => {
      Alert.alert('อัพโหลดเสร็จแล้ว.')
    })
  }

  render() {
    const { comment, list, score1, score2, score3, score4, score5 } = this.state
    var count = 3
    return (
      <ScrollView style={styles.view.scrollView}>
        {/* <Text>{vid}</Text> */}

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>ความรับผิดชอบต่องานที่ได้รับมอบหมาย</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score1: value }) }}
            count={count}
            ratingCount={count}
            // showRating={true}
            fractions={1}
            startingValue={score1}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>มีความรอบคอบในการทำงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score2: value }) }}
            count={count}
            ratingCount={count}
            // showRating={true}
            fractions={1}
            startingValue={score2}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>มีมนุษย์สัมพันธ์</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score3: value }) }}
            count={count}
            ratingCount={count}
            // showRating={true}
            fractions={1}
            startingValue={score3}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>การตรงต่อเวลา</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score4: value }) }}
            count={count}
            ratingCount={count}
            // showRating={true}
            fractions={1}
            startingValue={score4}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>ปฏิบัติตนถูกต้องตามระเบียบข้อบังคับของสถานที่ฝึกงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score5: value }) }}
            count={count}
            ratingCount={count}
            // showRating={true}
            fractions={1}
            startingValue={score5}
            size={40} />
        </View>

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

        <TouchableOpacity
          onPress={() => this._pickImage()}
          style={styles.button.sub}>
          <Text style={styles.button.subLabel}>อัพโหลดรูป</Text>
        </TouchableOpacity>
        {list.map((user, i) => {
          return (
            <Card key={i}>
              <Image
                style={{ width: '100%', height: 300 }}
                source={{ uri: user.photo }} />
            </Card>
          )
        })}
      </ScrollView>
    )
  }
}

export default SaveVisitScreen