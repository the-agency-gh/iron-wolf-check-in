import { FC } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";

interface SettingsProps {
  onSubmit: () => {};
}

const Settings: FC<SettingsProps> = ({ onSubmit }) => {
  return <View style={styles.container}></View>;
};

export default Settings;

const styles = StyleSheet.create({
  container: {},
});
