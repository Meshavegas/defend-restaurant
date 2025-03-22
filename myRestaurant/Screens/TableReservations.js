import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const TableReservations = () => {
  const navigation = useNavigation();

  const [reservations, setReservations] = useState([
    { id: "1", customerName: "John Doe", date: "2025-03-20", time: "7:00 PM", period: "Evening", status: "Pending" },
    { id: "2", customerName: "Jane Smith", date: "2025-03-21", time: "6:30 PM", period: "Evening", status: "Approved" },
    { id: "3", customerName: "Sam Wilson", date: "2025-03-22", time: "8:00 PM", period: "Night", status: "Pending" },
  ]);

  const [newReservation, setNewReservation] = useState({
    customerName: "",
    date: "",
    time: "",
    period: "Morning", // Default period
  });

  const handleAddReservation = () => {
    if (!newReservation.customerName || !newReservation.date || !newReservation.time) {
      Alert.alert("Error", "Please fill in all fields before adding a reservation.");
      return;
    }
    setReservations((prevReservations) => [
      ...prevReservations,
      { id: Math.random().toString(), ...newReservation, status: "Pending" },
    ]);
    setNewReservation({ customerName: "", date: "", time: "", period: "Morning" });
  };

  const handleChangeStatus = (reservationId, newStatus) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation
      )
    );
  };

  const handleChangePeriod = (reservationId, newPeriod) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, period: newPeriod } : reservation
      )
    );
  };

  const handleRemoveReservation = (reservationId) => {
    Alert.alert(
      "Remove Reservation",
      "Are you sure you want to remove this reservation?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => removeReservation(reservationId) },
      ]
    );
  };

  const removeReservation = (reservationId) => {
    setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== reservationId));
  };

  const renderReservationItem = ({ item }) => (
    <View style={styles.reservationItem}>
      <View style={styles.reservationDetails}>
        <Text style={styles.reservationText}>
          {item.customerName} - {item.date} at {item.time}
        </Text>
        <Text style={styles.reservationText}>Period: {item.period}</Text>
      </View>

      {/* Period Picker */}
      <Picker
        selectedValue={item.period}
        style={styles.picker}
        onValueChange={(itemValue) => handleChangePeriod(item.id, itemValue)}
      >
        <Picker.Item label="Morning" value="Morning" />
        <Picker.Item label="Afternoon" value="Afternoon" />
        <Picker.Item label="Evening" value="Evening" />
        <Picker.Item label="Night" value="Night" />
      </Picker>

      {/* Status Picker */}
      <Picker
        selectedValue={item.status}
        style={styles.picker}
        onValueChange={(itemValue) => handleChangeStatus(item.id, itemValue)}
      >
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="Approved" value="Approved" />
        <Picker.Item label="Cancelled" value="Cancelled" />
      </Picker>

      {/* Remove Button */}
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveReservation(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" color="white" size={30} />
        </TouchableOpacity>

        <Text style={styles.header}>Table Reservations</Text>

        <Text style={styles.infoText}>Manage customer table reservations here.</Text>

        {/* Add new reservation */}
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          value={newReservation.customerName}
          onChangeText={(text) => setNewReservation({ ...newReservation, customerName: text })}
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={newReservation.date}
          onChangeText={(text) => setNewReservation({ ...newReservation, date: text })}
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Time (HH:MM AM/PM)"
          value={newReservation.time}
          onChangeText={(text) => setNewReservation({ ...newReservation, time: text })}
          placeholderTextColor="white"
        />

        {/* Period Picker */}
        <Picker
          selectedValue={newReservation.period}
          style={styles.picker}
          onValueChange={(itemValue) => setNewReservation({ ...newReservation, period: itemValue })}
        >
          <Picker.Item label="Morning" value="Morning" />
          <Picker.Item label="Afternoon" value="Afternoon" />
          <Picker.Item label="Evening" value="Evening" />
          <Picker.Item label="Night" value="Night" />
        </Picker>

        <TouchableOpacity style={styles.addButton} onPress={handleAddReservation}>
          <Text style={styles.addButtonText}>Add Reservation</Text>
        </TouchableOpacity>

        {/* Reservation List */}
        <View style={styles.reservationListContainer}>
          <FlatList
            data={reservations}
            renderItem={renderReservationItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  container: {
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  header: {
    color: "yellow",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 80,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  picker: {
    backgroundColor: "#333",
    color: "white",
    marginVertical: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "yellow",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  reservationListContainer: {
    marginTop: 30,
  },
  reservationItem: {
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  reservationText: {
    color: "white",
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "yellow",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  removeButtonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
});

export default TableReservations;
