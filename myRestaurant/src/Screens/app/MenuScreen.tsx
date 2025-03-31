"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "../../context/themeContext";
import PageView from "../../components/pageContainer";
import useAuthStore from "../../store/auth";

const { width } = Dimensions.get("window");

const MenuScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useAppContext();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToBasket, basket, totalItems, menuItems, getMenuItems } =
    useAuthStore();
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const basketBounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMenuItems();
    });

    return unsubscribe;
  }, [navigation, getMenuItems]);
  // Start animation when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate total price
  const totalPrice = basket
    .reduce((sum, item) => {
      console.log({ item });

      // const priceString = item?.price || "0";
      // const numericPrice = !isNaN(priceString)
      //   ? Number.parseFloat(priceString.replace(/[^0-9.-]+/g, ""))
      //   : priceString;
      return sum + item.price * item.quantity;
    }, 0)
    .toFixed(2);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(basketBounce, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(basketBounce, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [basket]);

  const renderMenuCategory = (category: ICategory) => {
    return (
      <Animated.View
        style={[
          styles.categoryContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.categoryTitle, { color: colors.primary }]}>
          {category.name}
        </Text>
        <FlatList
          data={category.menu_items}
          keyExtractor={(item) => item.id.toString()}
          horizontal={activeCategory === "All"}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.menuItem,
                {
                  backgroundColor: colors.surface,
                  width: activeCategory === "All" ? width * 0.7 : width * 0.89,
                },
              ]}
              onPress={() => addToBasket(item)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.menuImage}
              />
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuText, { color: colors.text }]}>
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.menuDescription,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {item.description ||
                    "Delicious food made with fresh ingredients"}
                </Text>
                <View style={styles.menuItemFooter}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "XAF",
                      minimumFractionDigits: 2,
                    }).format(Number(item.price))}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        // styles.menuDescription,
                        { color: colors.textSecondary, marginLeft: 5 },
                      ]}
                    >
                      {`${item.preparation_time} min`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => addToBasket(item)}
                  >
                    <Ionicons name="add" size={18} color={colors.background} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    );
  };

  return (
    <PageView>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

        {/* Search Bar */}
        <View
          style={[styles.searchContainer, { backgroundColor: colors.surface }]}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for food..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  activeCategory === "All" ? colors.primary : colors.surface,
                height: 40,
              },
            ]}
            onPress={() => setActiveCategory("All")}
          >
            <Text
              style={[
                {
                  color:
                    activeCategory === "All" ? colors.background : colors.text,
                  fontWeight: activeCategory === "All" ? "bold" : "normal",
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {menuItems.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    activeCategory === category.id
                      ? colors.primary
                      : colors.surface,
                  height: 40,
                },
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text
                style={[
                  {
                    color:
                      activeCategory === category.id
                        ? colors.background
                        : colors.text,
                    fontWeight:
                      activeCategory === category.id ? "bold" : "normal",
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          horizontal={false}
        >
          {/* If filtering by category, only show that category */}
          {activeCategory === "All"
            ? menuItems.slice(1).map((category) => renderMenuCategory(category))
            : renderMenuCategory(
                menuItems.find((category) => category.id === activeCategory)
              )}
        </ScrollView>

        {/* Basket Button */}
        {totalItems() > 0 && (
          <Animated.View
            style={[
              styles.basketButtonContainer,
              { transform: [{ scale: basketBounce }] },
            ]}
          >
            <TouchableOpacity
              style={[styles.basketButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate("Basket", { basket })}
            >
              <LinearGradient
                colors={[colors.primary, colors.tertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.basketGradient}
              >
                <View style={styles.basketContent}>
                  <View style={styles.basketInfo}>
                    <Ionicons
                      name="cart-outline"
                      size={24}
                      color={colors.background}
                    />
                    <Text
                      style={[styles.basketText, { color: colors.background }]}
                    >
                      {totalItems()} {totalItems() === 1 ? "item" : "items"}
                    </Text>
                  </View>
                  <Text
                    style={[styles.basketTotal, { color: colors.background }]}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "XAF",
                      minimumFractionDigits: 2,
                    }).format(totalPrice)}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
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
    justifyContent: "center",
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
  searchContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesScroll: {
    height: 80,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonText: {
    fontSize: 14,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  categoryContainer: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  menuItem: {
    borderRadius: 16,
    marginRight: 15,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menuItemContent: {
    padding: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    marginBottom: 10,
  },
  menuItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  basketButtonContainer: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  basketButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  basketGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  basketContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  basketInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  basketText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  basketTotal: {
    fontSize: 16,
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
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default MenuScreen;
