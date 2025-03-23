import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList,  Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const ManageUsers = () => {
  const navigation = useNavigation();

  // Initial list of users
  const [users, setUsers] = useState([
    { id: "1", name: "John Doe", role: "Customer" },
    { id: "2", name: "Jane Smith", role: "Admin" },
    { id: "3", name: "Sam Wilson", role: "Customer" },
  ]);

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  // Handle user removal
  const handleRemoveUser = (userId) => {
    Alert.alert(
      "Remove User",
      "Are you sure you want to remove this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => removeUser(userId) },
      ]
    );
  };

  const removeUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>

      {/* Role Picker for each user */}
      <Picker
        selectedValue={item.role}
        style={styles.picker}
        onValueChange={(itemValue) => handleRoleChange(item.id, itemValue)}
      >
        <Picker.Item label="Admin" value="Admin" />
        <Picker.Item label="Customer" value="Customer" />
      </Picker>

      {/* Button to remove user */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveUser(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="white" size={30} />
      </TouchableOpacity>

      <Text style={styles.header}>Manage Users</Text>

      <Text style={styles.infoText}>Here you can manage user roles and remove users.</Text>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.userList}
      />
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
  userList: {
    marginTop: 30,
  },
  userItem: {
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    color: "white",
    fontSize: 16,
  },
  picker: {
    width: 120,
    backgroundColor: "#333",
    color: "white",
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: "yellow",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "black",
    fontSize: 16,
  },
});

export default ManageUsers;
