import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator
} from 'react-navigation'

import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import SetupScreen from './Setup'

//student side
import StdHome from './Student/index'
import StdTimeTable from './Student/TimeTable/TimeTableScreen'
import StdActivity from './Student/Activity/ActivityScreen'
import StdAddActivity from './Student/Activity/AddActivityScreen'
import StdVisit from './Student/Visit/VisitScreen'
import StdViewVisit from './Student/Visit/ViewVisit'
import StdComment from './Student/Comment/CommentScreen'
import StdDetail from './Student/DetailScreen'
import StdEditDetail from './Student/EditDetailScreen'

//teacher side
import TeachHome from './Teacher/index'
import TeachVisit from './Teacher/Visit/VisitScreen'
import TeachSaveVisit from './Teacher/Visit/SaveVisitScreen'
import TeachActivity from './Teacher/Activity/ActivityScreen'
import TeachViewActivity from './Teacher/Activity/ViewActivityScreen'
import TeachDetail from './Teacher/DetailScreen'
import TeachEditDetail from './Teacher/EditDetailScreen'
import TeachAddStudent from './Teacher/AddStudent/AddStudent'

//staff side
import StaffHome from './Staff/index'
import StaffDetail from './Staff/DetailScreen'
import StaffEditDetail from './Staff/EditDetailScreen'
import StaffActivityList from './Staff/ActivityList/ActivityList'
import StaffActivity from './Staff/Activity/ActivityScreen'
import StaffAddComment from './Staff/Activity/AddComment'
import StaffSaveScore from './Staff/ActivityList/SaveScore'
import StaffAddStudent from './Staff/AddStudent/AddStudent'
import StaffSelCom from './Staff/Company/SelectCompany'

const RootStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      title: 'สมัครสมาชิก'
    }
  },
  Setup: {
    screen: SetupScreen
  },

  // นักศึกษา
  Student: {
    screen: StdHome
  },
  StudentTimeTable: {
    screen: StdTimeTable
  },
  StudentActivity: {
    screen: StdActivity
  },
  StudentAddActivity: {
    screen: StdAddActivity
  },
  StudentVisit: {
    screen: StdVisit,
    navigationOptions: {
      title: 'ดูผลการนิเทศ'
    }
  },
  StudentViewVisit: {
    screen: StdViewVisit,
    navigationOptions: {
      title: 'ดูรูปภาพการนิเทศ'
    }
  },
  StudentComment: {
    screen: StdComment,
    navigationOptions: {
      title: 'ความคิดเห็น'
    }
  },
  StudentDetail: {
    screen: StdDetail,
    navigationOptions: {
      title: 'ข้อมูลส่วนตัว'
    }
  },
  StudentEditDetail: {
    screen: StdEditDetail
  },

  // อาาจารย์
  Teacher: {
    screen: TeachHome
  },
  TeachVisit: {
    screen: TeachVisit,
    navigationOptions: {
      title: 'บันทึกนิเทศ'
    }
  },
  TeachSaveVisit: {
    screen: TeachSaveVisit
  },
  TeachActivity: {
    screen: TeachActivity,
    navigationOptions: {
      title: 'ตรวจกิจกรรม'
    }
  },
  TeachViewActivity: {
    screen: TeachViewActivity
  },
  TeachDetail: {
    screen: TeachDetail,
    navigationOptions: {
      title: 'ข้อมูลส่วนตัว'
    }
  },
  TeachEditDetail: {
    screen: TeachEditDetail,
    navigationOptions: {
      title: 'แก้ไขข้อมูลส่วนตัว'
    }
  },
  TeachAddStudent: {
    screen: TeachAddStudent,
    navigationOptions: {
      title: 'เลือกนักศึกษา'
    }
  },

  // staff
  Staff: {
    screen: StaffHome
  },
  StaffDetail: {
    screen: StaffDetail,
    navigationOptions: {
      title: 'ข้อมูลส่วนตัว'
    }
  },
  StaffEditDetail: {
    screen: StaffEditDetail,
    navigationOptions: {
      title: 'แก้ไขข้อมูลส่วนตัว'
    }
  },
  StaffActivityList: {
    screen: StaffActivityList,
    navigationOptions: {
      title: 'ดูกิจกรรม'
    }
  },
  StaffSaveScore: {
    screen: StaffSaveScore
  },
  StaffActivity: {
    screen: StaffActivity,
    navigationOptions: {
      title: 'ตรวจกิจกรรม'
    }
  },
  StaffAddComment: {
    screen: StaffAddComment
  },
  StaffAddStudent: {
    screen: StaffAddStudent,
    navigationOptions: {
      title: 'เลือกนักศึกษา'
    }
  },
  StaffSelCom: {
    screen: StaffSelCom,
    navigationOptions: {
      title: 'เลือกที่ฝึกงาน'
    }
  },

}, {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#34495E'
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerTintColor: 'white'
    }
  })

export default createAppContainer(RootStack)