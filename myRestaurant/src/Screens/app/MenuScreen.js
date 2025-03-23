import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { menuItems } from "../../const/menu";

const MenuScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [basket, setBasket] = useState([]);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToBasket = (item) => {
    setBasket((prevBasket) => {
      const itemExists = prevBasket.find(
        (basketItem) => basketItem.id === item.id
      );
      if (itemExists) {
        return prevBasket.map((basketItem) =>
          basketItem.id === item.id
            ? { ...basketItem, quantity: basketItem.quantity + 1 }
            : basketItem
        );
      } else {
        return [...prevBasket, { ...item, quantity: 1 }];
      }
    });
  };

  const renderMenuCategory = (category) => {
    const categoryItems = filteredMenu.filter(
      (item) => item.category === category
    );

    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <FlatList
          data={categoryItems}
          keyExtractor={(item, index) => `${index}${item.id}`} // Ensure each item has a unique key prop
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => addToBasket(item)}
            >
              <Image source={item.image} style={styles.menuImage} />
              <Text style={styles.menuText}>{item.name}</Text>
              <Text style={styles.priceText}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food..."
          placeholderTextColor="gray"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Render Categories */}
        {["Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"].map((category) =>
          renderMenuCategory(category)
        )}
      </ScrollView>

      {/* Basket Button */}
      <TouchableOpacity
        style={styles.basketButton}
        onPress={() => navigation.navigate("Basket", { basket })}
      >
        <Ionicons name="cart-outline" size={24} color="black" />
        <Text style={styles.basketText}>Basket ({basket.length})</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={28} color="white" />
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("Menu")}
        >
          <Ionicons name="restaurant" size={28} color="yellow" />
          <Text style={styles.iconText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("Reservation")}
        >
          <Ionicons name="calendar-outline" size={28} color="white" />
          <Text style={styles.iconText}>Reservation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person" size={28} color="white" />
          <Text style={styles.iconText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 40,
  },
  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    color: "yellow",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItem: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
  },
  menuImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  menuText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  priceText: {
    color: "yellow",
    fontSize: 14,
    marginTop: 5,
  },
  basketButton: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "yellow",
    padding: 15,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  basketText: {
    color: "black",
    marginLeft: 10,
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 100, // Make sure content doesn't get overlapped by the bottom button
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#222",
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
});

export default MenuScreen;
