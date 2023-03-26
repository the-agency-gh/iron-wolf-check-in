import { StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Text, Alert } from "react-native";
import { useQuery } from "react-query";

import BackIcon from "../components/navigation/BackIcon";
import { retrieveSetting } from "../utils/database";
interface SettingsProps extends StackScreenProps<any> {}

const SettingsScreen: FC<SettingsProps> = ({ navigation }) => {
  const { isLoading, error, data } = useQuery("settingData", () => retrieveSetting());
  const [settingsData, setSettingsData] = useState<object | unknown>(data);
  const handleBackPress = () => {
    if (isLoading) return;
    if (!settingsData) {
      Alert.alert("Default Setting Required", "Please enter in your initial setting");
    }
    navigation.navigate("Home");
  };
  const handleSettingSubmit = () => {};
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return <BackIcon onPress={handleBackPress} />;
      },
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.screen}>
      {error ? <Text> error</Text> : isLoading ? <Text>Loading</Text> : <Text>SettingsScreen</Text>}
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
