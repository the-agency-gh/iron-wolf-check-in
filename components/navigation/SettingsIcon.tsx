import { FC } from "react";
import { Pressable, StyleSheet } from "react-native";

import SettingsSvg from "../../assets/icons/settings.svg";

interface SettingsIconProps {
  onPress: () => void;
  style?: object;
}

const SettingsIcon: FC<SettingsIconProps> = ({ onPress, style }) => {
  return (
    <Pressable style={[styles.iconContainer, style]} onPress={onPress}>
      <SettingsSvg style={styles.icon} />
    </Pressable>
  );
};

export default SettingsIcon;

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    margin: 10,
  },
  icon: {
    aspectRatio: 1 / 1,
  },
});
