import { FC } from "react";
import { StyleSheet, SafeAreaView, Text, ScrollView } from "react-native";
import { useQuery } from "react-query";

import { retrieveSetting, SettingProps } from "../utils/database";
import Settings from "../components/Settings/Settings";
import LoadingView from "../components/LoadingView";
import { useGlobalStore } from "../utils/formContex";

const SettingsScreen: FC = () => {
  const [settingState, updateSettingState] = useGlobalStore((state) => [state.settingState, state.updateSettingState]);
  const { isLoading, error, data } = useQuery("settingData", () => retrieveSetting(), {
    onSuccess: (data) => {
      updateSettingState({ ...settingState, ...(data as SettingProps) });
    },
  });
  return (
    <SafeAreaView style={styles.screen}>
      {error ? <Text>{error.toString()}</Text> : isLoading ? <LoadingView /> : <Settings />}
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
