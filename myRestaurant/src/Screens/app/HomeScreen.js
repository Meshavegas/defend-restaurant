import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { images } from "../../const/images";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Text */}
        <Text style={styles.welcomeText}>🍽️ Welcome to Our Restaurant</Text>

        {/* Restaurant Image Section */}
        <TouchableOpacity>
          <View style={styles.restaurantImageContainer}>
            <Image source={images.restaurant} style={styles.restaurantImage} />
          </View>
        </TouchableOpacity>

        {/* Services Section */}
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>Our Services</Text>
          <View style={styles.servicesList}>
            {/* Delivery Service */}
            <TouchableOpacity style={styles.serviceItem}>
              <Image source={images.delivery} style={styles.serviceImage} />
              <Text style={styles.serviceName}>Delivery</Text>
              <Text style={styles.serviceDescription}>
                Get your food delivered right to your doorstep!
              </Text>
            </TouchableOpacity>

            {/* Reservation Service */}
            <TouchableOpacity style={styles.serviceItem}>
              <Image source={images.reservation} style={styles.serviceImage} />
              <Text style={styles.serviceName}>Reservation</Text>
              <Text style={styles.serviceDescription}>
                Reserve your table in advance for a hassle-free experience.
              </Text>
            </TouchableOpacity>

            {/* Dine-In Service */}
            <TouchableOpacity style={styles.serviceItem}>
              <Image source={images.dinein} style={styles.serviceImage} />
              <Text style={styles.serviceName}>Dine-In</Text>
              <Text style={styles.serviceDescription}>
                Enjoy a comfortable and cozy dining experience with us.
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Information or Promotions */}
        <View style={styles.promoContainer}>
          <Text style={styles.promoTitle}>Special Offers & Promotions</Text>
          <Text style={styles.promoText}>
            Enjoy discounts on selected meals and free delivery for orders above
            $50!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "yellow",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  restaurantImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  restaurantImage: {
    width: 320,
    height: 180,
    borderRadius: 10,
  },
  servicesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  servicesTitle: {
    color: "yellow",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  servicesList: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  serviceItem: {
    alignItems: "center",
    marginBottom: 20,
  },
  serviceImage: {
    width: 320,
    height: 180,
    borderRadius: 10,
    marginBottom: 30,
  },
  serviceName: {
    color: "yellow",
    fontSize: 16,
    fontWeight: "bold",
  },
  serviceDescription: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  promoContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#444",
    borderRadius: 10,
  },
  promoTitle: {
    color: "yellow",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  promoText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
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
    fontSize: 13,
    marginTop: 4,
  },
});

export default HomeScreen;
