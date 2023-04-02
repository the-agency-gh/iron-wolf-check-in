import { FC } from "react";
import { View, StyleSheet, StyleProp, ActivityIndicator } from "react-native";
import { colors } from "../styles/variables";

interface LoadingViewProps {
  style?: StyleProp<any>;
}

const LoadingView: FC<LoadingViewProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
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
