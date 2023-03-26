import { FC, ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import { colors } from "../../styles/variables";

interface FormButtonProps {
  onPress: () => void;
  children: ReactNode;
  style: object;
}

const FormButton: FC<FormButtonProps> = ({ onPress, children, style }) => {
  return (
    <Pressable style={[styles.submitBtn, style]} onPress={onPress}>
      {children}
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
});
