import "react-native-gesture-handler";
import { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { StyleSheet, Text, View } from "react-native";
import { initializeTable, retrieveSetting } from "./utils/database";
//Screens
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SubmissionsScreen from "./screens/SubmissionsScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [initialState, setInitialState] = useState({
    loaded: false,
    error: false,
  });
  useEffect(() => {
    (async () => {
      try {
        await initializeTable();
        console.log(await retrieveSetting(), "retrieving");
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
            <Stack.Navigator initialRouteName="Home">
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#161616",
  },
  errorText: {
    color: "#f8f8f8",
  },
});
