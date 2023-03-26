import { Platform } from "react-native";

export const colors = {
  baseBlack: "#161616",
  white: "#f8f8f8",
  lightBlue: "#9fc3e0",
};

export const shadow = {
  backgroundColor: "#fff",
  elevation: 4,
  shadowColor: "black",
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
  shadowOpacity: 0.5,
  overflow: Platform.OS === "android" ? "hidden" : "visible",
};
