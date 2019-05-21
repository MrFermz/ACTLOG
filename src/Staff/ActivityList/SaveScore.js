import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import {
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  View,
  Image,
  ActivityIndicator
} from 'react-native'
import styles from '../../styles'
import {
  Card,
  Rating
} from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Modal from 'react-native-modal'

export default class SaveScore extends Component {
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
                style: 'cancel'
              },
              { text: 'ตกลง', onPress: () => params.save() }
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
      cid: '',
      list: [],
      score1: '',
      score2: '',
      score3: '',
      score4: '',
      score5: '',
      score6: '',
      score7: '',
      score8: '',
      score9: '',
      score10: '',
      progress: '',
      open: false,
      total: 0,
      count: 0
    }
  }

  componentDidMount() {
    this.getList()
    this.props.navigation.setParams({ save: this.saveComment.bind(this) })
  }

  getList() {
    var items = []
    var suid = this.props.navigation.getParam('suid')
    var cuid = this.props.navigation.getParam('cuid')
    var key = this.props.navigation.getParam('key')
    firebase.database().ref('comment')
      .orderByChild('cuid')
      .equalTo(cuid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          var key = child.key
          if (suid == val.suid) {
            firebase.database().ref(`comment/${key}`)
              .once('value').then((snapshot) => {
                var val1 = snapshot.val()
                this.setState({
                  comment: val1.comment,
                  cid: child.key,
                  score1: val1.score1,
                  score2: val1.score2,
                  score3: val1.score3,
                  score4: val1.score4,
                  score5: val1.score5,
                  score6: val1.score6,
                  score7: val1.score7,
                  score8: val1.score8,
                  score9: val1.score9,
                  score10: val1.score10
                })
              })
          }
        })
      })
    firebase.database().ref(`comment/${key}/photos`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          items.push({ photo: child.val().photo })
        })
        this.setState({ list: items })
      })
  }

  saveComment() {
    const { comment, cid, score1, score2, score3, score4, score5, score6, score7, score8, score9, score10 } = this.state
    firebase.database().ref(`comment/${cid}`).update({
      comment,
      score1,
      score2,
      score3,
      score4,
      score5,
      score6,
      score7,
      score8,
      score9,
      score10
    }).then(() => {
      Alert.alert(
        'แจ้งเตือน',
        'บันทึกข้อมูลสำเร็จ.',
        [
          { text: 'ตกลง', onPress: () => this.props.navigation.goBack() }
        ],
        { cancelable: false },
      )
    })
  }

  generator() {
    var length = 20,
      charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      value = ''
    for (var i = 0, n = charset.length; i < length; ++i) {
      value += charset.charAt(Math.floor(Math.random() * n))
    }
    return value
  }

  _pickImage() {
    ImagePicker.openPicker({
      width: 1280,
      height: 720,
      multiple: true,
      mediaType: 'photo'
    }).then((img) => {
      var name = '', total = img.length
      this.setState({ total })
      img.forEach((e) => {
        name = this.generator()
        this.uploadImage(e.path, name)
      })
    })
  }

  uploadImage(uri, name, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      var { navigation } = this.props
      var key = navigation.getParam('key')
      let mime = 'image/jpg'
      const imagePath = uri
      const imageRef = firebase
        .storage()
        .ref(`comment/${key}`)
        .child(name)
      imageRef.put(imagePath, { contentType: mime })
        .then(async () => {
          this.setState({ open: true })
          return imageRef.getDownloadURL()
            .then((url) => {
              this.saveUrl(url, key)
            })
        })
        .then(resolve)
        .catch(reject)
    })
  }

  saveUrl(url, key) {
    firebase.database().ref(`comment/${key}/photos`).push({
      photo: url
    }).then(() => {
      this.setState({ count: this.state.count + 1 })
    })
  }

  handleModal() {
    this.setState({ open: !this.state.open })
  }

  renderModal() {
    const { open, total, count } = this.state
    return (
      <Modal
        isVisible={open}
        animationIn='fadeIn'
        animationOut='fadeOut'
        onModalHide={() => {
          this.setState({ progress: '', count: 0, total: 0 })
        }}
        onBackButtonPress={() => {
          if (count == total) {
            this.handleModal()
          }
        }}
        onBackdropPress={() => {
          if (count == total) {
            this.handleModal()
          }
        }}>
        <View
          style={{
            justifyContent: 'center',
            backgroundColor: 'white',
            width: '100%', height: '30%',
            borderRadius: 20
          }}>
          <Text
            style={{ fontSize: 25, alignSelf: 'center' }}>
            {`${count} / ${total}`}</Text>
          {count == total
            ? <TouchableOpacity
              onPress={() => this.handleModal()}
              style={styles.button.subAdd}>
              <Icon
                size={30}
                name='check' />
            </TouchableOpacity>
            : <ActivityIndicator
              size='large' />}
        </View>
      </Modal>
    )
  }

  render() {
    const { comment, list, score1, score2, score3, score4, score5, score6, score7, score8, score9, score10 } = this.state
    return (
      <ScrollView style={styles.view.scrollView}>
        {this.renderModal()}
        {/* <TouchableOpacity onPress={() => this.handleModal()}>
          <Text>Open Modal</Text>
        </TouchableOpacity> */}
        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>1. การปฏิบัติงานตามระเบียบ และข้อตกลงในการปฏิบัติ</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score1: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score1}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>2. การตรงต่อเวลา</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score2: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score2}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>3. ความรับผิดชอบในการปฏิบัติงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score3: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score3}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>4. ความกระตือรือร้นในการปฏิบัติงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score4: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score4}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>5. ความตั้งใจในการศึกษาหาความรู้</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score5: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score5}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>6. ความมีระเบียบในการจัดเก็บ อุปกรณ์การฝึกงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score6: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score6}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>7. ความประพฤติในระหว่างฝึกงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score7: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score7}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>8. ความมีมนุษย์สัมพันธ์กับบุคคลที่เกี่ยวข้อง</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score8: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score8}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>9. ความอดทนในการเรียนรู้ปฏิบัติงาน</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score9: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score9}
            size={40} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 17,
            marginBottom: 5
          }}>10. ความสำเร็จของผลงานที่ปฏิบัติ</Text>
          <Rating
            type='star'
            onFinishRating={(value) => { this.setState({ score10: value }) }}
            count={8}
            ratingCount={8}
            fractions={1}
            startingValue={score10}
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
          <Text style={styles.button.subLabel}>อัปโหลดรูป</Text>
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