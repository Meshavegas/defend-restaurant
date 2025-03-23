import React, { useState } from "react";
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Tous",
    "Plats populaires",
    "Menus",
    "Desserts",
    "Boissons",
  ];
  const popularItems = [
    { id: 1, name: "Fufu Deluxe", price: "1500F", image: images.fufu },
    { id: 2, name: "Pizza Royale", price: "1800F", image: images.ndole },
    { id: 3, name: "Salade César", price: "1200F", image: images.rice },
  ];

  return (
    <PageView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Bonjour, 👋</Text>
            <Text style={styles.subGreeting}>
              Que souhaitez-vous aujourd'hui ?
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={24} color="yellow" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des plats, menus..."
            placeholderTextColor="gray"
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
              <Text style={styles.promoTag}>Nouveau</Text>
              <Text style={styles.promoTitle}>Menu Été 2024</Text>
              <Text style={styles.promoSubtitle}>-30% sur les desserts</Text>
            </View>
            <Image source={images.promo} style={styles.promoImage} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.promoCard}>
            <Text style={styles.secondaryPromoTitle}>Livraison gratuite</Text>
            <Text style={styles.secondaryPromoText}>Dès 50€ d'achat</Text>
            <Ionicons
              name="bicycle"
              size={40}
              color="yellow"
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
        <Text style={styles.sectionTitle}>Plats populaires 🔥</Text>
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
                <Text style={styles.addButtonText}>+ Ajouter</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />

        {/* Services Section */}
        <Text style={styles.sectionTitle}>Nos services ⚡</Text>
        <View style={styles.servicesGrid}>
          <TouchableOpacity style={styles.serviceCard}>
            <Ionicons name="fast-food" size={30} color="yellow" />
            <Text style={styles.serviceTitle}>Carte digitale</Text>
            <Text style={styles.serviceSubtitle}>Commandez directement</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard}>
            <Ionicons name="time" size={30} color="yellow" />
            <Text style={styles.serviceTitle}>Réservation</Text>
            <Text style={styles.serviceSubtitle}>Table en 1 clic</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      <TouchableOpacity style={styles.cartButton}>
        <Ionicons name="cart" size={28} color="black" />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </PageView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  greeting: {
    color: "yellow",
    fontSize: 24,
    fontWeight: "bold",
  },
  subGreeting: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  profileButton: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    height: 50,
  },
  promoCarousel: {
    marginBottom: 25,
  },
  promoCard: {
    width: 300,
    height: 150,
    backgroundColor: "#222",
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
    color: "yellow",
    backgroundColor: "#333",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    marginBottom: 10,
  },
  promoTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  promoSubtitle: {
    color: "yellow",
    fontSize: 16,
  },
  secondaryPromoTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  secondaryPromoText: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
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
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: "yellow",
  },
  categoryText: {
    color: "white",
  },
  activeCategoryText: {
    color: "black",
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "yellow",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  itemCard: {
    width: 200,
    backgroundColor: "#222",
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
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemPrice: {
    color: "yellow",
    fontSize: 14,
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: "yellow",
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  servicesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  serviceCard: {
    width: "48%",
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  serviceTitle: {
    color: "white",
    fontWeight: "bold",
    marginTop: 10,
  },
  serviceSubtitle: {
    color: "white",
    opacity: 0.7,
    fontSize: 12,
  },
  cartButton: {
    position: "absolute",
    bottom: 75,
    right: 30,
    backgroundColor: "yellow",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default HomeScreen;
