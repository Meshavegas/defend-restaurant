import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";

type Props = {
  children: React.ReactNode;
  style: ViewStyle;
};

const PageView = ({ children, style }: Props) => {
  return (
    <View style={style}>
      {children}
      <View
        style={{
          height: 50,
        }}
      ></View>
    </View>
  );
};

export default PageView;

const styles = StyleSheet.create({});
