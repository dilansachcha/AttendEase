#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Wire.h>
#include <LiquidCrystal_PCF8574.h>
#include <Keypad.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>
#include <NewPing.h>
#include <esp_task_wdt.h>

const char* ssid = "44SS";
const char* password = "aqimcmpSachchaDilan5";
// const char* ssid = "Redmi12C";
// const char* password = "aqimcmp5";
//const char* ssid = "SAMEERA";
//const char* password = "Meth123@05";
// const char* ssid = "LenovoG";
// const char* password = "CMP@7410";

const char* serverUrl = "https://0b60-61-245-171-101.ngrok-free.app/AttendanceSys/VerifyEmployee";

AsyncWebServer server(80);  // Port 80 for HTTP

LiquidCrystal_PCF8574 lcd(0x27);

const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};
byte rowPins[ROWS] = { 13, 12, 14, 27 };
byte colPins[COLS] = { 26, 25, 33, 32 };
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

#define BUTTON_PIN 15
#define LONG_PRESS_DURATION 500

// Servo setup
Servo doorServo;
const int servoPin = 4;
bool doorOpen = false;
unsigned long buttonPressTime = 0;
bool buttonPressed = false;

const int buzzerPin = 5;


const int trigPin = 18;
const int echoPin = 19;
#define MAX_DISTANCE 200
NewPing sonar(trigPin, echoPin, MAX_DISTANCE);

// Vars
String mobileNumber = "";
String passkey = "";
bool enteringMobile = true;

void playTone(int frequency, int duration);
void buzzerSound(bool success);
void sendRequestToServlet(String mobile, String pass);
void sendWhatsAppMessage(String message);  // New function prototype
void checkDoorPassage();

void setup() {
  //Serial.begin(115200);
  lcd.begin(16, 2);
  lcd.setBacklight(255);
  lcd.setCursor(0, 0);
  lcd.print("---ATTENDEASE---");
  lcd.setCursor(0, 1);
  lcd.print("Connecting");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    lcd.print(".");
  }

  lcd.clear();
  lcd.print("WiFi Connected!");

  doorServo.attach(servoPin);
  doorServo.write(0);

  //REST API
  server.on("/open-door", HTTP_GET, [](AsyncWebServerRequest* request) {
    checkDoorPassage();
    request->send(200, "application/json", "{\"message\": \"Attendance Processed, Door Opened and Person Passed Successfully!\"}");
    delay(1000);
    ESP.restart();
  });
  server.begin();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter Mobile No:");

  pinMode(BUTTON_PIN, INPUT);
  doorServo.attach(servoPin);
  doorServo.write(0);
  pinMode(buzzerPin, OUTPUT);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  handleManualDoor();

  char key = keypad.getKey();
  if (key) {
    if (key == '#') {  //Enter
      if (enteringMobile) {
        if (validateMobile(mobileNumber)) {
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Enter Passkey:");
          enteringMobile = false;
        } else {
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Invalid Mobile!");
          buzzerSound(false);
          delay(2000);
          lcd.clear();
          lcd.print("Enter Mobile No:");
          mobileNumber = "";
        }
      } else {
        if (validatePasskey(passkey)) {
          sendRequestToServlet(mobileNumber, passkey);
          enteringMobile = true;
          mobileNumber = "";
          passkey = "";
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Enter Mobile No:");
        } else {
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Invalid Passkey!");
          buzzerSound(false);
          delay(2000);
          lcd.clear();
          lcd.print("Enter Passkey:");
          passkey = "";
        }
      }
    } else if (key == '*') {  // BackSpace
      if (enteringMobile && mobileNumber.length() > 0) {
        mobileNumber.remove(mobileNumber.length() - 1);
      } else if (!enteringMobile && passkey.length() > 0) {
        passkey.remove(passkey.length() - 1);
      }
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.setCursor(0, 1);
      lcd.print(enteringMobile ? mobileNumber : passkey);
    } else {
      if (enteringMobile && mobileNumber.length() < 10) {
        mobileNumber += key;
      } else if (!enteringMobile && passkey.length() < 6) {
        passkey += key;
      }
      lcd.setCursor(0, 1);
      lcd.print(enteringMobile ? mobileNumber : passkey);
    }
  }
}

void handleManualDoor() {
  int reading = digitalRead(BUTTON_PIN);

  if (reading == HIGH && !buttonPressed) {
    buttonPressed = true;
    buttonPressTime = millis();
  } else if (reading == LOW && buttonPressed) {
    unsigned long pressDuration = millis() - buttonPressTime;
    buttonPressed = false;

    if (pressDuration >= LONG_PRESS_DURATION) {
      toggleDoor();
    }
  }
}

void toggleDoor() {
  doorOpen = !doorOpen;

  if (doorOpen) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Manually opening");
    lcd.setCursor(0, 1);
    lcd.print("the door...");
    doorServo.write(180);
    delay(500);
  } else {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Manually closing");
    lcd.setCursor(0, 1);
    lcd.print("the door...");
    doorServo.write(0);
    delay(2000);
    ESP.restart();
  }
}

