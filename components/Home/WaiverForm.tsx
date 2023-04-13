import { FC, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { printAsync, printToFileAsync } from "expo-print";
import Constants from "expo-constants";

import { colors } from "../../styles/variables";
import { SubmissionProps } from "../../utils/database";
import { retrieveSetting } from "../../utils/database";
import { useGlobalStore } from "../../utils/formContex";
import WaiverTexts from "./parts/WaiverTexts";
import NextButton from "./parts/buttons/NextButton";
import PdfModal from "./parts/PdfModal";
import { waiverFormHtml } from "./parts/WaiverFormHTML";
import LoadingView from "../LoadingView";
import SignatureBox from "./parts/SignatureBox";
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
  const [formState, addSubmissionsPromise, resetFormState] = useGlobalStore((state) => [
    state.formState,
    state.addSubmissionsPromise,
    state.resetFormState,
  ]);
  const canvasRef = useRef(null);
  const [enableScroll, setEnableScroll] = useState(true);
  const [pdfStatus, setPdfStatus] = useState<{ loading: boolean; submitted: boolean; error: boolean; visible: boolean; signature: string }>(
    {
      loading: false,
      submitted: false,
      error: false,
      visible: false,
      signature: "",
    }
  );

  const handleEnableScroll = (touchState: "started" | "ended") => {
    if (touchState === "started") {
      setEnableScroll(false);
    } else {
      setEnableScroll(true);
    }
  };
  //-----reset signatures
  const resetSignature = () => {
    setPdfStatus((prev) => ({
      ...prev,
      visible: false,
      submitted: false,
      signature: "",
      error: false,
    }));
  };
  const handleBackPress = () => {
    resetSignature();
    changePage(0);
  };
  const handleAddSignature = (section: "initial" | "applicant" | "guardian", signatureString: string) => {};
  const handleVerify = async () => {
    if (pdfStatus.signature) {
      Alert.alert("Signiture is Required", "");
      return;
    }
    const signature = await captureRef(canvasRef, {
      format: "png",
      quality: 1,
      result: "data-uri",
    });
    setPdfStatus((prev) => ({
      ...prev,
      visible: true,
      signature,
    }));
  };
  const handleConfirm = async () => {
    setPdfStatus((prev) => ({ ...prev, visible: false, loading: true }));
    const signedPdf = await printToFileAsync({
      html: waiverFormHtml(pdfStatus.signature),
      base64: true,
    });
    const submissionRes = await addSubmissionsPromise(signedPdf.uri, signedPdf.base64 as string);
    resetFormState();
    setPdfStatus((prev) => ({
      ...prev,
      loading: false,
      submitted: true,
      error: (submissionRes as { data: { status: string }; [rest: string]: any }).data.status !== "successful",
    }));
  };
  return (
    <View style={styles.container}>
      {pdfStatus.loading ? (
        <LoadingView />
      ) : pdfStatus.submitted ? (
        <View style={styles.submittedContainer}>
          <Text style={[styles.submittedTitle, { color: pdfStatus.error ? colors.amber : colors.white }]}>
            {pdfStatus.error ? "Something went wrong! \nPlease Try again" : "Thank you for your submission!"}
          </Text>
          <NextButton onPress={handleBackPress} text="Continue" style={styles.continueBtn} />
        </View>
      ) : (
        <ScrollView scrollEnabled={enableScroll}>
          <WaiverTexts style={{ marginTop: 25 }} handleBack={handleBackPress} />
          <SignatureBox resetSignature={resetSignature} enableScroll={handleEnableScroll} addSignature={handleAddSignature} />
          <NextButton onPress={handleVerify} text="Verify" style={styles.verifyBtn} textStyle={{ color: colors.darkBlack }} />
          <PdfModal
            visible={pdfStatus.visible}
            signatureString={pdfStatus.signature}
            onConfirm={handleConfirm}
            onCancel={() => {
              setPdfStatus((prev) => ({ ...prev, visible: false }));
            }}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default WaiverForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    rowGap: 15,
  },
  submittedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 40,
  },
  submittedTitle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  continueBtn: {
    width: "30%",
    alignSelf: "center",
    backgroundColor: colors.lightBlue,
  },
  verifyBtn: {
    width: "100%",
    backgroundColor: colors.lightBlue,
    marginVertical: 25,
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
