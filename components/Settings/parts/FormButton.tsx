import { FC, ReactNode } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors, shadow } from "../../../styles/variables";

interface FormButtonProps {
  onPress: () => void;
  children: ReactNode;
  style?: object;
}

const FormButton: FC<FormButtonProps> = ({ onPress, children, style }) => {
  return (
    <Pressable android_ripple={{ color: "#dddddd88" }} style={[styles.submitBtn, shadow, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  submitBtn: {
    backgroundColor: colors.darkBlue,
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
