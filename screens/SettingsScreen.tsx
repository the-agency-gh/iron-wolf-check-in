import { FC } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
//-------components and func
import Settings from "../components/Settings/Settings";

const SettingsScreen: FC = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <Settings />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 25,
  },
});
