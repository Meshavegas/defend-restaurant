import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useAppContext } from "../../context/themeContext";

export const TabSwitcher = ({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const { colors } = useAppContext();

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && [
              styles.activeTab,
              { borderColor: colors.primary },
            ],
          ]}
          onPress={() => onTabChange(tab)}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === tab ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
