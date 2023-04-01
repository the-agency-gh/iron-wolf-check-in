import { FC } from "react";
import { Pressable, StyleSheet, StyleProp } from "react-native";
import XIcon from "../../../../assets/icons/x-icon.svg";
interface CloseButtonProps {
  onPress: () => void;
  style?: StyleProp<any>;
}

const CloseButton: FC<CloseButtonProps> = ({ onPress, style }) => {
  return (
    <Pressable onPress={onPress} style={[styles.closeButton, style]}>
      <XIcon />
    </Pressable>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  closeButton: {
    width: 50,
    height: 50,
  },
});
