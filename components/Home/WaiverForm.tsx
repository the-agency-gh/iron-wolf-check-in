import { FC, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, GestureResponderEvent, Alert } from "react-native";
import { Svg, Path } from "react-native-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import Constants from "expo-constants";

import { colors } from "../../styles/variables";
import { SubmissionProps } from "../../utils/database";
import { retrieveSetting } from "../../utils/database";
import { useFormStore } from "../../utils/formContex";
import WaiverTexts from "./parts/WaiverTexts";
import NextButton from "./parts/buttons/NextButton";
import RotateButton from "./parts/buttons/RotateButton";
import PdfModal from "./parts/PdfModal";
interface WaiverFormProps {
  changePage: (toPage: 0 | 1) => void;
}
type measurement = {
  width: number;
  height: number;
  x: number;
  y: number;
};
const WaiverForm: FC<WaiverFormProps> = ({ changePage }) => {
  const formState = useFormStore((state) => state.formState);
  const canvasRef = useRef(null);
  const containerRef = useRef<View>(null);
  const [pdfModalStatus, setPdfModalStatus] = useState<{ visible: boolean; signature: string }>({ visible: false, signature: "" });
  const [boxBound, setBoxBound] = useState<measurement | null>(null);
  const [paths, setPaths] = useState<{ single: string[]; multiple: string[] }>({ single: [], multiple: [] });

  useEffect(() => {
    setTimeout(() => {
      containerRef.current?.measure((fx, fy, width, height, px, py) => {
        setBoxBound((prev) => ({
          ...prev,
          width,
          height,
          x: px - Dimensions.get("window").width,
          y: py,
        }));
      });
    });
  }, []);

  const onTouchMove = (e: GestureResponderEvent) => {
    const completePath = [...paths.single];
    const {
      nativeEvent: { locationX: touchX, locationY: touchY, pageX, pageY },
    } = e;
    if (
      boxBound &&
      (pageX < boxBound.x + 1 ||
        pageX > boxBound.x + boxBound.width - 1 ||
        pageY < boxBound.y + 1 ||
        pageY > boxBound.y + boxBound.height - 1)
    ) {
      if (paths.single.length > 0) {
        onTouchEnd();
      }
      return;
    }

    const newPoint = `${completePath.length === 0 ? "M" : ""}${touchX.toFixed(0)},${touchY.toFixed(0)} `;
    setPaths((prev) => ({
      ...prev,
      single: [...prev.single, newPoint],
    }));
  };
  const onTouchEnd = () => {
    setPaths((prev) => ({
      ...prev,
      multiple: [...prev.multiple, prev.single.join("")],
      single: [],
    }));
  };
  const resetSignature = () => {
    setPaths((prev) => ({
      ...prev,
      single: [],
      multiple: [],
    }));
    setPdfModalStatus((prev) => ({
      ...prev,
      visible: false,
      signature: "",
    }));
  };
  const handleVerify = async () => {
    if (paths.multiple.length === 0) {
      Alert.alert("Signiture is Required", "");
      return;
    }
    const signature = await captureRef(canvasRef, {
      format: "png",
      quality: 1,
      result: "data-uri",
    });
    setPdfModalStatus((prev) => ({
      ...prev,
      visible: true,
      signature,
    }));
  };
  const handleConfirm = async () => {};
  const handleBackPress = () => {
    resetSignature();
    changePage(0);
  };
  return (
    <View style={styles.container}>
      <WaiverTexts clientName={`${formState.firstName} ${formState.lastName}`} handleBack={handleBackPress} />
      <View style={SignatureBoxStyles.container}>
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
        </View>
        <View style={SignatureBoxStyles.buttonsCont}>
          <View>{paths.multiple.length > 0 && <RotateButton onPress={resetSignature} style={SignatureBoxStyles.resetBtnCont} />}</View>
          <NextButton
            onPress={handleVerify}
            text="Verify"
            style={{ width: "100%", backgroundColor: colors.lightBlue }}
            textStyle={{ color: colors.darkBlack }}
          />
        </View>
      </View>
      <PdfModal
        visible={pdfModalStatus.visible}
        signatureString={pdfModalStatus.signature}
        onConfirm={handleConfirm}
        onCancel={() => {
          setPdfModalStatus((prev) => ({ ...prev, visible: false }));
        }}
      />
    </View>
  );
};

export default WaiverForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    padding: 15,
    paddingTop: 25,
    paddingBottom: 25,
    justifyContent: "space-between",
    rowGap: 15,
  },
});

const SignatureBoxStyles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 100,
    maxHeight: 200,
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 25,
  },
  canvasCont: {
    position: "relative",
    width: "65%",
    height: "100%",
    borderWidth: 2,
    borderColor: colors.white,
  },
  buttonsCont: {
    flex: 1,
    justifyContent: "space-between",
  },
  resetBtnCont: {
    position: "relative",
    // top: 10,
    // right: 0,
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
