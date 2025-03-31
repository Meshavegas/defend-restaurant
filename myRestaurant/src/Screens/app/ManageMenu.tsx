"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
  Image, // Added ScrollView import
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../context/themeContext";
import PageView from "../../components/pageContainer";
import menuService from "../../service/menuService";
import { HeaderComponent } from "../../components/menu/HeaderComponent";
import { TabSwitcher } from "../../components/menu/TabSwitcher";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

// Mock data for menu items
const initialMenuItems = [
  {
    id: "1",
    name: "Fufu Deluxe",
    price: 1500,
    category_id: "1",
    description: "Traditional fufu with special sauce",
    is_available: true,
    preparation_time: 15,
    image: "https://example.com/fufu.jpg",
  },
  {
    id: "2",
    name: "Pizza Royale",
    price: 1800,
    category_id: "2",
    description: "Delicious pizza with premium toppings",
    is_available: true,
    preparation_time: 20,
    image: "https://example.com/pizza.jpg",
  },
  {
    id: "3",
    name: "Salade César",
    price: 1200,
    category_id: "3",
    description: "Fresh Caesar salad with homemade dressing",
    is_available: true,
    preparation_time: 10,
    image: "https://example.com/salad.jpg",
  },
];

// Mock data for categories
const initialCategories = [
  { id: "1", name: "Local Dishes", description: "Traditional local cuisine" },
  {
    id: "2",
    name: "International",
    description: "Dishes from around the world",
  },
  { id: "3", name: "Salads", description: "Fresh and healthy options" },
];

