import { FC, ReactNode } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";

interface ScreenContentProps {
  children: ReactNode;
  style?: object;
}

const ScreenContentView: FC<ScreenContentProps> = ({ children, style }) => {
  return <SafeAreaView style={[styles.SafeArea, style]}>{children}</SafeAreaView>;
};

export default ScreenContentView;

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
