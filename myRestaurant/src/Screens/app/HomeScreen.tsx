"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { images } from "../../const/images";
import PageView from "../../components/pageContainer";
import useAuthStore from "../../store/auth";
import { useAppContext } from "../../context/themeContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useAppContext();

  const { users, basket, totalItems } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Starters", "Drinks", "Desserts", "Main Courses"];
  const popularItems = [
    { id: 1, name: "Fufu Deluxe", price: "1500F", image: images.fufu },
    { id: 2, name: "Pizza Royale", price: "1800F", image: images.ndole },
    { id: 3, name: "Salade César", price: "1200F", image: images.rice },
  ];
  const styles = HomeStyles(colors);
  return (
    <PageView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Hello, {users?.first_name} 👋</Text>
            <Text style={styles.subGreeting}>
              What would you like today? 🤔
            </Text>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart" size={28} color={colors.background} />
            {basket.length > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems()}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dishes, menus..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Promo Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.promoCarousel}
        >
          <TouchableOpacity style={[styles.promoCard, styles.mainPromo]}>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTag}>New</Text>
              <Text style={styles.promoTitle}>New Menu 2025</Text>
              <Text style={styles.promoSubtitle}>-30% on desserts</Text>
            </View>
            <Image source={images.promo} style={styles.promoImage} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.promoCard}>
            <Text style={styles.secondaryPromoTitle}>Free delivery</Text>
            <Text style={styles.secondaryPromoText}>From 50€ on purchase</Text>
            <Ionicons
              name="bicycle"
              size={40}
              color={colors.primary}
              style={styles.promoIcon}
            />
          </TouchableOpacity>
        </ScrollView>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                index === 0 && styles.activeCategory,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  index === 0 && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Section */}
        <Text style={styles.sectionTitle}>Popular dishes 🔥</Text>
        <FlatList
          data={popularItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemCard}>
              <Image source={item.image} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />

        {/* Services Section */}
        <Text style={styles.sectionTitle}>Our services ⚡</Text>
        <View style={styles.servicesGrid}>
          <TouchableOpacity style={styles.serviceCard}>
            <Ionicons name="fast-food" size={30} color={colors.primary} />
            <Text style={styles.serviceTitle}>Digital Menu</Text>
            <Text style={styles.serviceSubtitle}>Order directly</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard}>
            <Ionicons name="time" size={30} color={colors.primary} />
            <Text style={styles.serviceTitle}>Reservation</Text>
            <Text style={styles.serviceSubtitle}>Table in 1 click</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PageView>
  );
};

const HomeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 15,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 40,
      paddingRight: 10,
    },
    headerContent: {
      flex: 1,
    },
    greeting: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: "bold",
    },
    subGreeting: {
      color: colors.text,
      fontSize: 16,
      opacity: 0.8,
    },
    profileButton: {
      backgroundColor: colors.surface,
      padding: 10,
      borderRadius: 50,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 25,
      paddingHorizontal: 20,
      marginVertical: 20,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      height: 50,
    },
    promoCarousel: {
      marginBottom: 25,
    },
    promoCard: {
      width: 300,
      height: 150,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      marginRight: 15,
    },
    mainPromo: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    promoImage: {
      width: 120,
      height: 120,
      resizeMode: "contain",
    },
    promoTextContainer: {
      flex: 1,
    },
    promoTag: {
      color: colors.primary,
      backgroundColor: colors.background,
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      fontSize: 12,
      marginBottom: 10,
    },
    promoTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 5,
    },
    promoSubtitle: {
      color: colors.primary,
      fontSize: 16,
    },
    secondaryPromoTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    secondaryPromoText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    promoIcon: {
      position: "absolute",
      bottom: 15,
      right: 15,
    },
    categoriesContainer: {
      paddingVertical: 15,
    },
    categoryButton: {
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      marginRight: 10,
    },
    activeCategory: {
      backgroundColor: colors.primary,
    },
    categoryText: {
      color: colors.text,
    },
    activeCategoryText: {
      color: colors.background,
      fontWeight: "bold",
    },
    sectionTitle: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 15,
    },
    itemCard: {
      width: 200,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 15,
      marginRight: 15,
    },
    itemImage: {
      width: "100%",
      height: 120,
      borderRadius: 15,
      marginBottom: 10,
    },
    itemName: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 16,
    },
    itemPrice: {
      color: colors.primary,
      fontSize: 14,
      marginVertical: 5,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingVertical: 8,
      borderRadius: 15,
      alignItems: "center",
    },
    addButtonText: {
      color: colors.background,
      fontWeight: "bold",
    },
    servicesGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    serviceCard: {
      width: "48%",
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
    },
    serviceTitle: {
      color: colors.text,
      fontWeight: "bold",
      marginTop: 10,
    },
    serviceSubtitle: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    cartButton: {
      // position: "absolute",
      // bottom: 75,
      // right: 30,
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 30,
      elevation: 5,
    },
    cartBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: colors.error,
      borderRadius: 10,
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    cartBadgeText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: "bold",
    },
  });

export default HomeScreen;
