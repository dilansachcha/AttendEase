# AttendEase 🚪📱💻

**An IoT-powered Smart Attendance Monitoring System** combining:
- 📱 Mobile app (React Native - Expo)
- 💻 Java EE backend with Hibernate
- 🗃️ MySQL database
- 🔐 ESP32-based Smart Door Controller with Keypad, LCD, Buzzer, Servo Motor, and WhatsApp Alerts

---

## 📸 Demo Preview

| Mobile UI | Hardware | Admin Dashboard |
|----------|----------|-----------------|
| ![Mobile](assets/screenshots/mobile_ui.png) | ![ESP32](assets/screenshots/esp32_device.jpg) | ![Admin](assets/screenshots/admin_panel.png) |

---

## 🔧 Features

### 🧑‍💼 Admin Web Portal (NetBeans)
- View real-time attendance with date filtering & search.
- Manually mark attendance using mobile + passkey.
- Door control & logs display.
- Hibernate ORM with MySQL.
- REST APIs for Mobile & ESP32 interaction.

### 📱 React Native Mobile App (Expo)
- Employee Registration (mobile, name, email, dept, job role, passkey).
- Beautiful UI with custom fonts.
- Admin Sign-in to dashboard.
- Communication with backend via RESTful APIs.

### 🔌 IoT Device (ESP32)
- Smart door unlock on valid attendance.
- 16x2 I2C LCD, 4x4 Keypad, Servo, Ultrasonic sensor.
- Buzzer feedback for success/failure.
- WhatsApp alerts via CallMeBot API.
- Auto door close after user passage detection.

### 🗄️ MySQL Database (Exported via HeidiSQL)
- Tables: `employee`, `attendance`, `attendance_status`, `admin`.
- Relational model with constraints.
- Sample data included.

---

## 📁 Project Structure

```
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
- Open `AttendanceSys` in NetBeans.
- Make sure MySQL is running.
- Edit DB credentials in `hibernate.cfg.xml`.
- Deploy to GlassFish or Tomcat.

### 2. 📱 React Native Mobile App

```bash
cd mobile/AttendanceSystem
npm install
npx expo start
```

Set your `.env` file:

```ini
EXPO_PUBLIC_URL=http://<your-local-ip>:8080
```

### 3. 🤖 Arduino IoT Setup (ESP32)
- Open `iot/sendReq.ino` in Arduino IDE.
- Install dependencies:
  - ESPAsyncWebServer
  - ArduinoJson
  - LiquidCrystal_PCF8574
  - Keypad
  - NewPing
- Replace WiFi credentials inside `.ino`.
- Upload to ESP32.

### 4. 🛢️ MySQL Setup
- Open HeidiSQL or phpMyAdmin.
- Import `/database/attendease.sql`.

---

## 🤖 Smart IoT Door Logic

- ESP32 collects mobile and passkey via keypad.
- Sends HTTP POST to backend.
- On success:
  - Unlocks the door (via Servo).
  - LCD displays “Access Granted”.
  - WhatsApp alert sent to admin.
- Ultrasonic sensor detects passage.
- Door auto-closes afterward.

---

## 🗄️ MySQL Database (Exported via HeidiSQL)

- Tables: `employee`, `attendance`, `attendance_status`, `admin`
- Relational model with constraints.
- Sample data included.

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to use, remix, and distribute!


