import { StyleSheet, SafeAreaView, View, Text } from "react-native";

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <Text>SettingsScreen</Text>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
