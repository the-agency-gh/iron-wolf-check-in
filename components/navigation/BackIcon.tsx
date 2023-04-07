import { FC } from "react";
import { Pressable, StyleSheet } from "react-native";

import BackSvg from "../../assets/icons/arrow-left.svg";

interface BackIconProps {
  onPress: () => void;
  style?: object;
}

const BackIcon: FC<BackIconProps> = ({ onPress, style }) => {
  return (
    <Pressable style={[styles.iconContainer, style]} onPress={onPress}>
      <BackSvg style={styles.icon} />
    </Pressable>
  );
};

export default BackIcon;

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    margin: 10,
  },
  icon: {
    aspectRatio: 1 / 1,
  },
});
