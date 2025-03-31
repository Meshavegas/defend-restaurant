"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Animated,
  Dimensions,
  TextInput,
  Modal,
  Alert,
  ScrollView, // Added ScrollView import
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../context/themeContext";
import PageView from "../../components/pageContainer";

const { width } = Dimensions.get("window");

// Mock data for reservations
const initialReservations = [
  {
    id: "1",
    name: "John Doe",
    date: "2025-04-05",
    time: "19:30",
    guests: 4,
    status: "confirmed",
    notes: "Window seat preferred",
    phone: "6123456789",
  },
  {
    id: "2",
    name: "Alice Smith",
    date: "2025-04-05",
    time: "20:00",
    guests: 2,
    status: "pending",
    notes: "Anniversary celebration",
    phone: "6987654321",
  },
  {
    id: "3",
    name: "Robert Johnson",
    date: "2025-04-06",
    time: "18:15",
    guests: 6,
    status: "confirmed",
    notes: "Allergic to nuts",
    phone: "6555123456",
  },
];

const TableReservations = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useAppContext();

  // State
  const [reservations, setReservations] = useState(initialReservations);
  const [filteredReservations, setFilteredReservations] =
    useState(initialReservations);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

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

  // Filter reservations based on search query and active filter
  useEffect(() => {
    let result = reservations;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phone.includes(searchQuery)
      );
    }

    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter((item) => item.status === activeFilter);
    }

    setFilteredReservations(result);
  }, [searchQuery, activeFilter, reservations]);

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setDetailModalVisible(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setReservations(
      reservations.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation({ ...selectedReservation, status: newStatus });
    }
  };

  const handleDeleteReservation = (id) => {
    Alert.alert(
      "Delete Reservation",
      "Are you sure you want to delete this reservation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setReservations(reservations.filter((item) => item.id !== id));
            setDetailModalVisible(false);
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "cancelled":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderReservationItem = ({ item }) => (
    <Animated.View
      style={[
        styles.reservationItem,
        {
          backgroundColor: colors.surface,
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.reservationContent}
        onPress={() => handleViewDetails(item)}
      >
        <View style={styles.reservationHeader}>
          <Text style={[styles.reservationName, { color: colors.text }]}>
            {item.name}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(item.status)}20` },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.reservationDetails}>
          <View style={styles.detailItem}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.date}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.time}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.guests} {item.guests === 1 ? "guest" : "guests"}
            </Text>
          </View>
        </View>

        <View style={styles.reservationActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: `${colors.primary}20` },
            ]}
            onPress={() => handleViewDetails(item)}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

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
            Table Reservations
          </Text>

          <View style={{ width: 40 }} />
        </View>

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
            placeholder="Search by name or phone..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "all" && [
                  styles.activeFilterTab,
                  { borderColor: colors.primary },
                ],
              ]}
              onPress={() => setActiveFilter("all")}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      activeFilter === "all"
                        ? colors.primary
                        : colors.textSecondary,
                  },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "confirmed" && [
                  styles.activeFilterTab,
                  { borderColor: colors.success },
                ],
              ]}
              onPress={() => setActiveFilter("confirmed")}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      activeFilter === "confirmed"
                        ? colors.success
                        : colors.textSecondary,
                  },
                ]}
              >
                Confirmed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "pending" && [
                  styles.activeFilterTab,
                  { borderColor: colors.warning },
                ],
              ]}
              onPress={() => setActiveFilter("pending")}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      activeFilter === "pending"
                        ? colors.warning
                        : colors.textSecondary,
                  },
                ]}
              >
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "cancelled" && [
                  styles.activeFilterTab,
                  { borderColor: colors.error },
                ],
              ]}
              onPress={() => setActiveFilter("cancelled")}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      activeFilter === "cancelled"
                        ? colors.error
                        : colors.textSecondary,
                  },
                ]}
              >
                Cancelled
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Reservations List */}
        <FlatList
          data={filteredReservations}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={50}
                color={colors.textSecondary}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No reservations found
              </Text>
            </View>
          }
        />

        {/* Reservation Detail Modal */}
        <Modal
          visible={detailModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDetailModalVisible(false)}
        >
          {selectedReservation && (
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Reservation Details
                  </Text>
                  <TouchableOpacity
                    onPress={() => setDetailModalVisible(false)}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.detailSection}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Customer
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedReservation.name}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Phone
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedReservation.phone}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <View
                      style={[
                        styles.detailSection,
                        { flex: 1, marginRight: 10 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.detailLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Date
                      </Text>
                      <Text
                        style={[styles.detailValue, { color: colors.text }]}
                      >
                        {selectedReservation.date}
                      </Text>
                    </View>

                    <View style={[styles.detailSection, { flex: 1 }]}>
                      <Text
                        style={[
                          styles.detailLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Time
                      </Text>
                      <Text
                        style={[styles.detailValue, { color: colors.text }]}
                      >
                        {selectedReservation.time}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Number of Guests
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedReservation.guests}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Status
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: `${getStatusColor(
                            selectedReservation.status
                          )}20`,
                          alignSelf: "flex-start",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(selectedReservation.status) },
                        ]}
                      >
                        {selectedReservation.status.charAt(0).toUpperCase() +
                          selectedReservation.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {selectedReservation.notes && (
                    <View style={styles.detailSection}>
                      <Text
                        style={[
                          styles.detailLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Notes
                      </Text>
                      <Text
                        style={[styles.detailValue, { color: colors.text }]}
                      >
                        {selectedReservation.notes}
                      </Text>
                    </View>
                  )}

                  <View style={styles.statusActions}>
                    <Text
                      style={[
                        styles.statusActionsTitle,
                        { color: colors.text },
                      ]}
                    >
                      Update Status
                    </Text>
                    <View style={styles.statusButtons}>
                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          {
                            backgroundColor:
                              selectedReservation.status === "confirmed"
                                ? colors.success
                                : `${colors.success}20`,
                          },
                        ]}
                        onPress={() =>
                          handleUpdateStatus(
                            selectedReservation.id,
                            "confirmed"
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            {
                              color:
                                selectedReservation.status === "confirmed"
                                  ? colors.background
                                  : colors.success,
                            },
                          ]}
                        >
                          Confirm
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          {
                            backgroundColor:
                              selectedReservation.status === "pending"
                                ? colors.warning
                                : `${colors.warning}20`,
                          },
                        ]}
                        onPress={() =>
                          handleUpdateStatus(selectedReservation.id, "pending")
                        }
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            {
                              color:
                                selectedReservation.status === "pending"
                                  ? colors.background
                                  : colors.warning,
                            },
                          ]}
                        >
                          Pending
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          {
                            backgroundColor:
                              selectedReservation.status === "cancelled"
                                ? colors.error
                                : `${colors.error}20`,
                          },
                        ]}
                        onPress={() =>
                          handleUpdateStatus(
                            selectedReservation.id,
                            "cancelled"
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            {
                              color:
                                selectedReservation.status === "cancelled"
                                  ? colors.background
                                  : colors.error,
                            },
                          ]}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[
                      styles.deleteButton,
                      { backgroundColor: `${colors.error}20` },
                    ]}
                    onPress={() =>
                      handleDeleteReservation(selectedReservation.id)
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={colors.error}
                    />
                    <Text
                      style={[styles.deleteButtonText, { color: colors.error }]}
                    >
                      Delete Reservation
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.closeButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setDetailModalVisible(false)}
                  >
                    <Text
                      style={[
                        styles.closeButtonText,
                        { color: colors.background },
                      ]}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Modal>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeFilterTab: {
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  reservationItem: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  reservationContent: {
    padding: 15,
  },
  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reservationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  reservationDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 5,
  },
  reservationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 15,
  },
  detailSection: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  statusActions: {
    marginTop: 10,
  },
  statusActionsTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  statusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
  closeButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "500",
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

export default TableReservations;
