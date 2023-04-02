import "react-native-gesture-handler";
import { useEffect, useState, useCallback, FC } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
//custom funcs or vars
import { initializeTable, retrieveSetting } from "./utils/database";
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
  //initializer
  const [initialState, setInitialState] = useState({
    loaded: false,
    settingInitialized: false,
    error: false,
  });
  useEffect(() => {
    (async () => {
      try {
        await initializeTable();
        const initSetting = await retrieveSetting();
        setInitialState((curr) => ({
          ...curr,
          loaded: true,
          settingInitialized: !!initSetting,
        }));
      } catch (err) {
        console.error(err);
        setInitialState((curr) => ({
          ...curr,
          loaded: true,
          settingInitialized: false,
          error: true,
        }));
      }
    })();
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
          {!initialState.error ? (
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={initialState.settingInitialized ? "Home" : "Settings"}
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
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    title: "Waiver Form",
                  }}
                />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Submissions" component={SubmissionsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed To Initialize</Text>
            </View>
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
