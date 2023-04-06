import { FC, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, GestureResponderEvent, LayoutChangeEvent, Alert } from "react-native";
import { Svg, Path } from "react-native-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import { colors } from "../../../styles/variables";
import NextButton from "./buttons/NextButton";
import RotateButton from "./buttons/RotateButton";

interface SignatureBoxProps {}

const SignatureBox: FC<SignatureBoxProps> = () => {
  const canvasRef = useRef(null);
  const [path, setPath] = useState<string[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const updateBoxInfo = (e: LayoutChangeEvent) => {
    console.log(e.nativeEvent);
  };
  const onTouchMove = (e: GestureResponderEvent) => {
    const completePath = [...path];

    const touchX = e.nativeEvent.locationX,
      touchY = e.nativeEvent.locationY;

    const newPoint = `${completePath.length === 0 ? "M" : ""}${touchX.toFixed(0)},${touchY.toFixed(0)} `;
    setPath((curr) => [...curr, newPoint]);
  };
  const onTouchEnd = () => {
    setPaths((curr) => [...curr, path.join("")]);
    setPath([]);
  };
  const resetSignature = () => {
    setPath([]);
    setPaths([]);
  };
  const handleVerify = async () => {
    if (paths.length === 0) {
      Alert.alert("Signiture is Required", "");
      return;
    }
    const signature = await captureRef(canvasRef, {
      format: "png",
      quality: 1,
      result: "data-uri",
    });
    console.log(signature);
  };
  return (
    <View onLayout={updateBoxInfo} style={styles.container}>
      <View onLayout={updateBoxInfo} style={styles.canvasCont} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <ViewShot ref={canvasRef}>
          <Svg height="100%" width="100%">
            <Path
              d={path.join("")}
              stroke={colors.white}
              fill={"transparent"}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {paths.length > 0 &&
              paths.map((path, i) => (
                <Path
                  key={`path-${i}`}
                  d={path}
                  stroke={colors.white}
                  fill={"transparent"}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
          </Svg>
        </ViewShot>
        {paths.length == 0 && path.length == 0 && (
          <View style={styles.requiredTextCont}>
            <Text style={styles.requiredText}>Signature</Text>
          </View>
        )}
        {paths.length > 0 && <RotateButton onPress={resetSignature} style={styles.resetBtnCont} />}
      </View>
      <View style={styles.buttonsCont}>
        <NextButton
          onPress={handleVerify}
          text="Confirm"
          style={{ width: "100%", backgroundColor: colors.lightBlue }}
          textStyle={{ color: colors.darkBlack }}
        />
      </View>
    </View>
  );
};

export default SignatureBox;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    minHeight: 100,
    maxHeight: 200,
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 25,
  },
  canvasCont: {
    width: "65%",
    height: "100%",
    borderWidth: 1,
    borderColor: colors.white,
  },
  buttonsCont: {
    flex: 1,
    justifyContent: "flex-start",
  },
  resetBtnCont: {
    zIndex: 1,
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    aspectRatio: "1/1",
    padding: 5,
    marginRight: 0,
  },
  requiredTextCont: {
    zIndex: -1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  requiredText: {
    textAlign: "center",
    fontSize: 60,
    textTransform: "uppercase",
    color: colors.white,
  },
});
