import { Alert, Pressable, TextInput, StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

SplashScreen.preventAutoHideAsync();

export default function Home() {
    const [getAttendanceArray, setAttendanceArray] = useState([]);
    const [getFilteredAttendanceArray, setFilteredAttendanceArray] = useState([]);
    const [getSearchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // For date selection
    const [isDatePickerVisible, setDatePickerVisible] = useState(false); // Control date picker visibility


    const [employeeMobile, setEmployeeMobile] = useState('');
    const [employeePasskey, setEmployeePasskey] = useState('');

    const [loaded, error] = useFonts({
        "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
        "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    });

    // Fetch attendance data
    const fetchAttendanceData = async (refreshing = false) => {
        try {
            if (refreshing) setIsRefreshing(true);

            let userJson = await AsyncStorage.getItem("user");
            let user = JSON.parse(userJson);

            if (user) {
                let response = await fetch(process.env.EXPO_PUBLIC_URL + "/AttendanceSys/LoadHomeData");
                if (response.ok) {
                    let json = await response.json();
                    if (json.success) {
                        setAttendanceArray(json.attendance || []);
                        setSearchQuery('');
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        } finally {
            if (refreshing) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const handleDateFilter = (event, date) => {
        setDatePickerVisible(false); // Hide date picker
    
        if (date) {
            // Get the selected date in local time (without time zone shift)
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
            const day = date.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD
    
            setSelectedDate(formattedDate);
    
            // Filter attendance array by selected date
            const filteredByDate = getAttendanceArray.filter(item => {
                return (
                    item.check_in_time.startsWith(formattedDate) || 
                    item.check_out_time.startsWith(formattedDate)
                );
            });
    
            setFilteredAttendanceArray(filteredByDate); // Update the displayed list
        }
    };    

    useEffect(() => {
        const filtered = getAttendanceArray.filter(item => {
            const searchQuery = getSearchQuery.toLowerCase();

            // Combine searchable fields
            return (
                (item.first_name + " " + item.last_name).toLowerCase().includes(searchQuery) ||
                item.employee_id.toString().includes(searchQuery) ||
                item.mobile.toLowerCase().includes(searchQuery) ||
                item.attendance_status.toLowerCase().includes(searchQuery) ||
                item.check_in_time.toLowerCase().includes(searchQuery) ||
                item.check_out_time.toLowerCase().includes(searchQuery)
            );
        });

        setFilteredAttendanceArray(filtered);
    }, [getSearchQuery, getAttendanceArray]);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const handleManualAttendance = async () => {
        // Validate mobile input
        const mobileRegex = /^07[01245678]{1}[0-9]{7}$/;
        if (!mobileRegex.test(employeeMobile)) {
            Alert.alert("Invalid Mobile", "Please enter a valid mobile number.");
            return;
        }

        // Validate passkey input
        const passkeyRegex = /^[0-9ABCD]{4,6}$/;
        if (!passkeyRegex.test(employeePasskey)) {
            Alert.alert("Invalid Passkey", "Passkey must be 4-6 characters long and contain only numbers or letters (A-D).");
            return;
        }

        if (!employeeMobile || !employeePasskey) {
            Alert.alert("Error", "Please enter both mobile and passkey.");
            return;
        }

        try {
            // Validate employee via REST API
            const response = await fetch(process.env.EXPO_PUBLIC_URL + "/AttendanceSys/VerifyEmployee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mobile: employeeMobile,
                    passkey: employeePasskey,
                }),
            });

            const json = await response.json();

            if (json.success) {
                Alert.alert(
                    "Success",
                    `Employee Registered Under Mobile: ${employeeMobile} & Passkey: ${employeePasskey} is ${json.message}`
                );

                fetchAttendanceData();

                setEmployeeMobile('');
                setEmployeePasskey('');

                //req
                try {
                    const doorResponse = await fetch('http://192.168.0.200/open-door', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (doorResponse.ok) {
                        const jsonResponse = await doorResponse.json();
                        Alert.alert("Success", jsonResponse.message);
                    } else {
                        const errorResponse = await doorResponse.json();
                        Alert.alert("Error", errorResponse.message || "Failed to open the door.");
                    }
                } catch (error) {
                    console.error("Door open error:", error);
                    Alert.alert("Error", "Check connection.");
                }

            } else {
                Alert.alert("Error", json.message);
                setEmployeeMobile('');
                setEmployeePasskey('');
            }
        } catch (error) {
            console.error("Manual attendance error:", error);
            Alert.alert("Error", "Something went wrong.");
        }
    };


    const handleSignOut = async () => {
        await AsyncStorage.removeItem("user");
        router.replace("/adminsignin");
        Alert.alert("Signed Out", "You have signed out successfully.");
    };

    return (
        <LinearGradient colors={['#0f1132', '#004d6b', '#0f1132']} style={styles.container}>
            <View style={styles.titleContainer}>
                <Pressable style={styles.smallCalendarButton} onPress={() => setDatePickerVisible(true)}>
                    <Ionicons name="calendar-outline" size={24} color="#FFF" />
                </Pressable>

                {isDatePickerVisible && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateFilter}
                    />
                )}

                <Text style={styles.title}>AttendEase</Text>
                <Pressable style={styles.smallSignOutButton} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={24} color="#FFF" />
                </Pressable>
                <Text style={styles.slogan}>Simplified Attendance Management</Text>
            </View>

            <View style={styles.topBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Employee (ID, Name, Mobile or Status)"
                    placeholderTextColor="#7A7A7A"
                    value={getSearchQuery}
                    onChangeText={setSearchQuery}
                />
                <Ionicons name="search" size={20} color="#7A7A7A" style={styles.searchIcon} />
            </View>

            {/* <View style={styles.header}>
                <Text style={styles.headerTitle}>Attendance Records</Text>
            </View> */}

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => fetchAttendanceData(true)}
                        colors={['#004d6b']}
                    />
                }
            >
                <FlashList
                    data={getFilteredAttendanceArray}
                    renderItem={({ item }) => (
                        <View style={styles.attendanceItem}>
                            <Text style={styles.attendanceText}>
                                Employee ID - <Text style={styles.highlightField}>{item.employee_id} - {item.first_name} {item.last_name}</Text>
                                {"\n"}({item.department} - {item.jobrole})
                            </Text>
                            <Text style={styles.attendanceText}>
                                Email: {item.email}
                            </Text>
                            <Text style={styles.attendanceText}>
                                Mobile: <Text style={styles.highlightNumber}>{item.mobile}</Text>
                            </Text>
                            <Text style={styles.attendanceText}>
                                Passkey: {item.passkey}
                            </Text>
                            <Text style={styles.attendanceText}>
                                Check-in: <Text style={styles.highlightField}>{item.check_in_time}</Text>
                            </Text>
                            <Text style={styles.attendanceText}>
                                Check-out: <Text style={styles.highlightField}>{item.check_out_time}</Text>
                            </Text>
                            <Text style={styles.attendanceText}>
                                Status: <Text style={styles.highlightNumber}>{item.attendance_status}</Text>
                            </Text>
                        </View>
                    )}
                    estimatedItemSize={200}
                />
            </ScrollView>

            <View style={styles.manualAttendanceContainer}>
                <Text style={styles.manualHeader}>Admin Attendance Marking</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Employee Mobile"
                    placeholderTextColor="#7A7A7A"
                    value={employeeMobile}
                    onChangeText={setEmployeeMobile}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Employee Passkey"
                    placeholderTextColor="#7A7A7A"
                    value={employeePasskey}
                    onChangeText={setEmployeePasskey}
                />
                <Pressable style={styles.markAttendanceButton} onPress={handleManualAttendance}>
                    <Text style={styles.buttonText}>Mark Attendance</Text>
                </Pressable>
            </View>

            {/* <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Admin Sign Out</Text>
            </Pressable> */}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 25,
        paddingHorizontal: 10,
        height: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginLeft: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontFamily: "Montserrat-Bold",
        fontSize: 24,
        color: "#FFF",
    },
    attendanceItem: {
        backgroundColor: "#FFF",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    attendanceText: {
        fontFamily: "Montserrat-Regular",
        fontSize: 14,
        marginBottom: 5,
    },
    signOutButton: {
        backgroundColor: '#607D8B',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: {
        fontFamily: "Montserrat-Bold",
        color: '#FFF',
    },
    titleContainer: {
        marginBottom: 20,
        alignItems: 'center',
        position: 'relative',
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
    manualAttendanceContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    manualHeader: {
        fontFamily: "Montserrat-Bold",
        fontSize: 18,
        color: "#004d6b",
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#F1F1F1',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 40,
        marginBottom: 10,
    },
    markAttendanceButton: {
        backgroundColor: '#004d6b',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    smallCalendarButton: {
        position: 'absolute',
        left: 10,   // Aligns to the left side
        top: 5,     // Vertical alignment
        padding: 4.5,
        backgroundColor: '#607D8B',
        borderRadius: 20,
        alignItems: 'center',
    },

    smallSignOutButton: {
        position: 'absolute',
        right: 10,  // Aligns to the right side
        top: 5,
        padding: 4.5,
        backgroundColor: '#607D8B',
        borderRadius: 20,
        alignItems: 'center',
    },
    attendanceItem: {
        backgroundColor: "#FFF",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    employeeIdText: {
        fontFamily: "Montserrat-Bold",
        fontSize: 16,
        color: '#004d6b',
        marginBottom: 5,
    },
    highlightNumber: {
        color: '#e63946', // Bright color for emphasis
        fontFamily: "Montserrat-Bold",
        fontSize: 15.5,
    },
    attendanceText: {
        fontFamily: "Montserrat-Regular",
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
    },
    highlightField: {
        fontFamily: "Montserrat-Bold",
        color: '#004d6b', // Theme-consistent highlight
    },

});
