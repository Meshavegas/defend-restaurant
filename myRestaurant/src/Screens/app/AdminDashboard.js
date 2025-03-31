"use client";

import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../context/themeContext";
import PageView from "../../components/pageContainer";

const { width } = Dimensions.get("window");

const AdminDashboard = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useAppContext();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const menuItems = [
    {
      id: 1,
      title: "Manage Users",
      icon: "people",
      screen: "ManageUsers",
      description: "Add, edit, or remove user accounts",
      color: colors.primary,
    },
    {
      id: 2,
      title: "Manage Menu",
      icon: "restaurant",
      screen: "ManageMenu",
      description: "Update menu items and categories",
      color: colors.tertiary,
    },
    {
      id: 3,
      title: "Manage Orders",
      icon: "clipboard",
      screen: "ManageOrders",
      description: "View and process customer orders",
      color: colors.secondary,
    },
    {
      id: 4,
      title: "Table Reservations",
      icon: "calendar",
      screen: "TableReservations",
      description: "Manage customer table bookings",
      color: colors.primary,
    },
    {
      id: 5,
      title: "Generate Reports",
      icon: "stats-chart",
      screen: "GenerateReports",
      description: "View sales and performance analytics",
      color: colors.tertiary,
    },
    {
      id: 6,
      title: "Settings",
      icon: "settings",
      screen: "AdminSettings",
      description: "Configure application settings",
      color: colors.secondary,
    },
  ];

  return (
    <PageView>
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
            Admin Dashboard
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Dashboard Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                backgroundColor: colors.surface,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.welcomeContent}>
              <Text style={[styles.welcomeTitle, { color: colors.primary }]}>
                Welcome, Admin
              </Text>
              <Text
                style={[
                  styles.welcomeSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Manage your restaurant operations
              </Text>
            </View>
            <View
              style={[styles.statsContainer, { borderColor: colors.border }]}
            >
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  24
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Orders
                </Text>
              </View>
              <View
                style={[styles.statDivider, { backgroundColor: colors.border }]}
              />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  8
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Reservations
                </Text>
              </View>
            </View>
          </Animated.View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Management Options
          </Text>

          <View style={styles.cardsContainer}>
            {menuItems.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 15 * (index + 1)],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.card, { backgroundColor: colors.surface }]}
                  onPress={() => navigation.navigate(item.screen)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${item.color}20` },
                    ]}
                  >
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.cardDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation Toolbar */}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  welcomeContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeContent: {
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 15,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  cardsContainer: {
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
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

export default AdminDashboard;
