import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
const CheckoutScreen = ({ route }) => {
  const { basket } = route.params;
  const navigation = useNavigation();

  const [address, setAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile money');

  const calculateTotalPrice = () => {
    return basket.reduce((total, item) => total + (parseFloat(item.price.replace('', 'FCFA')) * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (!address || !deliveryTime) {
      Alert.alert("Missing Information", "Please fill in all fields before proceeding.");
      return;
    }
    navigation.navigate('Payment', {
      basket,
      address,
      deliveryTime,
      paymentMethod,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="white" size={30} />
      </TouchableOpacity>

      <Text style={styles.header}>Checkout</Text>

      {/* FlatList for Basket Items */}
      <FlatList
        data={basket}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        )}
        ListFooterComponent={
          <View>
            <Text style={styles.totalPrice}>Total:{calculateTotalPrice().toFixed(2)}FCFA</Text>

            {/* Delivery Address Input */}
            <Text style={styles.inputLabel}>Delivery Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter delivery address"
              placeholderTextColor="white"
              value={address}
              onChangeText={setAddress}
            />

            {/* Delivery Time Input */}
            <Text style={styles.inputLabel}>Delivery Time</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter preferred delivery time"
              placeholderTextColor="white"
              value={deliveryTime}
              onChangeText={setDeliveryTime}
            />

            {/* Payment Method Picker */}
            <Text style={styles.inputLabel}>Payment Method</Text>
            <Picker
              selectedValue={paymentMethod}
              style={styles.picker}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            >
              <Picker.Item label="Mobile Money" value="mobile money" />
              <Picker.Item label="Cash on Delivery" value="Cash" />
            </Picker>

            {/* Proceed to Payment Button */}
            <TouchableOpacity style={styles.paymentButton} onPress={handleCheckout}>
              <Text style={styles.paymentText}>Proceed to Payment</Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 10,
  },
  header: {
    color: 'yellow',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 60,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    color: 'white',
    fontSize: 16,
  },
  itemQuantity: {
    color: 'white',
    fontSize: 16,
  },
  itemPrice: {
    color: 'yellow',
    fontSize: 16,
  },
  totalPrice: {
    color: 'yellow',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  inputLabel: {
    color: 'yellow',
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  picker: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  paymentButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 30,
    borderWidth: 2,
    borderColor: 'yellow',
  },
  paymentText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
});

export default CheckoutScreen;
