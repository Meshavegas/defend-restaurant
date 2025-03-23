import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const ManageOrders = () => {
  const navigation = useNavigation();

  const [orders, setOrders] = useState([
    { id: "1", customer: "John Doe", status: "Pending" },
    { id: "2", customer: "Jane Smith", status: "Delivered" },
    { id: "3", customer: "Sam Wilson", status: "In Progress" },
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderCustomer}>{item.customer}</Text>
      
      {/* Picker for changing order status */}
      <Picker
        selectedValue={item.status}
        style={styles.picker}
        onValueChange={(itemValue) => handleStatusChange(item.id, itemValue)}
      >
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="Delivered" value="Delivered" />
        <Picker.Item label="in progress" value="in progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="white" size={30} />
      </TouchableOpacity>

      <Text style={styles.header}>Manage Orders</Text>

      <Text style={styles.infoText}>Here you can view and update customer orders.</Text>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        style={styles.orderList}
      />

      {/* You can add more order management functionalities here, like a button to mark an order as completed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
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
  orderList: {
    marginTop: 30,
  },
  orderItem: {
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderCustomer: {
    color: "white",
    fontSize: 16,
  },
  picker: {
    width: 150,
    backgroundColor: "#333",
    color: "white",
    borderRadius: 8,
  },
});

export default ManageOrders;
