import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AdminDashboard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="white" size={30} />
      </TouchableOpacity>

      <Text style={styles.header}>Admin Dashboard</Text>

      {/* Manage Users */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate("ManageUsers")}
      >
        <Text style={styles.cardTitle}>Manage Users</Text>
        <Ionicons name="people" size={24} color="white" />
      </TouchableOpacity>

      {/* Manage Orders */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate("ManageOrders")}
      >
        <Text style={styles.cardTitle}>Manage Orders</Text>
        <Ionicons name="clipboard" size={24} color="white" />
      </TouchableOpacity>

      {/* Table Reservations */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate("TableReservations")}
      >
        <Text style={styles.cardTitle}>Table Reservations</Text>
        <Ionicons name="calendar" size={24} color="white" />
      </TouchableOpacity>

      {/* Generate Reports */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate("GenerateReports")}
      >
        <Text style={styles.cardTitle}>Generate Reports</Text>
        <Ionicons name="stats-chart" size={24} color="white" />
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
          <Ionicons name="calendar-outline" size={28} color="white" />
          <Text style={styles.iconText}>Reservation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("AdminDashboard")}>
          <Ionicons name="person" size={28} color="yellow" />
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
    padding: 20,
    paddingTop: 80,
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
  },
  card: {
    backgroundColor: "#333",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
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

export default AdminDashboard;
