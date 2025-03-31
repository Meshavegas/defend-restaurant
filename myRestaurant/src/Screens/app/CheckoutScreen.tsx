"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "../../context/themeContext";
import PageView from "../../components/pageContainer";
import useAuthStore from "../../store/auth";

const { width } = Dimensions.get("window");

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode } = useAppContext();

  const { basket, users } = useAuthStore();

  // State for form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cash", // cash, card, mobile
    notes: "",
  });

  // State for errors
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  // Start success animation when order is successful
  useEffect(() => {
    if (isSuccess) {
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Navigate to home after 3 seconds
      const timer = setTimeout(() => {
        navigation.navigate("Home");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigation]);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return basket.reduce(
      (total, item) => total + Number.parseFloat(item.price) * item.quantity,
      0
    );
  };

  // Calculate delivery fee
  const calculateDeliveryFee = () => {
    // Example: Delivery fee is 500 FCFA for orders under 10000 FCFA, free for orders over 10000 FCFA
    const subtotal = calculateSubtotal();
    return subtotal < 10000 ? 500 : 0;
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  // Handle input change
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

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
      isValid = false;
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
      isValid = false;
    } else if (!/^[6]\d{8,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (starting with 6)";
      isValid = false;
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Please enter your delivery address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle place order
  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Here you would normally send the order to your backend
      console.log("Order placed:", {
        items: basket,
        customer: formData,
        subtotal: calculateSubtotal(),
        deliveryFee: calculateDeliveryFee(),
        total: calculateTotal(),
        orderDate: new Date().toISOString(),
      });
    }, 2000);
  };

  // Render success state
  if (isSuccess) {
    return (
      <PageView>
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
                { backgroundColor: colors.success },
              ]}
            >
              <Ionicons name="checkmark" size={50} color={colors.background} />
            </View>

            <Text style={[styles.successTitle, { color: colors.text }]}>
              Order Placed Successfully!
            </Text>

            <Text style={[styles.successText, { color: colors.textSecondary }]}>
              Your order has been received and is being processed. You will
              receive a confirmation shortly.
            </Text>

            <Text style={[styles.orderNumber, { color: colors.primary }]}>
              Order #: {Math.floor(100000 + Math.random() * 900000)}
            </Text>
          </Animated.View>
        </View>
      </PageView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" color={colors.text} size={24} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Checkout
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              backgroundColor: colors.surface,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Summary
          </Text>

          <View style={styles.summaryItems}>
            {basket.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <View style={styles.summaryItemInfo}>
                  <Text
                    style={[
                      styles.summaryItemQuantity,
                      { color: colors.primary },
                    ]}
                  >
                    {item.quantity}x
                  </Text>
                  <Text
                    style={[styles.summaryItemName, { color: colors.text }]}
                  >
                    {item.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.summaryItemPrice,
                    { color: colors.textSecondary },
                  ]}
                >
                  {(Number.parseFloat(item.price) * item.quantity).toFixed(2)}{" "}
                  FCFA
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Subtotal
            </Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>
              {calculateSubtotal().toFixed(2)} FCFA
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>
              {calculateDeliveryFee().toFixed(2)} FCFA
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.priceTotalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.priceTotal, { color: colors.primary }]}>
              {calculateTotal().toFixed(2)} FCFA
            </Text>
          </View>
        </Animated.View>

        {/* Delivery Information */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              backgroundColor: colors.surface,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Delivery Information
          </Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Full Name <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.background,
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
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                value={`${users?.first_name} ${users?.last_name}`}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>
            {errors.name ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                <Ionicons name="alert-circle" size={12} color={colors.error} />{" "}
                {errors.name}
              </Text>
            ) : null}
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Phone Number <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.phone ? colors.error : colors.border,
                },
              ]}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={errors.phone ? colors.error : colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={users?.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
              />
            </View>
            {errors.phone ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                <Ionicons name="alert-circle" size={12} color={colors.error} />{" "}
                {errors.phone}
              </Text>
            ) : null}
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Delivery Address <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.address ? colors.error : colors.border,
                },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={errors.address ? colors.error : colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your delivery address"
                placeholderTextColor={colors.textSecondary}
                value={users?.address}
                onChangeText={(text) => handleInputChange("address", text)}
              />
            </View>
            {errors.address ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                <Ionicons name="alert-circle" size={12} color={colors.error} />{" "}
                {errors.address}
              </Text>
            ) : null}
          </View>

          {/* Notes Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Additional Notes (Optional)
            </Text>
            <View
              style={[
                styles.textAreaWrapper,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextInput
                style={[styles.textArea, { color: colors.text }]}
                placeholder="Any special instructions for delivery"
                placeholderTextColor={colors.textSecondary}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.notes}
                onChangeText={(text) => handleInputChange("notes", text)}
              />
            </View>
          </View>
        </Animated.View>

        {/* Payment Method */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              backgroundColor: colors.surface,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Payment Method
          </Text>

          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                formData.paymentMethod === "cash" && [
                  styles.paymentOptionActive,
                  { borderColor: colors.primary },
                ],
                { backgroundColor: colors.background },
              ]}
              onPress={() => handleInputChange("paymentMethod", "cash")}
            >
              <Ionicons
                name="cash-outline"
                size={24}
                color={
                  formData.paymentMethod === "cash"
                    ? colors.primary
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  {
                    color:
                      formData.paymentMethod === "cash"
                        ? colors.primary
                        : colors.text,
                  },
                ]}
              >
                Cash on Delivery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                formData.paymentMethod === "card" && [
                  styles.paymentOptionActive,
                  { borderColor: colors.primary },
                ],
                { backgroundColor: colors.background },
              ]}
              onPress={() => handleInputChange("paymentMethod", "card")}
            >
              <Ionicons
                name="card-outline"
                size={24}
                color={
                  formData.paymentMethod === "card"
                    ? colors.primary
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  {
                    color:
                      formData.paymentMethod === "card"
                        ? colors.primary
                        : colors.text,
                  },
                ]}
              >
                Credit/Debit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                formData.paymentMethod === "mobile" && [
                  styles.paymentOptionActive,
                  { borderColor: colors.primary },
                ],
                { backgroundColor: colors.background },
              ]}
              onPress={() => handleInputChange("paymentMethod", "mobile")}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color={
                  formData.paymentMethod === "mobile"
                    ? colors.primary
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  {
                    color:
                      formData.paymentMethod === "mobile"
                        ? colors.primary
                        : colors.text,
                  },
                ]}
              >
                Mobile Money
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            isLoading && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          <LinearGradient
            colors={
              isLoading ? ["#999", "#777"] : [colors.primary, colors.tertiary]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.background} />
                <Text
                  style={[
                    styles.buttonText,
                    { color: colors.background, marginLeft: 10 },
                  ]}
                >
                  Processing...
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  Place Order
                </Text>
                <View
                  style={[
                    styles.buttonPrice,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Text
                    style={[styles.buttonPriceText, { color: colors.primary }]}
                  >
                    {calculateTotal().toFixed(2)} FCFA
                  </Text>
                </View>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 10,
    //     paddingBottom: 10,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  summaryItems: {
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryItemInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItemQuantity: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  summaryItemName: {
    fontSize: 14,
  },
  summaryItemPrice: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
  },
  priceTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceTotal: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
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
  textAreaWrapper: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    fontSize: 16,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  paymentOptions: {
    flexDirection: "column",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  paymentOptionActive: {
    borderWidth: 1,
  },
  paymentOptionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  placeOrderButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  placeOrderButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPrice: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonPriceText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
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
    marginBottom: 20,
    lineHeight: 24,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
