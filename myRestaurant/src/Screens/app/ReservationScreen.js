import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ReservationScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState("");

  const handleReservation = () => {
    // Basic validation
    if (!name || !date || !time || !period) {
      Alert.alert("All fields are required!");
      return;
    }

    // Handle reservation logic (example: show confirmation)
    console.log("Reservation made:", name, date, time, period);

    // After reservation, reset form
    setName("");
    setDate("");
    setTime("");
    setPeriod("");

    // Show confirmation message
    Alert.alert("Reservation Confirmed!", "Your reservation has been made successfully.");

    // Navigate to the home screen after reservation
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="white" size={30} />
      </TouchableOpacity>

      {/* Reservation Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Make a Reservation</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="gray"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Time (HH:MM)"
          placeholderTextColor="gray"
          value={time}
          onChangeText={setTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Period"
          placeholderTextColor="gray"
          value={period}
          onChangeText={setPeriod}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleReservation}>
        <Text style={styles.buttonText}>Reserve Table</Text>
      </TouchableOpacity>

     {/* Bottom Navigation Toolbar */}
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Home")}>
              <Ionicons name="home" size={28} color="white" />
              <Text style={styles.iconText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Menu")}>
              <Ionicons name="restaurant" size={28} color="white" />
              <Text style={styles.iconText}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Reservation")}>
              <Ionicons name="calendar-outline" size={28} color="yellow" />
              <Text style={styles.iconText}>Reservation</Text>
            </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("AdminDashboard")}>
                      <Ionicons name="person" size={28} color="white" />
                      <Text style={styles.iconText}>Profile</Text>
                    </TouchableOpacity>
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 20,
    paddingTop:60,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  formTitle: {
    color: "yellow",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "yellow",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#222",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "black",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
});

export default ReservationScreen;
