import React from "react";
import HomeScreen from "../Screens/app/HomeScreen";
import AdminDashboard from "../Screens/app/AdminDashboard";
import MenuScreen from "../Screens/app/MenuScreen";
import OrderScreen from "../Screens/app/OrderScreen";
import ReservationScreen from "../Screens/app/ReservationScreen";
import BasketScreen from "../Screens/app/BasketScreen";
import PaymentScreen from "../Screens/app/PaymentScreen";
import CheckoutScreen from "../Screens/app/CheckoutScreen";
import ManageOrders from "../Screens/app/ManageOrders";
import ManageUsers from "../Screens/app/ManageUsers";
import TableReservations from "../Screens/app/TableReservations";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigation from "./bottomNavigation";
import ManageMenu from "../Screens/app/ManageMenu";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={BottomNavigation} />
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
      <Stack.Screen name="ManageMenu" component={ManageMenu} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
