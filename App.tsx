import "react-native-gesture-handler";
import { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { StyleSheet, Text, View } from "react-native";
import { initializeTable, retrieveSetting } from "./utils/database";
import { colors } from "./styles/variables";
//Screens
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SubmissionsScreen from "./screens/SubmissionsScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
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
      <View style={styles.container} onLayout={onLayoutRootView}>
        {!initialState.error ? (
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                cardStyle: {
                  backgroundColor: colors.baseBlack,
                },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Submissions" component={SubmissionsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <Text style={styles.errorText}>Failed To Initialize</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baseBlack,
  },
  errorText: {
    color: "#f8f8f8",
  },
});
