import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert, ImageBackground } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import AsyncStorage from "@react-native-async-storage/async-storage";//curly brackets ntuw
import { StatusBar } from 'expo-status-bar';
import { router, Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Signin() {

    //console.log("1");

    // const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getUsername, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const [loaded, error] = useFonts(
        {

            "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
            "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
            "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),

        }
    );

    useEffect(
        () => {

            async function checkUserInAsyncStorage() {
                try {
                    let userJson = await AsyncStorage.getItem("user");
                    if (userJson != null) {
                        router.replace("/adminhome");
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            checkUserInAsyncStorage();//immediately call krnw
        }, []//empty array
    );

    useEffect(
        () => {
            //console.log("4");
            if (loaded || error) {
                SplashScreen.hideAsync();//font ek load welnn thmai udin dpu splashscreen ek hide wenne
            }
        }, [loaded, error]
    );

    if (!loaded && !error) {
        //console.log("2");
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

                    {/* <View style={styles.avatarContainer}>
                        <Text style={styles.text6}>{getName}</Text>

                    </View> */}

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>AttendEase</Text>
                        <Text style={styles.slogan}>Simplified Attendance Management</Text>
                    </View>

                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter the Given admin Username"
                        onChangeText={
                            (text) => {
                                setUsername(text);
                            }
                        }
                    />


                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            secureTextEntry={!showPassword}
                            placeholder="Enter you given admin Password"
                            inputMode={"text"}
                            maxLength={20}
                            onChangeText={(text) => setPassword(text)}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <FontAwesome6
                                name={showPassword ? "eye" : "eye-slash"}
                                size={20}
                                color="#607D8B"
                            />
                        </Pressable>
                    </View>



                    <Pressable
                        style={styles.signupButton}
                        onPress={
                            async () => {

                                let response = await fetch(
                                    process.env.EXPO_PUBLIC_URL + "/AttendanceSys/SysSignIn",
                                    {
                                        method: "POST",
                                        body: JSON.stringify(
                                            {
                                                username: getUsername,
                                                password: getPassword,
                                            }
                                        ),
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    }
                                );

                                if (response.ok) {
                                    let json = await response.json();

                                    if (json.success) {//aye ena response ek anuwa
                                        //user signin success
                                        let user = json.user;
                                        //Alert.alert("Success", "Hi " + user.first_name + " , " + json.message);

                                        try {

                                            //console.log(user);

                                            await AsyncStorage.setItem("user", JSON.stringify(user));
                                            router.replace("/adminhome");

                                        } catch (e) {

                                            Alert.alert("Error", "Unable to Proces your request");

                                        }

                                    } else {
                                        //problem occured
                                        Alert.alert("Error", json.message);

                                    }
                                }

                            }
                        }>
                        <Text style={styles.signupText}>Sign in as an Admin</Text>
                    </Pressable>

                    <Pressable
                        style={styles.signInButton}
                        onPress={
                            () => {
                                router.push("/");
                            }
                        }

                    >
                        <Text style={styles.signInText}>Back to Employee Registration</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </ImageBackground>
    );


}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
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
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 5,
        borderColor: "black",
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
        textAlign: 'center',
    },

    text6: {
        fontSize: 40,
        fontFamily: "Montserrat-Bold",
        color: "#7B3F00"
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        marginRight: 10,
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
      

});
