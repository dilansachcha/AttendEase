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
