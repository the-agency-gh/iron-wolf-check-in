import { FC, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, GestureResponderEvent, Dimensions, StyleProp } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Svg, Path } from "react-native-svg";
import { colors } from "../../../styles/variables";
import RotateButton from "./buttons/RotateButton";

interface SignatureBoxProps {
  forId: "initial" | "applicant" | "guardian";
  style?: StyleProp<any>;
  placeholder?: string;
  signatureStat: boolean;
  resetSignature: (section: "initial" | "applicant" | "guardian" | "all") => void;
  enableScroll: (touchState: "started" | "ended") => void;
  addSignature: (section: "initial" | "applicant" | "guardian", signatureString: string) => void;
}

const SignatureBox: FC<SignatureBoxProps> = ({
  forId,
  style,
  placeholder = "placeholder",
  signatureStat,
  addSignature,
  resetSignature,
  enableScroll,
}) => {
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
    captureSignature();
  };
  const signatureReset = () => {
    setPaths((prev) => ({
      ...prev,
      single: [],
      multiple: [],
    }));
    resetSignature(forId);
  };
  const captureSignature = async () => {
    const signature = await captureRef(canvasRef, {
      format: "png",
      quality: 1,
      result: "data-uri",
    });
    addSignature(forId, signature);
  };
  useEffect(() => {
    !signatureStat && signatureReset();
  }, [signatureStat]);
  return (
    <View style={[SignatureBoxStyles.container, style]}>
      <View style={SignatureBoxStyles.canvasCont} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {((paths.multiple.length == 0 && paths.single.length == 0) || !placeholder) && (
          <View style={SignatureBoxStyles.requiredTextCont}>
            <Text style={SignatureBoxStyles.requiredText}>{placeholder}</Text>
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
      </View>
      <View style={SignatureBoxStyles.resetContainer}>
        {paths.multiple.length > 0 && <RotateButton onPress={signatureReset} style={SignatureBoxStyles.resetBtnCont} />}
      </View>
    </View>
  );
};

export default SignatureBox;

const SignatureBoxStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    columnGap: 25,
    width: "65%",
    height: 150,
  },
  canvasCont: {
    flex: 1,
    position: "relative",
    height: "100%",
    borderWidth: 2,
    borderColor: colors.white,
    overflow: "hidden",
  },
  buttonsCont: {
    flex: 1,
    justifyContent: "space-between",
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
    fontSize: 45,
    textTransform: "uppercase",
    color: colors.white,
  },
  resetContainer: {
    width: 40,
    height: 40,
    aspectRatio: "1/1",
  },
  resetBtnCont: {
    width: "100%",
    height: "100%",
    padding: 5,
    marginRight: 0,
  },
});
