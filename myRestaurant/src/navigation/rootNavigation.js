import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./appNavigation";
import AuthNavigation from "./authNavigation";
import WelcomeScreen from "../Screens/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <StatusBar style="light" backgroundColor="#222" />
      <NavigationContainer>
        {/* <AuthNavigation /> */}
        <AppNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default RootNavigation;
