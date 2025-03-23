// src/Screens/BasketScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BasketScreen = ({ route, navigation }) => {
  const { basket } = route.params; // Accessing basket from route.params

  const calculateTotalPrice = () => {
    return basket.reduce((total, item) => total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" color="white" size={30} />
            </TouchableOpacity>
      <Text style={styles.header}>Your Basket</Text>

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
      />

      <Text style={styles.totalPrice}>Total:{calculateTotalPrice().toFixed(2)}FCFA</Text>

      {/* Checkout Button */}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => navigation.navigate("Checkout", { basket })}  // Pass the basket to Checkout screen
      >
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        <Ionicons name="arrow-forward" size={24} color="white" />
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
    position: "absolute",
    top: 40,
    left: 20,
  },
  header: {
    color: 'yellow',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingTop: 60,
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
    paddingBottom:'40',
  },
 checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 30,
    borderWidth: 2, // Added border for visibility
    borderColor: 'yellow', // White border to make it more visible
    
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
});

export default BasketScreen;
