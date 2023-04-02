import { FC } from "react";
import { Pressable, Text, ImageBackground, StyleSheet, StyleProp, View } from "react-native";
import { colors, shadow } from "../../../styles/variables";
import CameraIcon from "../../../assets/icons/camera-icon.svg";

interface CameraShowButtonProps {
  text: string;
  onPress: () => void;
  style?: StyleProp<any>;
  backgroundImg?: string | undefined;
}

const CameraShowButton: FC<CameraShowButtonProps> = ({ text, style, onPress, backgroundImg }) => {
  return (
    <Pressable onPress={onPress} style={[styles.button, shadow, style]} android_ripple={{ color: colors.baseBlack }}>
      {!backgroundImg ? (
        <View style={styles.indicatorCont}>
          <CameraIcon />
        </View>
      ) : (
        <ImageBackground source={{ uri: backgroundImg }} resizeMode="cover" style={styles.indicatorCont} />
      )}
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export default CameraShowButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    height: "100%",
    minHeight: 100,
  },
  text: {
    fontSize: 26,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  indicatorCont: {
    zIndex: -1,
    position: "absolute",
    height: "100%",
    width: "100%",
    opacity: 0.3,
    overflow: "hidden",
  },
});
