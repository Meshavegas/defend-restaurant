"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAppContext } from "../../context/themeContext";
import PageView from "../../components/pageContainer";

const { width } = Dimensions.get("window");

const ReservationScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useAppContext();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    guests: "",
    date: "",
    time: "",
    notes: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    name: "",
    guests: "",
    date: "",
    time: "",
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

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

  // Handle success animation
  useEffect(() => {
    if (isSuccess) {
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Navigate back after success
      const timer = setTimeout(() => {
        navigation.navigate("Home");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    handleInputChange("date", formattedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    handleInputChange("time", formattedTime);
    hideTimePicker();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
      isValid = false;
    }

    // Validate guests
    if (!formData.guests.trim()) {
      newErrors.guests = "Please enter number of guests";
      isValid = false;
    } else if (isNaN(Number(formData.guests)) || Number(formData.guests) <= 0) {
      newErrors.guests = "Please enter a valid number";
      isValid = false;
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = "Please select a date";
      isValid = false;
    }

    // Validate time
    if (!formData.time) {
      newErrors.time = "Please select a time";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleReservation = () => {
    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        console.log("Reservation made:", formData);
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  // Render success state
  if (isSuccess) {
    return (
      <PageView style={{}}>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
          <Animated.View
            style={[
              styles.successContainer,
              {
                opacity: successAnim,
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1.1, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.successIconContainer,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="checkmark" size={50} color={colors.background} />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              Reservation Confirmed!
            </Text>
            <Text style={[styles.successText, { color: colors.textSecondary }]}>
              Your table has been reserved for {formData.date} at{" "}
              {formData.time}
            </Text>
          </Animated.View>
        </View>
      </PageView>
    );
  }

  return (
    <PageView style={{ paddingBottom: 0 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.surface }]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back-outline"
                color={colors.text}
                size={24}
              />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Reservation
            </Text>

            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={[styles.formTitle, { color: colors.primary }]}>
                Book Your Table
              </Text>
              <Text
                style={[styles.formSubtitle, { color: colors.textSecondary }]}
              >
                Fill in the details to reserve your table
              </Text>

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Full Name
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: errors.name ? colors.error : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={errors.name ? colors.error : colors.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                  />
                </View>
                {errors.name ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    <Ionicons
                      name="alert-circle"
                      size={12}
                      color={colors.error}
                    />{" "}
                    {errors.name}
                  </Text>
                ) : null}
              </View>

              {/* Guests Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Number of Guests
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: errors.guests ? colors.error : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color={errors.guests ? colors.error : colors.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter number of guests"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="number-pad"
                    value={formData.guests}
                    onChangeText={(text) => handleInputChange("guests", text)}
                  />
                </View>
                {errors.guests ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    <Ionicons
                      name="alert-circle"
                      size={12}
                      color={colors.error}
                    />{" "}
                    {errors.guests}
                  </Text>
                ) : null}
              </View>

              {/* Date Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Date
                </Text>
                <TouchableOpacity
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: errors.date ? colors.error : colors.border,
                    },
                  ]}
                  onPress={showDatePicker}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={errors.date ? colors.error : colors.primary}
                    style={styles.inputIcon}
                  />
                  <Text
                    style={[
                      styles.dateTimeText,
                      {
                        color: formData.date
                          ? colors.text
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {formData.date || "Select date"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                {errors.date ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    <Ionicons
                      name="alert-circle"
                      size={12}
                      color={colors.error}
                    />{" "}
                    {errors.date}
                  </Text>
                ) : null}
              </View>

              {/* Time Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Time
                </Text>
                <TouchableOpacity
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: errors.time ? colors.error : colors.border,
                    },
                  ]}
                  onPress={showTimePicker}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={errors.time ? colors.error : colors.primary}
                    style={styles.inputIcon}
                  />
                  <Text
                    style={[
                      styles.dateTimeText,
                      {
                        color: formData.time
                          ? colors.text
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {formData.time || "Select time"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                {errors.time ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    <Ionicons
                      name="alert-circle"
                      size={12}
                      color={colors.error}
                    />{" "}
                    {errors.time}
                  </Text>
                ) : null}
              </View>

              {/* Notes Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Special Requests (Optional)
                </Text>
                <View
                  style={[
                    styles.textAreaWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.textArea, { color: colors.text }]}
                    placeholder="Any special requests or notes"
                    placeholderTextColor={colors.textSecondary}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={formData.notes}
                    onChangeText={(text) => handleInputChange("notes", text)}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading ? styles.submitButtonDisabled : null,
                ]}
                onPress={handleReservation}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={
                    isLoading
                      ? [colors.textSecondary, colors.textSecondary]
                      : [colors.primary, colors.tertiary]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
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
                          styles.buttonText,
                          { color: colors.background },
                        ]}
                      >
                        Processing...
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[styles.buttonText, { color: colors.background }]}
                    >
                      Reserve Table
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>

          {/* Date & Time Pickers */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />
        </View>
      </KeyboardAvoidingView>
    </PageView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  formContainer: {
    width: "100%",
    paddingTop: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  formSubtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
  dateTimeText: {
    flex: 1,
    fontSize: 16,
  },
  textAreaWrapper: {
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  submitButton: {
    height: 55,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
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
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  successText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default ReservationScreen;
