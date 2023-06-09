import "react-native-gesture-handler";
import { useKeepAwake } from "expo-keep-awake";
import { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//custom funcs or vars
import { initializeTable } from "./utils/database";
import { colors } from "./styles/variables";
//Screens
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SubmissionsScreen from "./screens/SubmissionsScreen";

SplashScreen.preventAutoHideAsync();
export type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
    Submissions: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
    useKeepAwake();
    //initializer
    const [initialState, setInitialState] = useState({
        loaded: false,
        error: false,
        isConnected: true,
    });
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setInitialState((curr) => ({
                ...curr,
                isConnected: !!state.isConnected,
            }));
        });
        (async () => {
            try {
                await initializeTable();
                setInitialState((curr) => ({
                    ...curr,
                    loaded: true,
                }));
            } catch (err) {
                console.error(err);
                setInitialState((curr) => ({
                    ...curr,
                    loaded: true,
                    error: true,
                }));
            }
        })();
        return () => {
            unsubscribe();
        };
    }, []);
    const onLayoutRootView = useCallback(async () => {
        if (initialState.loaded) {
            await SplashScreen.hideAsync();
        }
    }, [initialState.loaded]);
    if (!initialState.loaded) return null;
    return (
        <>
            <StatusBar style="light" />
            <QueryClientProvider client={queryClient}>
                <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
                    {initialState.error || !initialState.isConnected ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                {initialState.error ? "Failed To Initialize Database" : "Failed to Connect to The Internet"}
                            </Text>
                        </View>
                    ) : (
                        <NavigationContainer>
                            <Stack.Navigator
                                initialRouteName="Home"
                                screenOptions={{
                                    headerStyle: {
                                        backgroundColor: colors.baseBlack,
                                        height: 85,
                                    },
                                    presentation: "modal",
                                    headerTintColor: colors.white,
                                    headerTitleAlign: "center",
                                    headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
                                    cardStyle: {
                                        backgroundColor: colors.baseBlack,
                                    },
                                }}
                            >
                                <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitleAlign: "center" }} />
                                <Stack.Screen name="Settings" component={SettingsScreen} />
                                <Stack.Screen name="Submissions" component={SubmissionsScreen} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    )}
                </SafeAreaView>
            </QueryClientProvider>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.baseBlack,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "#f8f8f8",
        fontSize: 20,
    },
});
