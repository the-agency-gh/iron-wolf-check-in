import { FC } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../styles/variables";

interface LoadingViewProps {}

const LoadingView: FC<LoadingViewProps> = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={colors.amber} />
    </View>
  );
};

export default LoadingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
