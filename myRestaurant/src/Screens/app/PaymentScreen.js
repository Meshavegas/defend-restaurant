import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = ({ route }) => {
  const { basket, address, deliveryTime, paymentMethod } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();

  const calculateTotalPrice = () => {
    return basket.reduce((total, item) => total + (parseFloat(item.price.replace('FCFA', '')) * item.quantity), 0);
  };

  const handlePaymentConfirmation = () => {
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('Payment Successful!', 'Your order has been placed successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="white" size={30} />
      </TouchableOpacity>

      <Text style={styles.header}>Payment</Text>

      {/* Summary of Checkout Details */}
      <View style={styles.summaryContainer}>
        <Text style={styles.label}>Delivery Address: <Text style={styles.value}>{address}</Text></Text>
        <Text style={styles.label}>Delivery Time: <Text style={styles.value}>{deliveryTime}</Text></Text>
        <Text style={styles.label}>Payment Method: <Text style={styles.value}>{paymentMethod}</Text></Text>
        <Text style={styles.totalPrice}>Total: FCFA{calculateTotalPrice().toFixed(2)}</Text>
      </View>

      {/* Payment Confirmation Button */}
      <TouchableOpacity
        style={[styles.confirmButton, isProcessing && styles.disabledButton]}
        onPress={handlePaymentConfirmation}
        disabled={isProcessing}
      >
        <Text style={styles.confirmButtonText}>{isProcessing ? 'Processing...' : 'Confirm Payment'}</Text>
        <Ionicons name="checkmark" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
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
  summaryContainer: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  label: {
    color: 'yellow',
    fontSize: 16,
    marginBottom: 10,
  },
  value: {
    color: 'white',
    fontWeight: 'bold',
  },
  totalPrice: {
    color: 'yellow',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  confirmButton: {
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
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: 'gray',
    borderColor: 'gray',
  },
});

export default PaymentScreen;
