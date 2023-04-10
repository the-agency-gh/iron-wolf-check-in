import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FC, useLayoutEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
//-------components and func
import { RootStackParamList } from "../App";
import BackIcon from "../components/navigation/BackIcon";
import SubmissionsList from "../components/Submissions/SubmissionsList";

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
      <SubmissionsList />
    </SafeAreaView>
  );
};

export default SubmissionsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
