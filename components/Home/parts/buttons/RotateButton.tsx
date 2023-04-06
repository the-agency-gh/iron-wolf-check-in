import { FC, useRef } from "react";
import { Pressable, Animated, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../../../styles/variables";
import RotateIcon from "../../../../assets/icons/rotate.svg";

interface RotateButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const RotateButton: FC<RotateButtonProps> = ({ onPress, style }) => {
  const animatedRef = useRef(new Animated.Value(0)).current;
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const handleButtonPress = () => {
    Animated.timing(animatedRef, { toValue: 1, useNativeDriver: true, duration: 250 }).start(({ finished }) => {
      if (!finished) return;
      animatedRef.setValue(0);
      onPress();
    });
  };
  return (
    <AnimatedPressable
      onPress={handleButtonPress}
      style={[
        styles.buttonCont,
        {
          transform: [
            {
              rotate: animatedRef.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "-360deg"],
              }),
            },
          ],
        },
        style,
      ]}
    >
      <RotateIcon />
    </AnimatedPressable>
  );
};

export default RotateButton;

const styles = StyleSheet.create({
  buttonCont: {
    position: "absolute",
    right: 0,
    marginRight: 50,
    height: "70%",
    aspectRatio: "1/1",
    borderRadius: 200,
    padding: 15,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
