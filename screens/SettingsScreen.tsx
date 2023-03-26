import { StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect, useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import { StyleSheet, SafeAreaView, Text, Alert } from "react-native";
import { useQuery } from "react-query";

import BackIcon from "../components/navigation/BackIcon";
import Settings from "../components/Settings/Settings";
import { retrieveSetting } from "../utils/database";
interface SettingsProps extends StackScreenProps<any> {}
type settingDataProp = { email: string; password: string; [rest: string]: string };
const SettingsScreen: FC<SettingsProps> = ({ navigation }) => {
  const { isLoading, error, data } = useQuery("settingData", () => retrieveSetting());
  const [settingsData, setSettingsData] = useState<settingDataProp | unknown>(data);
  const settingsDatas = useMemo(() => data, [data]);
  const handleBackPress = () => {
    if (isLoading) return;
    if (!settingsDatas) {
      Alert.alert("Default Setting Required", "Please enter in your initial setting");
    } else {
      navigation.navigate("Home");
    }
  };
  const handleSettingSubmit = (data: FieldValues) => {
    console.log(data);
  };
  const handleSettingError = (error: FieldValues) => {
    console.error(error);
  };
  const handleSettingUpdate = (data: FieldValues) => {
    console.log(data);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return <BackIcon onPress={handleBackPress} />;
      },
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.screen}>
      {error ? (
        <Text>{error.toString()}</Text>
      ) : isLoading ? (
        <Text>Loading</Text>
      ) : (
        <Settings onSubmit={handleSettingSubmit} onError={handleSettingError} onUpdate={handleSettingUpdate} settingData={settingsData} />
      )}
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    padding: 25,
  },
});
