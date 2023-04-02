import { StyleSheet, SafeAreaView, View, Text, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FC, useLayoutEffect } from "react";
import SettingsIcon from "../components/navigation/SettingsIcon";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import ProfileForm from "../components/Home/ProfileForm";

const HomeScreen: FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleSettingPress = () => {
    navigation.navigate("Settings");
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerRight: () => {
        return <SettingsIcon onPress={handleSettingPress} />;
      },
      headerLeft: () => null,
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.screen}>
      <ProfileForm />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
