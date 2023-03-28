import { StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect, useMemo } from "react";
import { StyleSheet, SafeAreaView, Text, Alert } from "react-native";
import { useQuery } from "react-query";

import { retrieveSetting } from "../utils/database";

import BackIcon from "../components/navigation/BackIcon";
import Settings from "../components/Settings/Settings";
import LoadingView from "../components/LoadingView";
interface SettingsProps extends StackScreenProps<any> {}
const SettingsScreen: FC<SettingsProps> = ({ navigation }) => {
  const { isLoading, error, data } = useQuery("settingData", () => retrieveSetting());
  const settingsData = useMemo(() => data, [data]);
  const handleBackPress = () => {
    if (isLoading) return;
    if (!settingsData) {
      Alert.alert("Default Setting Required", "Please enter in your initial setting");
    } else {
      navigation.navigate("Home");
    }
  };
  const handleSubmissionRedirect = () => {
    navigation.navigate("Submissions");
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
        <LoadingView />
      ) : (
        <Settings settingData={settingsData} submissionRedirect={handleSubmissionRedirect} />
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
