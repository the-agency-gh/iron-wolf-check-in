import { FC, ReactNode } from "react";
import { Pressable, Text, StyleSheet, StyleProp, TextStyle, ViewStyle } from "react-native";
import { colors, shadow } from "../../../styles/variables";

interface FormButtonProps {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const FormButton: FC<FormButtonProps> = ({ onPress, children, style, textStyle }) => {
  return (
    <Pressable android_ripple={{ color: "#dddddd88" }} style={[styles.submitBtn, shadow, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </Pressable>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  submitBtn: {
    backgroundColor: colors.darkBlue,
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
