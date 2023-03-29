import { FC } from "react";
import { StyleSheet, SafeAreaView, Text, ScrollView } from "react-native";
import { useQuery } from "react-query";

import { retrieveSetting } from "../utils/database";
import Settings, { settingDataProp } from "../components/Settings/Settings";
import LoadingView from "../components/LoadingView";

const SettingsScreen: FC = () => {
  const { isLoading, error, data } = useQuery("settingData", () => retrieveSetting());
  return (
    <SafeAreaView style={styles.screen}>
      {error ? <Text>{error.toString()}</Text> : isLoading ? <LoadingView /> : <Settings settingData={data as settingDataProp} />}
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
