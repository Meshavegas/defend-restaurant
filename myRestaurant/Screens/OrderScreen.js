import React, { useState } from "react";
import {  View,  Text,  Image,  TouchableOpacity,  TextInput,  ScrollView,  StyleSheet,} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const OrderScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const item = route.params?.item;

  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");

  const handleConfirmOrder = () => {
    if (!address || !contact || !selectedPayment) {
      alert("Please fill in all details and choose a payment method.");
      return;
    }
    alert("Order Confirmed!");
  };

  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Item Image */}
        {item.image && <Image source={item.image} style={styles.image} />}

        {/* Item Details */}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>Price: {item.price}</Text>

        {/* Delivery Details */}
        <View style={styles.detailBox}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter delivery address"
            placeholderTextColor="gray"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter contact number"
            placeholderTextColor="gray"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.detailBox}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
       

          <TouchableOpacity
            style={[styles.paymentOption, selectedPayment === "Mobile Money" && styles.selectedPayment]}
            onPress={() => setSelectedPayment("Mobile Money")}
          >
            <Text style={styles.paymentText}>📱 Mobile Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, selectedPayment === "Cash" && styles.selectedPayment]}
            onPress={() => setSelectedPayment("Cash")}
          >
            <Text style={styles.paymentText}>💵 Cash on Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Order Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={styles.confirmButtonText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "black",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
 
  
  image: {
    width: 150,
    height: 150,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "yellow",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  detailBox: {
    width: "100%",
    backgroundColor: "black",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#444",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    fontSize: 16,
  },
  paymentOption: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#444",
  },
  selectedPayment: {
    backgroundColor: "white",
  },
  paymentText: {
    fontSize: 16,
    color: "black",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "yellow",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    width:'100%',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

export default OrderScreen;
