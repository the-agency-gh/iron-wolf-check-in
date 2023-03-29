import { FC, useMemo } from "react";
import { StyleSheet, SafeAreaView, Text, Alert, ScrollView } from "react-native";
import { useQuery } from "react-query";

import { retrieveSetting } from "../utils/database";
import Settings from "../components/Settings/Settings";
import LoadingView from "../components/LoadingView";

const SettingsScreen: FC = () => {
  const { isLoading, error, data } = useQuery("settingData", () => retrieveSetting());

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.container}>
        {error ? <Text>{error.toString()}</Text> : isLoading ? <LoadingView /> : <Settings settingData={data} />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 25,
  },
});
