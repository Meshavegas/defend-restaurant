import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./appNavigation";
import AuthNavigation from "./authNavigation";
import WelcomeScreen from "../Screens/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import useAuthStore from "../store/auth";
import HydAuth from "../store/authHydratation";
import { useAppContext } from "../context/themeContext";
const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const { token, getMe } = useAuthStore();
  const { isDarkMode, colors } = useAppContext();
  useEffect(() => {
    console.log("Token from store", token);

    if (token) {
      getMe();
    }
  }, [token]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.primary}
      />
      <HydAuth />
      <NavigationContainer>
        {!token ? <AuthNavigation /> : <AppNavigation />}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default RootNavigation;
