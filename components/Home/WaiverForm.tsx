import { FC, useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions, LayoutChangeEvent, GestureResponderEvent, Alert } from "react-native";
import { Svg, Path } from "react-native-svg";
import ViewShot, { captureRef } from "react-native-view-shot";

import { colors } from "../../styles/variables";
import WaiverTexts from "./parts/WaiverTexts";
import NextButton from "./parts/buttons/NextButton";
import RotateButton from "./parts/buttons/RotateButton";
interface WaiverFormProps {
  clientName?: string;
  changePage: (toPage: 0 | 1) => void;
}
type measurement = {
  width: number;
  height: number;
  x: number;
  y: number;
};
const WaiverForm: FC<WaiverFormProps> = ({ clientName = "Placeholder", changePage }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef<View>(null);
  const [boxBound, setBoxBound] = useState<measurement | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      containerRef.current?.measure((fx, fy, width, height, px, py) => {
        setBoxBound((curr) => ({
          ...curr,
          width,
          height,
          x: px - Dimensions.get("window").width,
          y: py,
        }));
      });
    });
  }, []);

  const onTouchMove = (e: GestureResponderEvent) => {
    const completePath = [...path];
    const touchX = e.nativeEvent.locationX,
      touchY = e.nativeEvent.locationY,
      pageX = e.nativeEvent.pageX,
      pageY = e.nativeEvent.pageY;
    if (
      boxBound &&
      (pageX < boxBound.x + 1 ||
        pageX > boxBound.x + boxBound.width - 1 ||
        pageY < boxBound.y + 1 ||
        pageY > boxBound.y + boxBound.height - 1)
    ) {
      if (path.length > 0) {
        onTouchEnd();
      }
      return;
    }

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
  const handleBackPress = () => {
    resetSignature();
    changePage(0);
  };
  return (
    <View style={styles.container}>
      <WaiverTexts clientName={clientName} handleBack={handleBackPress} />
      <View style={SignatureBoxStyles.container}>
        <View style={SignatureBoxStyles.canvasCont} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          {paths.length == 0 && path.length == 0 && (
            <View style={SignatureBoxStyles.requiredTextCont}>
              <Text style={SignatureBoxStyles.requiredText}>Signature</Text>
            </View>
          )}
          <View ref={containerRef}>
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
          </View>
        </View>
        <View style={SignatureBoxStyles.buttonsCont}>
          <View>{paths.length > 0 && <RotateButton onPress={resetSignature} style={SignatureBoxStyles.resetBtnCont} />}</View>
          <NextButton
            onPress={handleVerify}
            text="Confirm"
            style={{ width: "100%", backgroundColor: colors.lightBlue }}
            textStyle={{ color: colors.darkBlack }}
          />
        </View>
      </View>
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
