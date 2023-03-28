import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../styles/variables";

interface HorizontalRuleProps {
  style?: object;
}

const HorizontalRule: FC<HorizontalRuleProps> = ({ style }) => {
  return <View style={[styles.horizontalRule, style]}></View>;
};

export default HorizontalRule;

const styles = StyleSheet.create({
  horizontalRule: {
    width: "100%",
    height: 2,
    backgroundColor: colors.white,
  },
});
