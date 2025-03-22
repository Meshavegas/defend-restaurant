import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen width & height

const WelcomeScreen = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Login'); // Navigate to the Login screen
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp'); // Navigate to the Sign Up screen
  };

  return (
    <ImageBackground 
      source={require('../assets/image.png')}  // Replace with your background image
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Logo */}
        <Image style={styles.logo} source={require('../assets/logo.jpg')} />

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome!!</Text>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  imageBackground: {
    width: width, // Full width of the screen
    height: height, // Full height of the screen
    flex: 1, // Ensures it takes the whole screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Dark overlay to make text visible
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
  },
  loginButton: {
    width: '80%',
    height: 54,
    backgroundColor: '#FEB301',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor: 'gray',
  },
  loginText: {
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
  },
  orText: {
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  signUpButton: {
    width: '80%',
    height: 54,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray',
  },
  signUpText: {
    color: 'black',
    fontSize: 23,
    fontWeight: 'bold',
  },
});
