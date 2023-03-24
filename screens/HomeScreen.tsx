import { StyleSheet, SafeAreaView, View, Text } from "react-native";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>HomeScreen</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#161616",
  },
  text: {
    color: "#f8f8f8",
  },
});
