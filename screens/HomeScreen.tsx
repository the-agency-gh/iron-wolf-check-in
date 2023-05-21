import { useKeepAwake } from "expo-keep-awake";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery } from "@tanstack/react-query";
import { FC, useLayoutEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
//----------func
import { RootStackParamList } from "../App";
import { SettingsProps, retrieveSetting } from "../utils/database";
import { useGlobalStore } from "../utils/formContex";
//----------components
import CompleteForm from "../components/Home/CompleteForm";

const HomeScreen: FC = () => {
    useKeepAwake();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: "left",
            headerRight: () => null,
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
