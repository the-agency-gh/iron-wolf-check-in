import { FC } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { colors } from "../../../../styles/variables";

interface ShootButtonProps {
  onPress: () => void;
}

const ShootButton: FC<ShootButtonProps> = ({ onPress }) => {
  return (
    <View style={styles.buttonCont}>
      <Pressable onPress={onPress} style={[styles.button]}></Pressable>
    </View>
  );
};

export default ShootButton;

const styles = StyleSheet.create({
  buttonCont: {
    height: "100%",
    minWidth: 70,
    aspectRatio: "1/1",
    backgroundColor: colors.white,
    borderRadius: 200,
    padding: 5,
  },
  button: {
    aspectRatio: "1/1",
    backgroundColor: colors.white,
    borderRadius: 200,
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: colors.darkBlack,
  },
});
