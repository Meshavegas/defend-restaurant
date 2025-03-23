import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomeScreen from "../Screens/app/HomeScreen";
import AdminDashboard from "../Screens/app/AdminDashboard";
import MenuScreen from "../Screens/app/MenuScreen";
import ReservationScreen from "../Screens/app/ReservationScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "yellow",
          tabBarInactiveTintColor: "gray",

          tabBarStyle: {
            backgroundColor: "#222",
            flex: 1,
            width: "100%",
            height: 70,
            position: "absolute",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            bottom: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            tabBarLabel: "Menu",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Reservation"
          component={ReservationScreen}
          options={{
            tabBarLabel: "Reserve",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{
            tabBarLabel: "Admin",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-cog"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigation;
