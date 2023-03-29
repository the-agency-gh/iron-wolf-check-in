import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";

interface InitialProfileScreenProps {}

const InitialProfileScreen: FC<InitialProfileScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>Init Screen</Text>
    </View>
  );
};

export default InitialProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
});
