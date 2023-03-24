import "react-native-gesture-handler";
import { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { StyleSheet, Text, View } from "react-native";
import { initializeTable } from "./utils/database";
//Screens
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SubmissionsScreen from "./screens/SubmissionsScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [appLoaded, setAppLoaded] = useState(false);
  useEffect(() => {
    setAppLoaded(true);
    (async () => {
      try {
        await initializeTable();
        setAppLoaded(true);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appLoaded]);
  if (!appLoaded) return null;
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Submissions" component={SubmissionsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
});
