import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./Screens/WelcomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import HomeScreen from "./Screens/HomeScreen";  // Fix the import
import AdminDashboard from "./Screens/AdminDashboard";
import MenuScreen from "./Screens/MenuScreen";
import OrderScreen from "./Screens/OrderScreen";
import ReservationScreen from "./Screens/ReservationScreen";
import BasketScreen from "./Screens/BasketScreen";
import PaymentScreen from "./Screens/PaymentScreen"; 
import CheckoutScreen from "./Screens/CheckoutScreen";
import ManageOrders from "./Screens/ManageOrders";
import ManageUsers from "./Screens/ManageUsers";
import TableReservations from "./Screens/TableReservations";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="Reservation" component={ReservationScreen} />
        <Stack.Screen name="Basket" component={BasketScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} /> 
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="ManageOrders" component={ManageOrders} />
        <Stack.Screen name="ManageUsers" component={ManageUsers} />
        <Stack.Screen name="TableReservations" component={TableReservations} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
