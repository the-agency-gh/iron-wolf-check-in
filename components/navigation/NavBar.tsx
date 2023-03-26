import { FC } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => {
  const { fontScale } = useWindowDimensions();
  return <View style={styles.container}></View>;
};

export default NavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 2,
    width: "100%",
  },
});
