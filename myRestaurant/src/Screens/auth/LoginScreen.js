"use client";

import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "../../const/images";
import { useAppContext } from "../../context/themeContext";
import PageView from "../../components/pageContainer";
import useAuthStore from "../../store/auth";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useAppContext();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    value: {
      email: "",
      password: "",
    },
    errors: {
      email: "",
      password: "",
    },
    isLoading: false,
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Start animation when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const { email, password } = formData.value;
  const { errors } = formData;

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    setFormData({
      ...formData,
      value: {
        ...formData.value,
        [field]: value,
      },
      errors: {
        ...formData.errors,
        [field]: "",
      },
    });
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { ...formData.errors };

    // Check email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Check password length
    if (password.length < 3) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    // Update state with new errors
    setFormData({
      ...formData,
      errors: newErrors,
    });

    return isValid;
  };

  const handleLogin = async () => {
    if (validateInputs()) {
      setFormData({
        ...formData,
        isLoading: true,
      });

      // api Call
      try {
        await login(email, password);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <PageView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={
            isDarkMode
              ? ["#121212", "#1E1E1E", "#121212"]
              : ["#F5F5F5", "#FFFFFF", "#F5F5F5"]
          }
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Back Button */}
              <TouchableOpacity
                style={[styles.backButton, { backgroundColor: colors.surface }]}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="arrow-back-outline"
                  color={colors.text}
                  size={28}
                />
              </TouchableOpacity>

              {/* Logo and Title Container */}
              <Animated.View
                style={[
                  styles.headerContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Image
                  style={[styles.logo, { borderColor: colors.primary }]}
                  source={images.logo}
                />
                <Text style={[styles.title, { color: colors.text }]}>
                  Welcome Back
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  Sign in to continue to your account
                </Text>
              </Animated.View>

              {/* Form Container */}
              <Animated.View
                style={[
                  styles.formContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: colors.surface,
                        borderColor: errors.email
                          ? colors.error
                          : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={errors.email ? colors.error : colors.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Email Address"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="email-address"
                      value={email}
                      onChangeText={(text) => handleInputChange("email", text)}
                    />
                  </View>
                  {errors.email ? (
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      <Ionicons
                        name="alert-circle"
                        size={12}
                        color={colors.error}
                      />{" "}
                      {errors.email}
                    </Text>
                  ) : null}
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: colors.surface,
                        borderColor: errors.password
                          ? colors.error
                          : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={errors.password ? colors.error : colors.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Password"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry={true}
                      value={password}
                      onChangeText={(text) =>
                        handleInputChange("password", text)
                      }
                    />
                  </View>
                  {errors.password ? (
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      <Ionicons
                        name="alert-circle"
                        size={12}
                        color={colors.error}
                      />{" "}
                      {errors.password}
                    </Text>
                  ) : null}
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text
                    style={[
                      styles.forgotPasswordText,
                      { color: colors.primary },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    formData.isLoading ? styles.loginButtonDisabled : null,
                  ]}
                  onPress={handleLogin}
                  disabled={formData.isLoading}
                >
                  <LinearGradient
                    colors={
                      formData.isLoading
                        ? [colors.textSecondary, colors.textSecondary]
                        : [colors.primary, colors.tertiary]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    {formData.isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Animated.View
                          style={{
                            transform: [
                              {
                                rotate: fadeAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ["0deg", "360deg"],
                                }),
                              },
                            ],
                          }}
                        >
                          <Ionicons
                            name="sync"
                            size={20}
                            color={colors.background}
                          />
                        </Animated.View>
                        <Text
                          style={[
                            styles.loginText,
                            { color: colors.background },
                          ]}
                        >
                          Logging in...
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={[styles.loginText, { color: colors.background }]}
                      >
                        Login
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                  <Text
                    style={[styles.signupText, { color: colors.textSecondary }]}
                  >
                    Don't have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <Text
                      style={[styles.signupLink, { color: colors.primary }]}
                    >
                      {" "}
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </PageView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 30,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: "contain",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(254, 179, 1, 0.3)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    opacity: 0.8,
    shadowOpacity: 0,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
