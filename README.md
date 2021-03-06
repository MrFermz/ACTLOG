# ACTLOG

ระบบบันทึกกิจกรรมนักศึกษาฝึกงานของสาขาวิทยาศาสตร์คอมพิวเตอร์

### ความสามารถ
* นักศึกษา
  - บันทึกรายงานการปฏิบัติงานประจำวัน
  - บันทึกการลงเวลาปฏิบัติงาน
  - อัปโหลดภาพได้
  - <img src="https://github.com/MrFermz/ACTLOG/blob/master/assets/Student.gif" width="250" height="450" />
* อาจารย์
  - ตรวจรายงานการปฏิบัติงาน
  - บันทึกข้อเสนอแนะแก่นักศึกษาฝึกงาน 
  - <img src="https://github.com/MrFermz/ACTLOG/blob/master/assets/Teacher.gif" width="250" height="450" />
* แอดมิน
  - จัดการข้อมูลพื้นฐานในระบบ

### ขั้นตอนติดตั้ง (Android)
* ติดตั้ง [Node.js](https://nodejs.org) โหลดตัว LTS
* เปิด CMD สั่งรัน ```npm install -g react-native-cli```
* ติดตั้ง [Android Studio](https://developer.android.com/studio/)
  - Android SDK
  - Android SDK Platform
  - Performance (Intel ® HAXM)
  - Android Virtual Device
* ติดตั้ง Emulator Android 9.0 (Pie)
  - Android SDK Platform 28
  - Intel x86 Atom_64 System Image
  - รัน Emulator ไว้เลย
* ตั้งค่า Environment Variables
  - ```ANDROID_HOME = ที่อยู่ของ Android SDK```
  - ที่อยู่เดิม ```c:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk```
* โหลดไฟล์โปรเจคแล้วแตกไฟล์ไว้ซักที่
* เปิดหน้า CMD ในโปรเจค
  - ```npm i``` รอจนเสร็จ
  - ```npm start```
  - เปิด CMD อีกอันแล้วพิมพ์ ```react-native run-android```
* เสร็จ

>อาจจะไม่ละเอียดมากนัก ต้องตั้งค่า firebase API นิดหน่อย
