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
  const formInitialized = !!formState.firstName && !!formState.lastName && !!formState.email;
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
          <View style={styles.initialContainer}>
            <Text style={[styles.defaultFonts, { fontWeight: "bold" }]}>Initial:</Text>
          </View>
          <SignatureBox
            resetSignature={resetSignature}
            formInitialized={formInitialized}
            placeholder="Signature"
            enableScroll={handleEnableScroll}
            addSignature={handleAddSignature}
          />
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
  initialContainer: {
    marginVertical: 15,
  },
  defaultFonts: {
    color: colors.white,
    fontSize: 18,
  },
});
