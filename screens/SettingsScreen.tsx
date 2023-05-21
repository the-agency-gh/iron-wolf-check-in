import { FC, useEffect } from "react";
import { StyleSheet, SafeAreaView, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
//-------components and func
import Settings from "../components/Settings/Settings";
import { RootStackParamList } from "../App";

const SettingsScreen: FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    // useEffect(() => {
    //   const handleHardwardBackPress = () => {
    //     navigation.navigate("Home");
    //     return true;
    //   };
    //   const backHandler = BackHandler.addEventListener("hardwareBackPress", handleHardwardBackPress);
    //   return () => backHandler.remove();
    // });
    return (
        <SafeAreaView style={styles.screen}>
            <Settings />
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
