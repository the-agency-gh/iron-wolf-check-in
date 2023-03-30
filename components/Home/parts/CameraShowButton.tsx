import { FC } from "react";
import { Pressable, Text, StyleSheet, StyleProp, View } from "react-native";
import { colors, shadow } from "../../../styles/variables";
import CameraIcon from "../../../assets/icons/camera-icon.svg";

interface CameraShowButtonProps {
  text: string;
  onPress: () => void;
  style?: StyleProp<any>;
}

const CameraShowButton: FC<CameraShowButtonProps> = ({ text, style, onPress }) => {
  return (
    <Pressable onPress={onPress} style={[styles.button, shadow, style]} android_ripple={{ color: colors.baseBlack }}>
      <View style={styles.iconContainer}>
        <CameraIcon />
      </View>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export default CameraShowButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  iconContainer: {
    zIndex: -1,
    position: "absolute",
    height: "100%",
    width: "100%",
    opacity: 0.3,
    overflow: "hidden",
  },
});
