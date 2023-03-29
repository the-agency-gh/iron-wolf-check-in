import { StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import BackIcon from "../components/navigation/BackIcon";

interface SubmissionsScreenProps extends StackScreenProps<any> {}

const SubmissionsScreen: FC<SubmissionsScreenProps> = ({ navigation }) => {
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
