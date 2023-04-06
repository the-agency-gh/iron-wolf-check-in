import { FC, useEffect } from "react";
import { ScrollView, View, Button, Text, StyleSheet, Dimensions, LayoutChangeEvent, GestureResponderEvent } from "react-native";
import { WebView } from "react-native-webview";

import { colors } from "../../styles/variables";
import WaiverTexts from "./parts/WaiverTexts";
import SignatureBox from "./parts/SignatureBox";
interface WaiverFormProps {
  name?: string;
  changePage: (dir: "left" | "right", page: number) => void;
  page: number;
}

const WaiverForm: FC<WaiverFormProps> = ({ name = "Placeholder", changePage, page }) => {
  const updateBoxInfo = (e: LayoutChangeEvent) => {
    console.log(e.nativeEvent.layout);
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.defaultFonts, styles.clientName]}>
        Name: <Text style={{ fontWeight: "bold" }}>{name}</Text>
      </Text>
      <WaiverTexts />
      <SignatureBox />
    </View>
  );
};

export default WaiverForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    padding: 15,
    justifyContent: "space-between",
    rowGap: 15,
  },
  defaultFonts: {
    color: colors.white,
    fontSize: 20,
  },
  clientName: {},
});
