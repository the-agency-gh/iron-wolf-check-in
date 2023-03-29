import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect } from "react";
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from "react-native";

import { RootStackParamList } from "../App";
import BackIcon from "../components/navigation/BackIcon";

const SubmissionsScreen: FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return <BackIcon onPress={() => navigation.goBack()} />;
      },
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.screen}>
      <Text>SubmissionsScreen</Text>
    </SafeAreaView>
  );
};

export default SubmissionsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
