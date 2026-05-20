# AttendEase 🚪📱💻
[![Watch the Demo](https://img.shields.io/badge/YouTube-Watch_Full_Build_&_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/i9oCqoubkzM?si=McQlb0R2W7dHhXCn)

**An IoT-powered Smart Attendance Monitoring System** combining:
* 📱 Mobile app (React Native - Expo)
* 💻 Java EE backend with Hibernate
* 🗃️ MySQL database
* 🔐 ESP32-based Smart Door Controller with Keypad, LCD, Buzzer, Servo Motor, and WhatsApp Alerts

---

## 📸 Demo Preview

### 📱 Mobile App Interface
| Employee Registration | Admin Dashboard |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/22cc0b9d-3fa8-44d2-8efb-256daf43bdbe" width="250" /> | <img src="https://github.com/user-attachments/assets/1c47f7f4-8ac3-436f-ba63-5e31c16c07d0" width="250" /> |

### 🤖 IoT Hardware Setup
| Smart Door Controller<br><sub>(Sensor, Actuator & LCD)</sub> | ESP32 Wiring & Assembly |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/17706778-1ff1-4679-8823-247ca548d65a" width="250" /> | <img src="https://github.com/user-attachments/assets/dd272b7f-adca-420d-819e-b3b1c941520b" width="250" /> |

### 📩 Automated Alerts
| Email Welcome Notification<br><sub>(with Instructions)</sub> | WhatsApp Access Alerts<br><sub>(for System Admin)</sub> |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/55014ec7-a88e-4dcb-833f-97c983b5b6f4" width="250" /> | <img src="https://github.com/user-attachments/assets/d87b1b46-d9c1-44c3-ab5c-6ec3e9d1cf75" width="250" /> |

---

## 🔧 Features

### 🧑‍💼 Admin Web Portal (NetBeans)
* View real-time attendance with date filtering & search.
* Manually mark attendance using mobile + passkey.
* Door control & logs display.
* Hibernate ORM with MySQL.
* REST APIs for Mobile & ESP32 interaction.

### 📱 React Native Mobile App (Expo)
* Employee Registration (mobile, name, email, dept, job role, passkey).
* Beautiful UI with custom fonts.
* Admin Sign-in to dashboard.
* Communication with backend via RESTful APIs.

### 🔌 IoT Device (ESP32)
* Smart door unlock on valid attendance.
* 16x2 I2C LCD, 4x4 Keypad, Servo, Ultrasonic sensor.
* Buzzer feedback for success/failure.
* WhatsApp alerts via CallMeBot API.
* Auto door close after user passage detection.

### 🗄️ MySQL Database (Exported via HeidiSQL)
* Tables: `employee`, `attendance`, `attendance_status`, `admin`.
* Relational model with constraints.
* Sample data included.

---

## 📁 Project Structure

```text
AttendEase/
├── backend/               # Java EE project (NetBeans)
│   └── AttendanceSys/
│       ├── src/java/
│       ├── web/
│       └── hibernate.cfg.xml
│
├── mobile/                # React Native Expo project
│   └── AttendanceSystem/
│       ├── app/
│       ├── assets/
│       └── index.js, adminhome.js, etc.
│
├── iot/                   # Arduino project for ESP32
│   └── sendReq.ino
│
├── database/              # SQL Dump file
│   └── attendease.sql
│
└── README.md              # This file

```

---

## 🚀 Setup Instructions

### 1. 🧑‍💻 Java Backend (NetBeans)
* Open `AttendanceSys` in NetBeans.
* Make sure MySQL is running.
* Edit DB credentials in `hibernate.cfg.xml`.
* Deploy to GlassFish or Tomcat.

### 2. 📱 React Native Mobile App
Navigate to the mobile directory, install dependencies, and start the server:

    cd mobile/AttendanceSystem
    npm install
    npx expo start

Set your `.env` file with your local IP:

    EXPO_PUBLIC_URL=http://<your-local-ip>:8080

### 3. 🤖 Arduino IoT Setup (ESP32)
* Open `iot/sendReq.ino` in Arduino IDE.
* Install dependencies: `ESPAsyncWebServer`, `ArduinoJson`, `LiquidCrystal_PCF8574`, `Keypad`, `NewPing`.
* Replace WiFi credentials inside `.ino`.
* Upload to ESP32.

### 4. 🛢️ MySQL Setup
* Open HeidiSQL or phpMyAdmin.
* Import `/database/attendease.sql`.

---

## 🤖 Smart IoT Door Logic
* ESP32 collects mobile and passkey via keypad.
* Sends HTTP POST to backend.
* On success: Unlocks the door (via Servo), LCD displays "Access Granted", and a WhatsApp alert is sent to the admin.
* Ultrasonic sensor detects passage.
* Door auto-closes afterward.

---

## 🗄️ MySQL Database (Exported via HeidiSQL)
* Tables: `employee`, `attendance`, `attendance_status`, `admin`
* Relational model with constraints.
* Sample data included.

---

## 📜 License
This project is licensed under the **MIT License**.  
Feel free to use, remix, and distribute!
