import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "../../context/themeContext";
import useAuthStore from "../../store/auth";

const { width } = Dimensions.get("window");

const BasketScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode } = useAppContext();
  const {
    addToBasket,
    basket,
    clearBasket,
    removeFromBasket,
    totalItems,
    reduceQuantity,
  } = useAuthStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const checkoutAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(checkoutAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate total price
  const calculateTotalPrice = () => {
    return basket.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Calculate total items
  const calculateTotalItems = () => {
    return basket.reduce((total, item) => total + item.quantity, 0);
  };

  // Handle quantity change
  const handleQuantityChange = (id, change) => {
    setBasket((prevBasket) =>
      prevBasket.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          // If quantity becomes 0, we'll handle removal separately
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );

    // If quantity becomes 0, ask user if they want to remove the item
    if (change < 0) {
      const item = basket.find((item) => item.id === id);
      if (item && item.quantity + change <= 0) {
        handleRemoveItem(id);
      }
    }
  };

  // Handle remove item
  const handleRemoveItem = (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your basket?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setBasket((prevBasket) =>
              prevBasket.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  };

  // Handle clear basket
  const handleClearBasket = () => {
    if (basket.length === 0) return;

    Alert.alert("Clear Basket", "Are you sure you want to clear your basket?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          clearBasket();
        },
      },
    ]);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (basket.length === 0) {
      Alert.alert(
        "Empty Basket",
        "Your basket is empty. Add some items before checkout."
      );
      return;
    }

    navigation.navigate("Checkout", { basket });
  };

  // Render basket item
  const renderBasketItem = ({ item, index }) => {
    console.log(item);

    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10 * (index + 1)],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemDetails}>
            {item.image_url && (
              <Image
                source={{ uri: item.image_url }}
                style={styles.itemImage}
                // defaultSource={require("../../assets/placeholder.png")}
              />
            )}
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>
                {item.price}
              </Text>
            </View>
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: `${colors.error}20` },
              ]}
              onPress={() => reduceQuantity(item)}
            >
              <Ionicons name="remove" size={16} color={colors.error} />
            </TouchableOpacity>

            <Text style={[styles.quantityText, { color: colors.text }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: `${colors.success}20` },
              ]}
              onPress={() => addToBasket(item)}
            >
              <Ionicons name="add" size={16} color={colors.success} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.removeButton,
              { backgroundColor: `${colors.error}20` },
            ]}
            onPress={() => removeFromBasket(item)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.itemSubtotal, { color: colors.textSecondary }]}>
          Subtotal: {(parseFloat(item.price) * item.quantity).toFixed(2)} FCFA
        </Text>
      </Animated.View>
    );
  };

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
          Your Basket
        </Text>

        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: colors.surface }]}
          onPress={handleClearBasket}
        >
          <Ionicons name="trash-outline" color={colors.error} size={20} />
        </TouchableOpacity>
      </View>

      {/* Basket Summary */}
      <Animated.View
        style={[
          styles.summaryContainer,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Items
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {totalItems()}
          </Text>
        </View>

        <View
          style={[styles.summaryDivider, { backgroundColor: colors.border }]}
        />

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Total
          </Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            {calculateTotalPrice().toFixed(2)} FCFA
          </Text>
        </View>
      </Animated.View>

      {/* Basket Items */}
      {basket.length > 0 ? (
        <FlatList
          data={basket}
          renderItem={renderBasketItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="cart-outline"
            size={80}
            color={colors.textSecondary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Your basket is empty
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("Menu")}
          >
            <Text
              style={[styles.browseButtonText, { color: colors.background }]}
            >
              Browse Menu
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Checkout Button */}
      {basket.length > 0 && (
        <Animated.View
          style={[
            styles.checkoutContainer,
            {
              opacity: checkoutAnim,
              transform: [
                {
                  translateY: checkoutAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutGradient}
            >
              <Text style={[styles.checkoutText, { color: colors.background }]}>
                Proceed to Checkout
              </Text>
              <View
                style={[
                  styles.checkoutPrice,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text
                  style={[styles.checkoutPriceText, { color: colors.primary }]}
                >
                  {calculateTotalPrice().toFixed(2)} FCFA
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: "100%",
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  itemContainer: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  itemSubtotal: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 30,
  },
  browseButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  checkoutContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
  },
  checkoutButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutPrice: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  checkoutPriceText: {
    fontSize: 14,
    fontWeight: "bold",
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
  navIconContainer: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BasketScreen;
