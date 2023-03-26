import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { colors } from "../styles/variables";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect } from "react";
import SettingsIcon from "../components/navigation/SettingsIcon";

interface HomeProps extends StackScreenProps<any> {}

const HomeScreen: FC<HomeProps> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <SettingsIcon onPress={() => {}} />;
      },
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>where is this home screen? HomeScreen</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  text: {
    color: colors.white,
  },
});
