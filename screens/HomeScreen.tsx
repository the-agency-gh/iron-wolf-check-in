import { StyleSheet, SafeAreaView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FC, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
//----------func
import { RootStackParamList } from "../App";
import { SettingsProps, retrieveSetting } from "../utils/database";
import { useGlobalStore } from "../utils/formContex";
//----------components
import SettingsIcon from "../components/navigation/SettingsIcon";
import CompleteForm from "../components/Home/CompleteForm";

const HomeScreen: FC = () => {
  const updateSettingState = useGlobalStore((state) => state.updateSettingState);
  useQuery({
    queryKey: ["settingData"],
    queryFn: async () => {
      const data = await retrieveSetting();
      return {
        data,
      };
    },
    onSuccess: (res: { data: SettingsProps | undefined }) => {
      if (res.data) {
        updateSettingState(res.data as SettingsProps);
      } else {
        navigation.navigate("Settings");
      }
    },
  });
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerRight: () => {
        return (
          <SettingsIcon
            onPress={() => {
              navigation.navigate("Settings");
            }}
          />
        );
      },
      headerLeft: () => null,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <CompleteForm />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
