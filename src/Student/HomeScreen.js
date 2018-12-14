import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles'

class HomeScreen extends Component {
    render() {
        let icoSize = 100
        return (
            <View style={styles.home.container}>
                <TouchableOpacity
                    style={styles.home.menu}
                    onPress={() => Alert.alert('Time Table Pressed')}>
                    <Icon
                        name='table'
                        size={icoSize}
                        color='white'
                    />
                    <Text style={styles.common.label}>ลงตารางเวลา</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.home.menu}
                    onPress={() => Alert.alert('Activity Pressed')}>
                    <Icon
                        name='list-ol'
                        size={icoSize}
                        color='white'
                    />
                    <Text style={styles.common.label}>บันทึกกิจกรรม</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.home.menu}
                    onPress={() => Alert.alert('Visit Pressed')}>
                    <Icon
                        name='user-friends'
                        size={icoSize}
                        color='white'
                    />
                    <Text style={styles.common.label}>ดูผลการนิเทศ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.home.menu}
                    onPress={() => Alert.alert('Comments Pressed')}>
                    <Icon
                        name='comments'
                        size={icoSize}
                        color='white'
                    />
                    <Text style={styles.common.label}>ดูความคิดเห็น</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default HomeScreen