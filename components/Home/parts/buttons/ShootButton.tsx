import { FC, useRef } from "react";
import { Pressable, View, StyleSheet, Animated } from "react-native";
import { colors } from "../../../../styles/variables";

interface ShootButtonProps {
  onPress: () => void;
}

const ShootButton: FC<ShootButtonProps> = ({ onPress }) => {
  const animatedRef = useRef(new Animated.Value(0)).current;
  const AnimatablePressable = Animated.createAnimatedComponent(Pressable);
  const handlePress = () => {
    const defaultOptions = {
      duration: 75,
      useNativeDriver: true,
    };
    Animated.sequence([
      Animated.timing(animatedRef, { ...defaultOptions, toValue: 2 }),
      Animated.timing(animatedRef, { ...defaultOptions, toValue: 0 }),
    ]).start(({ finished }) => {
      finished && onPress();
    });
  };
  return (
    <View style={styles.buttonCont}>
      <AnimatablePressable
        onPress={handlePress}
        style={[
          styles.button,
          {
            transform: [
              {
                translateY: animatedRef,
              },
            ],
          },
        ]}
      ></AnimatablePressable>
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