void checkDoorPassage() {
  buzzerSound(true);
  doorServo.write(180);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Door Opened...");
  lcd.setCursor(0, 1);
  lcd.print("Waiting...");

  long distance;
  bool personDetected = false;

  while (true) {
    distance = sonar.ping_cm();
    esp_task_wdt_reset();
    if (distance > 0 && distance <= 8) {
      personDetected = true;
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Person Detected...");
      lcd.setCursor(0, 1);
      lcd.print("Remaining Open...");
      break;
    }
    delay(100);
  }

  while (personDetected) {
    distance = sonar.ping_cm();
    esp_task_wdt_reset();
    if (distance == 0 || distance > 8) {
      int confirmationCount = 0;
      for (int i = 0; i < 3; i++) {
        distance = sonar.ping_cm();
        if (distance == 0 || distance > 8) {
          confirmationCount++;
        }
        esp_task_wdt_reset();
        delay(100);
      }
      if (confirmationCount == 3) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Person Passed...");
        lcd.setCursor(0, 1);
        lcd.print("Door Closing...");
        delay(1000);
        personDetected = false;
      }
    }
    delay(100);
  }

  doorServo.write(0);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Door Closed.");
  buzzerSound(true);
  esp_task_wdt_reset();
}

bool validateMobile(String mobile) {
  return mobile.length() == 10 && mobile.startsWith("07") && (mobile.charAt(2) >= '0' && mobile.charAt(2) <= '8');
}

bool validatePasskey(String pass) {
  if (pass.length() < 4 || pass.length() > 6) return false;
  for (int i = 0; i < pass.length(); i++) {
    char c = pass.charAt(i);
    if (!isdigit(c) && !(c >= 'A' && c <= 'D')) return false;
  }
  return true;
}

void sendRequestToServlet(String mobile, String pass) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"mobile\":\"" + mobile + "\", \"passkey\":\"" + pass + "\"}";
    int httpResponseCode = http.POST(payload);

    lcd.clear();
    if (httpResponseCode > 0) {
      String response = http.getString();
      DynamicJsonDocument doc(512);
      DeserializationError error = deserializeJson(doc, response);

      if (error) {
        Serial.print("JSON Error: ");
        Serial.println(error.c_str());
        lcd.setCursor(0, 0);
        lcd.print("JSON Error!");
        buzzerSound(false);
        return;
      }

      if (doc.containsKey("success") && doc["success"].is<bool>()) {

        bool success = doc["success"];
        String message = doc["message"] | "No Message";
        lcd.clear();
        if (success) {
          lcd.setCursor(0, 0);
          lcd.print("Access Granted:)");
          lcd.setCursor(0, 1);
          //lcd.print("Record Saved!");
          lcd.print(message);
          delay(1000);
          checkDoorPassage();
          sendWhatsAppMessage("Access GRANTED (" + String("*") + message + String("*") + ") for Mobile: " + mobile + " under Passkey: " + pass);
          delay(1000);
          ESP.restart();

        } else {
          lcd.setCursor(0, 0);
          lcd.print("Access Denied!");
          lcd.setCursor(0, 1);
          //lcd.print("Invalid Info:(");
          lcd.print(message);
          buzzerSound(false);
          doorServo.write(0);
          sendWhatsAppMessage("Access DENIED (" + String("*") + message + String("*") + ") for Mobile: " + mobile + " under Passkey: " + pass);
          delay(1000);
          ESP.restart();
        }
      } else {
        lcd.setCursor(0, 0);
        lcd.print("Unexpected Resp!");
        buzzerSound(false);
      }
    } else {
      lcd.setCursor(0, 0);
      lcd.print("HTTP Error!");
      Serial.print("HTTP Error: ");
      Serial.println(httpResponseCode);
      buzzerSound(false);
    }

    delay(2000);
    lcd.clear();
    http.end();
  } else {
    lcd.setCursor(0, 0);
    lcd.print("WiFi Disconnected!");
    buzzerSound(false);
    delay(3000);
  }
}


String urlEncode(String message) {
  String encodedMessage = "";
  for (int i = 0; i < message.length(); i++) {
    char c = message.charAt(i);
    if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
      encodedMessage += c;
    } else if (c == ' ') {
      encodedMessage += "%20";
    } else {
      encodedMessage += '%';
      encodedMessage += String(c, HEX);
    }
  }
  return encodedMessage;
}

void sendWhatsAppMessage(String message) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String encodedMessage = urlEncode(message);

    //String url = "https://api.callmebot.com/whatsapp.php?phone=94771855521&text=" + encodedMessage + "&apikey=6459025";
    String url = "https://api.callmebot.com/whatsapp.php?phone=94776592267&text=" + encodedMessage + "&apikey=8938331";

    http.begin(url);

    int httpResponseCode = http.GET();
    if (httpResponseCode == 200) {
      Serial.println("WhatsApp message sent successfully");
    } else {
      Serial.print("WhatsApp message failed. Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi disconnected. Cannot send WhatsApp message.");
  }
}


void playTone(int frequency, int duration) {
  int period = 1000000 / frequency;
  int halfPeriod = period / 2;

  unsigned long startTime = millis();
  while (millis() - startTime < duration) {
    digitalWrite(buzzerPin, HIGH);
    delayMicroseconds(halfPeriod);
    digitalWrite(buzzerPin, LOW);
    delayMicroseconds(halfPeriod);
  }
}

void buzzerSound(bool success) {
  if (success) {
    for (int i = 0; i < 3; i++) {
      playTone(1000, 100);
      delay(100);
    }
  } else {
    for (int i = 0; i < 2; i++) {
      playTone(500, 300);
      delay(100);
    }
  }
}
