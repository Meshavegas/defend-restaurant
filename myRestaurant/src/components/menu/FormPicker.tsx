import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAppContext } from "../../context/themeContext";

interface FormPickerProps {
  label: string;
  items: Array<{ id: string; name: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const FormPicker = ({
  label,
  items,
  selectedValue,
  onSelect,
}: FormPickerProps) => {
  const { colors } = useAppContext();

  return (
    <View style={styles.formGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
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
          data={items}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedValue === item.id
                      ? colors.primary
                      : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => onSelect(item.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      selectedValue === item.id
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
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
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
});
