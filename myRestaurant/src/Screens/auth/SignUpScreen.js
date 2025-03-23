import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { images } from "../../const/images";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (/^[6]\d{8,}$/.test(phone)) {
      Alert.alert(
        "Invalid Phone",
        "Phone number must be  9 digits and starts with a 6."
      );
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long."
      );
      return false;
    }

    return true;
  };

  const handleSignUp = () => {
    if (validateInputs()) {
      console.log("User Data:", { name, phone, email, password });
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" color="white" size={30} />
      </TouchableOpacity>

      {/* Logo */}
      <Image style={styles.logo} source={images.logo} />

      {/* Sign Up Title */}
      <Text style={styles.title}>Sign Up</Text>

      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="white"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        placeholderTextColor="white"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="white"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="white"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginLink}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLinkText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 15,
    color: "white",
  },
  signUpButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FEB301",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#ccc",
  },
  loginLinkText: {
    fontSize: 16,
    color: "#FEB301",
    fontWeight: "bold",
    marginLeft: 5,
  },
});
