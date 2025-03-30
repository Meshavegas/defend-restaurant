"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Easing,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "../../const/images";
import useAuthStore from "../../store/auth";

const { width } = Dimensions.get("window");

const SignUpScreen = ({ navigation }) => {
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    value: {
      name: "",
      phone: "",
      email: "",
      password: "",
      adresse: "",
    },
    errors: {
      name: "",
      phone: "",
      email: "",
      password: "",
      adresse: "",
    },
    isLoading: false,
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Start animation when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Spinning animation for loading indicator
  useEffect(() => {
    if (formData.isLoading) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [formData.isLoading]);

  // Create interpolation for spinning
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const { name, phone, email, password, adresse } = formData.value;
  const { errors } = formData;

  const inputFields = [
    {
      placeholder: "Full Name",
      field: "name",
      keyboardType: "default",
      value: name,
      error: errors.name,
      icon: "person-outline",
    },
    {
      placeholder: "Phone Number",
      field: "phone",
      keyboardType: "phone-pad",
      value: phone,
      error: errors.phone,
      icon: "call-outline",
    },
    //adresse
    {
      placeholder: "Adresse",
      field: "adresse",
      value: adresse,
      error: errors.adresse,
      icon: "map-outline",
    },

    {
      placeholder: "Email Address",
      field: "email",
      keyboardType: "email-address",
      value: email,
      error: errors.email,
      icon: "mail-outline",
    },
    {
      placeholder: "Password",
      field: "password",
      keyboardType: "default",
      secureTextEntry: true,
      value: password,
      error: errors.password,
      icon: "lock-closed-outline",
    },
  ];

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

    // Check if name is provided
    if (!name.trim()) {
      newErrors.name = "Please enter your name";
      isValid = false;
    }

    // Check phone number format (starts with 6 and has at least 9 digits)
    if (!/^[6]\d{8,}$/.test(phone)) {
      newErrors.phone = "Phone number must be 9 digits and start with a 6";
      isValid = false;
    }

    // Check email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Check password length
    if (password.length < 5) {
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

  const handleSignUp = () => {
    if (validateInputs()) {
      setFormData({
        ...formData,
        isLoading: true,
      });
      const [firstName, ...lastNameParts] = formData.value.name
        .trim()
        .split(" ");
      const lastName = lastNameParts.join(" ");

      register({
        last_name: lastName,
        first_name: firstName,
        email: formData.value.email,
        phone: formData.value.phone,
        password: formData.value.password,
      })
        .then(() => {
          setFormData({
            ...formData,
            isLoading: false,
          });
        })
        .catch((error) => {
          console.error(error);
          setFormData({
            ...formData,
            isLoading: false,
          });
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#121212", "#1E1E1E", "#121212"]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back-outline" color="white" size={28} />
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
              <Image style={styles.logo} source={images.logo} />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Sign up to get started with our service
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
              {/* Input fields */}
              {inputFields.map((input, index) => (
                <View key={index} style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      input.error ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name={input.icon}
                      size={20}
                      color={input.error ? "#FF6B6B" : "#FEB301"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder={input.placeholder}
                      placeholderTextColor="#8A8A8A"
                      value={input.value}
                      onChangeText={(text) =>
                        handleInputChange(input.field, text)
                      }
                      keyboardType={input.keyboardType}
                      secureTextEntry={input.secureTextEntry || false}
                    />
                  </View>
                  {input.error ? (
                    <Text style={styles.errorText}>
                      <Ionicons name="alert-circle" size={12} color="#FF6B6B" />{" "}
                      {input.error}
                    </Text>
                  ) : null}
                </View>
              ))}

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  formData.isLoading ? styles.signUpButtonDisabled : null,
                ]}
                onPress={handleSignUp}
                disabled={formData.isLoading}
              >
                <LinearGradient
                  colors={
                    formData.isLoading
                      ? ["#8A8A8A", "#6A6A6A"]
                      : ["#FEB301", "#FF9500"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {formData.isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Ionicons name="sync" size={20} color="#fff" />
                      </Animated.View>
                      <Text style={styles.signUpText}>Processing...</Text>
                    </View>
                  ) : (
                    <Text style={styles.signUpText}>Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginLink}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLinkText}>Login</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#8A8A8A",
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
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "white",
    fontSize: 16,
  },
  inputError: {
    borderColor: "rgba(255, 107, 107, 0.5)",
    backgroundColor: "rgba(255, 107, 107, 0.05)",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  signUpButton: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#FEB301",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  signUpButtonDisabled: {
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
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  loginText: {
    fontSize: 16,
    color: "#8A8A8A",
  },
  loginLinkText: {
    fontSize: 16,
    color: "#FEB301",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default SignUpScreen;
