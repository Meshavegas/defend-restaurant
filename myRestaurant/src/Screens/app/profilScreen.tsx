"use client";

import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppContext } from "../../context/themeContext";
import PageView from "../../components/pageContainer";
import useAuthStore from "../../store/auth";

const { width } = Dimensions.get("window");

// Mock user data

const ProfileScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme, colors } = useAppContext();
  const { logout, users } = useAuthStore();
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const userData = {
    ...users,
    stats: [
      { label: "Orders", value: 24 },
      { label: "Reviews", value: 12 },
      { label: "Favorites", value: 8 },
    ],
  };

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

  return (
    <PageView style={styles.container}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

        {/* Header with gradient */}
        <LinearGradient
          colors={isDarkMode ? ["#1E1E1E", "#121212"] : ["#F5F5F5", "#FFFFFF"]}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Profile
          </Text>
          <View></View>

          {/* <TouchableOpacity style={styles.editButton}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity> */}
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Info Section */}
          <Animated.View
            style={[
              styles.profileSection,
              {
                backgroundColor: colors.surface,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {userData.first_name} {userData.last_name}
                </Text>
                <Text
                  style={[styles.userEmail, { color: colors.textSecondary }]}
                >
                  {userData.email} - {userData.phone_number}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Stats Section */}
          <Animated.View
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {userData.stats.map((stat, index) => (
              <View
                key={index}
                style={[styles.statCard, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {stat.value}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </Animated.View>

          {/* Settings Section */}
          <Animated.View
            style={[
              styles.settingsSection,
              {
                backgroundColor: colors.surface,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Settings
            </Text>

            {/* Dark Mode Toggle */}
            <View
              style={[styles.settingItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.settingInfo}>
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny"}
                  size={22}
                  color={isDarkMode ? colors.primary : colors.warning}
                  style={styles.settingIcon}
                />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{
                  false: colors.toggleInactive,
                  true: isDarkMode
                    ? `${colors.primary}50`
                    : `${colors.secondary}50`,
                }}
                thumbColor={isDarkMode ? colors.primary : colors.secondary}
                ios_backgroundColor={colors.toggleInactive}
              />
            </View>

            {/* Notification Setting */}
            <View
              style={[styles.settingItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.settingInfo}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={colors.text}
                  style={styles.settingIcon}
                />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Notifications
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </View>

            {/* Privacy Setting */}
            <View
              style={[styles.settingItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.settingInfo}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={colors.text}
                  style={styles.settingIcon}
                />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Privacy & Security
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          </Animated.View>

          {/* Account Section */}
          <Animated.View
            style={[
              styles.accountSection,
              {
                backgroundColor: colors.surface,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Account
            </Text>

            {/* Edit Profile */}
            <TouchableOpacity
              style={[styles.accountItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.settingInfo}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={colors.text}
                  style={styles.settingIcon}
                />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Edit Profile
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Payment Methods */}
            <TouchableOpacity
              style={[styles.accountItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.settingInfo}>
                <Ionicons
                  name="card-outline"
                  size={22}
                  color={colors.text}
                  style={styles.settingIcon}
                />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Payment Methods
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={[styles.logoutButton, { borderColor: colors.error }]}
              onPress={() => logout()}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
              <Text style={[styles.logoutText, { color: colors.error }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    </PageView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileSection: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FEB301",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  memberSince: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberSinceText: {
    fontSize: 12,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 48) / 3,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  settingsSection: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accountSection: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default ProfileScreen;
