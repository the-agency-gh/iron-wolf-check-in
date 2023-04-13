import { FC, useRef, useState } from "react";
import { View, Text, StyleSheet, GestureResponderEvent, Dimensions } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Svg, Path } from "react-native-svg";
import { colors } from "../../../styles/variables";
import RotateButton from "./buttons/RotateButton";

interface SignatureBoxProps {
  resetSignature: () => void;
  enableScroll: (touchState: "started" | "ended") => void;
  addSignature: (section: "initial" | "applicant" | "guardian", signatureString: string) => void;
}

const SignatureBox: FC<SignatureBoxProps> = ({ addSignature, resetSignature, enableScroll }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef<View>(null);
  const [paths, setPaths] = useState<{ single: string[]; multiple: string[] }>({ single: [], multiple: [] });

  //-----touch handle functions
  const onTouchMove = (e: GestureResponderEvent) => {
    enableScroll("started");
    const completePath = [...paths.single];

    const {
      nativeEvent: { locationX: touchX, locationY: touchY, pageX, pageY },
    } = e;

    const newPoint = `${completePath.length === 0 ? "M" : ""}${touchX.toFixed(0)},${touchY.toFixed(0)} `;
    setPaths((prev) => ({
      ...prev,
      single: [...prev.single, newPoint],
    }));
  };
  const onTouchEnd = () => {
    enableScroll("ended");
    setPaths((prev) => ({
      ...prev,
      multiple: [...prev.multiple, prev.single.join("")],
      single: [],
    }));
  };
  const signatureReset = () => {
    setPaths((prev) => ({
      ...prev,
      single: [],
      multiple: [],
    }));
    resetSignature();
  };
  const captureSignature = async () => {
    const signature = await captureRef(canvasRef, {
      format: "png",
      quality: 1,
      result: "data-uri",
    });
  };
  return (
    <View style={SignatureBoxStyles.canvasCont} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {paths.multiple.length == 0 && paths.single.length == 0 && (
        <View style={SignatureBoxStyles.requiredTextCont}>
          <Text style={SignatureBoxStyles.requiredText}>Signature</Text>
        </View>
      )}
      <View ref={containerRef}>
        <ViewShot ref={canvasRef}>
          <Svg height="100%" width="100%">
            <Path
              d={paths.single.join("")}
              stroke={colors.white}
              fill={"transparent"}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {paths.multiple.length > 0 &&
              paths.multiple.map((path, i) => (
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
      </View>
      <View style={SignatureBoxStyles.resetContainer}>
        {paths.multiple.length > 0 && <RotateButton onPress={signatureReset} style={SignatureBoxStyles.resetBtnCont} />}
      </View>
    </View>
  );
};

export default SignatureBox;

const SignatureBoxStyles = StyleSheet.create({
  canvasCont: {
    position: "relative",
    width: "65%",
    height: "100%",
    minHeight: 100,
    maxHeight: 200,
    borderWidth: 2,
    borderColor: colors.white,
  },
  buttonsCont: {
    flex: 1,
    justifyContent: "space-between",
  },
  resetBtnCont: {
    position: "relative",
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
  resetContainer: {
    position: "absolute",
    right: 0,
    transform: [
      {
        translateX: 50,
      },
    ],
  },
});
