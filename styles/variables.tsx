import { Platform } from "react-native";

export const colors = {
  darkBlack: "#080808",
  baseBlack: "#161616",
  white: "#f8f8f8",
  lightBlue: "#9fc3e0",
  darkBlue: "#4178a5",
  amber: "#d30910",
  amber2: "#c4191f",
  yellow: "#c4b319",
};

export const shadow = {
  elevation: 4,
  shadowColor: "black",
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
  shadowOpacity: 0.5,
  // overflow: Platform.OS === "android" ? "hidden" : "visible",
};
