import { FC } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { colors } from "../../../../styles/variables";

interface NextButtonProps {
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}

const NextButton: FC<NextButtonProps> = ({
  onPress,
  text,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      style={[styles.button, style]}
      android_ripple={{ color: colors.baseBlack }}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </Pressable>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    // backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    width: "45%",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
});
