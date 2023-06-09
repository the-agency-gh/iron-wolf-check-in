import { FC, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, GestureResponderEvent, Dimensions } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Svg, Path } from "react-native-svg";
import { colors } from "../../../styles/variables";
import RotateButton from "./buttons/RotateButton";

interface SignatureBoxProps {
    resetSignature: () => void;
    enableScroll: (touchState: "started" | "ended") => void;
}
type measurement = {
    width: number;
    height: number;
    x: number;
    y: number;
};
const SignatureBox: FC<SignatureBoxProps> = ({ resetSignature, enableScroll }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef<View>(null);
    const [boxBound, setBoxBound] = useState<measurement | null>(null);
    const [paths, setPaths] = useState<{ single: string[]; multiple: string[] }>({ single: [], multiple: [] });
    useEffect(() => {
        setTimeout(() => {
            containerRef.current?.measure((fx, fy, width, height, px, py) => {
                const pageX = px - Dimensions.get("window").width;
                setBoxBound((prev) => ({
                    ...prev,
                    width,
                    height,
                    x: pageX < 0 ? 15 : pageX,
                    y: py,
                }));
            });
        });
    }, []);
    //-----touch handle functions
    const onTouchMove = (e: GestureResponderEvent) => {
        enableScroll("started");
        const completePath = [...paths.single];

        const {
            nativeEvent: { locationX: touchX, locationY: touchY, pageX, pageY },
        } = e;
        if (boxBound) {
            console.log(
                pageY,
                boxBound.y,
                pageX < boxBound.x + 1,
                pageX > boxBound.x + boxBound.width - 1,
                pageY < boxBound.y + 1,
                pageY > boxBound.y + boxBound.height - 1
            );
        }

        // if (
        //   boxBound &&
        //   (pageX < boxBound.x + 1 ||
        //     pageX > boxBound.x + boxBound.width - 1 ||
        //     pageY < boxBound.y + 1 ||
        //     pageY > boxBound.y + boxBound.height - 1)
        // ) {
        //   if (paths.single.length > 0) {
        //     onTouchEnd();
        //   }
        //   return;
        // }

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
