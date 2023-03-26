import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { colors } from "../styles/variables";
import ScreenContentView from "../components/ScreenContentView";
const HomeScreen = () => {
  return (
    <ScreenContentView style={styles.screen}>
      <Text style={styles.text}>where is this home screen? HomeScreen</Text>
    </ScreenContentView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  text: {
    color: colors.white,
  },
});