const ManageMenu = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useAppContext();

  // State
  const [activeTab, setActiveTab] = useState("Items");
  const [menuItems, setMenuItems] = useState<IMenuItemAndCategory[]>([]);
  const [categories, setCategories] = useState<ICategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Form states for menu item
  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    is_available: true,
    preparation_time: "",
    image: "",
  });

  // Form states for category
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

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

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form states
  const resetItemForm = () => {
    setItemForm({
      name: "",
      price: "",
      category_id: "",
      description: "",
      is_available: true,
      preparation_time: "",
      image: "",
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
    });
  };

  // Open modal for adding new item
  const handleAddItem = () => {
    setCurrentItem(null);
    resetItemForm();
    setItemModalVisible(true);
  };

  // Open modal for editing existing item
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setItemForm({
      name: item.name,
      price: item.price.toString(),
      category_id: item.category_id,
      description: item.description || "",
      is_available: item.is_available,
      preparation_time: item.preparation_time
        ? item.preparation_time.toString()
        : "",
      image: item.image || "",
    });
    setItemModalVisible(true);
  };

  useEffect(() => {
    menuService.getMenuItemsAndCategories().then((response) => {
      setMenuItems(response);
    });
    menuService.getCategories().then((response) => {
      setCategories(response);
    });
  }, []);

  // Delete menu item
  const handleDeleteItem = (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this menu item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
              setMenuItems(menuItems.filter((item) => item.id !== id));
              setIsLoading(false);
            }, 500);
          },
        },
      ]
    );
  };

  // Save menu item (create or update)
  const handleSaveItem = async () => {
    // Validate form
    if (!itemForm.name || !itemForm.price || !itemForm.category_id) {
      Alert.alert("Error", "Name, price and category are required fields");
      return;
    }

    setIsLoading(true);
    try {
      const {
        name,
        description,
        price,
        is_available,
        preparation_time,
        image,
        category_id,
      } = itemForm;
      const response = await menuService.createMenuItemFormData({
        name,
        description,
        price,
        is_available,
        preparation_time,
        image_url: image,
        category_id,
      });
      const newItems = await menuService.getMenuItemsAndCategories();
      setMenuItems(newItems);
      setItemForm({
        name: "",
        price: "",
        category_id: "",
        description: "",
        is_available: true,
        preparation_time: "",
        image: "",
      });
      setItemModalVisible(false);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving the item");
      setIsLoading(false);
    }
  };

  // Open modal for adding new category
  const handleAddCategory = () => {
    setCurrentCategory(null);
    resetCategoryForm();
    setCategoryModalVisible(true);
  };

  // Open modal for editing existing category
  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
    });
    setCategoryModalVisible(true);
  };

  // Delete category
  const handleDeleteCategory = (id) => {
    // Check if category is in use
    const inUse = menuItems.some((item) => item.category.id === id);

    if (inUse) {
      Alert.alert(
        "Cannot Delete",
        "This category is in use by one or more menu items. Please reassign or delete those items first."
      );
      return;
    }

    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
              setCategories(
                categories.filter((category) => category.id !== id)
              );
              setIsLoading(false);
            }, 500);
          },
        },
      ]
    );
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  // Save category (create or update)
  const handleSaveCategory = async () => {
    // Validate form
    if (!categoryForm.name) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setIsLoading(true);
    menuService
      .createCategory({
        name: categoryForm.name,
        description: categoryForm.description,
      })
      .then((response) => {
        menuService.getCategories().then((response) => {
          setCategories(response);
          setIsLoading(false);
          setCategoryModalVisible(false);
        });
      });
  };

  // Get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Render menu item
  const renderMenuItem = ({ item }) => (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          backgroundColor: colors.surface,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>
            {item.price.toLocaleString()} F
          </Text>
        </View>

        <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>
          {item.category.name}
        </Text>

        {item.description && (
          <Text
            style={[styles.itemDescription, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}

        <View style={styles.itemFooter}>
          <View style={styles.itemMeta}>
            <View style={styles.metaItem}>
              <Ionicons
                name={item.is_available ? "checkmark-circle" : "close-circle"}
                size={16}
                color={item.is_available ? colors.success : colors.error}
              />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.is_available ? "Available" : "Unavailable"}
              </Text>
            </View>

            {item.preparation_time && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.metaText, { color: colors.textSecondary }]}
                >
                  {item.preparation_time} min
                </Text>
              </View>
            )}
          </View>

          <View style={styles.itemActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: `${colors.primary}20` },
              ]}
              onPress={() => handleEditItem(item)}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: `${colors.error}20` },
              ]}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  // Render category
  const renderCategory = ({ item }) => (
    <Animated.View
      style={[
        styles.categoryContainer,
        {
          backgroundColor: colors.surface,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryName, { color: colors.text }]}>
          {item.name}
        </Text>

        {item.description && (
          <Text
            style={[
              styles.categoryDescription,
              { color: colors.textSecondary },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}

        <View style={styles.categoryActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: `${colors.primary}20` },
            ]}
            onPress={() => handleEditCategory(item)}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: `${colors.error}20` },
            ]}
            onPress={() => handleDeleteCategory(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Expo 48+ returns an array in result.assets
      setItemForm({ ...itemForm, image: result.assets[0].uri });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderComponent title="Manage Menu" onBack={() => navigation.goBack()} />

      {/* Tabs */}
      <TabSwitcher
        tabs={["Items", "Categories"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
          placeholder={`Search ${
            activeTab.toLowerCase() === "items" ? "menu items" : "categories"
          }...`}
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

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading...
            </Text>
          </View>
        ) : activeTab?.toLowerCase() === "items" ? (
          <FlatList
            data={filteredMenuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No menu items found
              </Text>
            }
          />
        ) : (
          <FlatList
            data={filteredCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No categories found
              </Text>
            }
          />
        )}
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={activeTab === "items" ? handleAddItem : handleAddCategory}
      >
        <Ionicons name="add" size={24} color={colors.background} />
      </TouchableOpacity>

      {/* Menu Item Modal */}
      <Modal
        visible={itemModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setItemModalVisible(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {currentItem ? "Edit Menu Item" : "Add Menu Item"}
              </Text>
              <TouchableOpacity onPress={() => setItemModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              {/* Name Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Name <Text style={{ color: colors.error }}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter item name"
                  placeholderTextColor={colors.textSecondary}
                  value={itemForm.name}
                  onChangeText={(text) =>
                    setItemForm({ ...itemForm, name: text })
                  }
                />
              </View>

              {/* Price Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Price <Text style={{ color: colors.error }}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter price"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={itemForm.price}
                  onChangeText={(text) =>
                    setItemForm({ ...itemForm, price: text })
                  }
                />
              </View>

              {/* Category Dropdown */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Category <Text style={{ color: colors.error }}>*</Text>
                </Text>
                <View
                  style={[
                    styles.pickerContainer,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.categoryChip,
                          {
                            backgroundColor:
                              itemForm.category_id === item.id
                                ? colors.primary
                                : colors.background,
                            borderColor: colors.border,
                          },
                        ]}
                        onPress={() =>
                          setItemForm({ ...itemForm, category_id: item.id })
                        }
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            {
                              color:
                                itemForm.category_id === item.id
                                  ? colors.background
                                  : colors.text,
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Description
                </Text>
                <TextInput
                  style={[
                    styles.formTextArea,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter description"
                  placeholderTextColor={colors.textSecondary}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={itemForm.description}
                  onChangeText={(text) =>
                    setItemForm({ ...itemForm, description: text })
                  }
                />
              </View>

              {/* Availability Toggle */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Availability
                </Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      {
                        backgroundColor: itemForm.is_available
                          ? colors.primary
                          : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() =>
                      setItemForm({ ...itemForm, is_available: true })
                    }
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        {
                          color: itemForm.is_available
                            ? colors.background
                            : colors.text,
                        },
                      ]}
                    >
                      Available
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      {
                        backgroundColor: !itemForm.is_available
                          ? colors.error
                          : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() =>
                      setItemForm({ ...itemForm, is_available: false })
                    }
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        {
                          color: !itemForm.is_available
                            ? colors.background
                            : colors.text,
                        },
                      ]}
                    >
                      Unavailable
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Preparation Time Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Preparation Time (minutes)
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter preparation time"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={itemForm.preparation_time}
                  onChangeText={(text) =>
                    setItemForm({ ...itemForm, preparation_time: text })
                  }
                />
              </View>

              {/* Image URL Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Image
                </Text>
                {itemForm.image ? (
                  <Image
                    source={{ uri: itemForm.image }}
                    style={styles.imagePreview}
                  />
                ) : null}
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={handlePickImage}
                >
                  <Text
                    style={[
                      styles.imagePickerButtonText,
                      { color: colors.text },
                    ]}
                  >
                    {itemForm.image ? "Change Image" : "Pick an Image"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setItemModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveItem}
              >
                <Text
                  style={[styles.saveButtonText, { color: colors.background }]}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {currentCategory ? "Edit Category" : "Add Category"}
              </Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              {/* Name Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Name <Text style={{ color: colors.error }}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter category name"
                  placeholderTextColor={colors.textSecondary}
                  value={categoryForm.name}
                  onChangeText={(text) =>
                    setCategoryForm({ ...categoryForm, name: text })
                  }
                />
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Description
                </Text>
                <TextInput
                  style={[
                    styles.formTextArea,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter description"
                  placeholderTextColor={colors.textSecondary}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={categoryForm.description}
                  onChangeText={(text) =>
                    setCategoryForm({ ...categoryForm, description: text })
                  }
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveCategory}
              >
                <Text
                  style={[styles.saveButtonText, { color: colors.background }]}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagePreview: {
    width: "100%", // occupe toute la largeur du conteneur
    height: 200, // hauteur fixe, ajustez selon vos besoins
    borderRadius: 8, // arrondir les coins
    marginBottom: 10, // espacement sous l'image
    resizeMode: "cover", // pour bien couvrir le conteneur
  },
  imagePickerButton: {
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 10,
  },
  imagePickerButtonText: {
    fontSize: 16,
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
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  itemContainer: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemContent: {
    padding: 15,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemCategory: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  itemMeta: {
    flexDirection: "row",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 5,
  },
  itemActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  categoryContainer: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryContent: {
    padding: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  categoryActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "90%",
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
  modalForm: {
    padding: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  formInput: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  formTextArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
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

export default ManageMenu;
