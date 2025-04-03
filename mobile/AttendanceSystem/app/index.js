import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert, ImageBackground, Modal } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Signup() {

  //const [getImage, setImage] = useState(null);

  const [getMobile, setMobile] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getDepartment, setDepartment] = useState("");
  const [getJobRole, setJobRole] = useState("");
  const [getPassword, setPassword] = useState("");
  //const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [loaded, error] = useFonts(
    {

      "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
      "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
      "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),

    }
  );

  useEffect(
    () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]
  );

  if (!loaded && !error) {
    return null;
  }

  const backgroundImage = require('../assets/attsysbg.png');

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <StatusBar

        hidden={true}
      // animated={true}
      // translucent={true}
      // backgroundColor="transparent"
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>AttendEase</Text>
            <Text style={styles.slogan}>Simplified Attendance Management</Text>
          </View>

          {/* <Pressable onPress={

            async () => {
              let result = await ImagePicker.launchImageLibraryAsync(
                {}
              );

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }

            }
          } style={styles.avatarContainer}>
            <Image source={getImage} style={styles.avatar} contentFit="cover" />
          </Pressable> */}

          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.input}
            maxLength={10}
            placeholder="Enter Mobile number"
            onChangeText={
              (text) => {
                setMobile(text);
              }
            }
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email Address"
            inputMode={"text"}
            onChangeText={
              (text) => {
                setEmail(text);
              }
            }
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter First Name"
            inputMode={"text"}
            onChangeText={
              (text) => {
                setFirstName(text);
              }
            }
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Last Name"
            inputMode={"text"}
            onChangeText={
              (text) => {
                setLastName(text);
              }
            }
          />

          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Department"
            inputMode={"text"}
            onChangeText={
              (text) => {
                setDepartment(text);
              }
            }
          />

          <Text style={styles.label}>Job Role</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Job Role/Position"
            inputMode={"text"}
            onChangeText={
              (text) => {
                setJobRole(text);
              }
            }
          />

          <Text style={styles.label}>Passkey</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Set up a Passkey"
              maxLength={20}
              onChangeText={(text) => setPassword(text)}
            />
            <Pressable onPress={() => setModalVisible(true)}>
              <FontAwesome name="info-circle" size={24} color="#607D8B" />
            </Pressable>
          </View>

          <Pressable style={styles.signupButton} onPress={
            async () => {

              let formData = new FormData(); //khomth for multipart
              formData.append("mobile", getMobile);
              formData.append("email", getEmail);
              formData.append("firstName", getFirstName);
              formData.append("lastName", getLastName);
              formData.append("department", getDepartment);
              formData.append("jobrole", getJobRole);
              formData.append("password", getPassword);

              let response = await fetch(
                process.env.EXPO_PUBLIC_URL + "/AttendanceSys/SysSignUp",
                {
                  method: "POST",
                  body: formData,
                }
              );

              if (response.ok) {
                let json = await response.json();
                //Alert.alert("Response", json.message);

                if (json.success) {//aye ena response ek anuwa
                  Alert.alert("Success", json.message);
                  router.replace("/");//index-signin ekt

                } else {
                  Alert.alert("Error", json.message);

                }
              }

            }
          }>
            <Text style={styles.signupText}>Register as an Employee</Text>
          </Pressable>

          <Pressable
            style={styles.signInButton}
            onPress={
              () => {
                //Alert.alert("Message", "Go to Sign In");
                router.replace("/adminsignin");
              }
            }
          >
            <Text style={styles.signInText}>Admin SignIn</Text>
          </Pressable>
        </View>

        {/* Modal for Passkey Information */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Please pick a passkey containing 4 to 6 characters using
                numbers (0-9) with the letters A, B, C, D only.
              </Text>
              <Text style={styles.modalReminder}>
                *Remember the Passkey & Mobile you Entered to Access the System!
              </Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    contentFit: 'cover',
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#0f1132',
    borderRadius: 25,
    padding: 20,
    width: '100%',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
  },
  avatarContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "black",
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "black",
  },
  label: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: 'Montserrat-Regular',
  },
  signupButton: {
    backgroundColor: '#607D8B',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 20,
    shadowColor: 'white',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  signupText: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
  },
  signInButton: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#607D8B',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },

  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    textAlign: 'center',
  },
  slogan: {
    fontSize: 16,
    fontFamily: 'Montserrat-Light',
    color: '#d1d1d1',
    textAlign: 'center',
    marginTop: 5,
  },

  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    textAlign: 'center',
  },
  slogan: {
    fontSize: 16,
    fontFamily: 'Montserrat-Light',
    color: '#d1d1d1',
    textAlign: 'center',
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalCloseButton: {
    backgroundColor: '#607D8B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  modalReminder: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },

});