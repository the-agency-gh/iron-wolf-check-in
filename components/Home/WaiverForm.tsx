import { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, BackHandler } from "react-native";
import { printToFileAsync } from "expo-print";

import { colors } from "../../styles/variables";
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
type pdfStatus = {
  loading: boolean;
  submitted: boolean;
  error: boolean;
  visible: boolean;
  signatures: { initial: string; applicant: string; guardian: string };
};

const WaiverForm: FC<WaiverFormProps> = ({ changePage }) => {
  const [formState, addSubmissionsPromise, resetFormState] = useGlobalStore((state) => [
    state.formState,
    state.addSubmissionsPromise,
    state.resetFormState,
  ]);
  const applicantAge = formState.dateOfBirth && Math.floor((Date.now() - formState.dateOfBirth.getTime()) / (365 * 24 * 60 * 60 * 1000));
  const [enableScroll, setEnableScroll] = useState(true);
  const [pdfStatus, setPdfStatus] = useState<pdfStatus>({
    loading: false,
    submitted: false,
    error: false,
    visible: false,
    signatures: {
      initial: "",
      applicant: "",
      guardian: "",
    },
  });

  const handleEnableScroll = (touchState: "started" | "ended") => {
    if (touchState === "started") {
      setEnableScroll(false);
    } else {
      setEnableScroll(true);
    }
  };
  //-----reset signatures
  const resetSignature = (section: "initial" | "applicant" | "guardian" | "all") => {
    setPdfStatus((prev) => ({
      ...prev,
      visible: false,
      submitted: false,
      error: false,
      signatures: {
        initial: section === "initial" || section === "all" ? "" : prev.signatures.initial,
        applicant: section === "applicant" || section === "all" ? "" : prev.signatures.applicant,
        guardian: section === "guardian" || section === "all" ? "" : prev.signatures.guardian,
      },
    }));
  };
  const handleBackPress = () => {
    resetSignature("all");
    changePage(0);
  };
  const handleAddSignature = (section: "initial" | "applicant" | "guardian", signatureString: string) => {
    setPdfStatus((prev) => ({
      ...prev,
      signatures: {
        initial: section === "initial" ? signatureString : prev.signatures.initial,
        applicant: section === "applicant" ? signatureString : prev.signatures.applicant,
        guardian: section === "guardian" ? signatureString : prev.signatures.guardian,
      },
    }));
  };
  const handleVerify = async () => {
    if (
      !pdfStatus.signatures.initial ||
      !pdfStatus.signatures.applicant ||
      (applicantAge && applicantAge < 18 && !pdfStatus.signatures.guardian)
    ) {
      Alert.alert("Signiture is Required", "");
      return;
    }
    setPdfStatus((prev) => ({
      ...prev,
      visible: true,
    }));
  };
  const handleConfirm = async () => {
    setPdfStatus((prev) => ({ ...prev, visible: false, loading: true }));
    const signedPdf = await printToFileAsync({
      html: waiverFormHtml({ ...pdfStatus.signatures, applicantName: `${formState.firstName} ${formState.lastName}`, fontSize: 14 }),
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
  useEffect(() => {
    const handleHardwardBackPress = () => {
      handleBackPress();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleHardwardBackPress);
    return () => backHandler.remove();
  });
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
            <Text style={styles.defaultFonts}>Initial:</Text>
            <SignatureBox
              forId={"initial"}
              style={{ width: 150, height: 50, alignItems: "center" }}
              resetSignature={resetSignature}
              signatureStat={!!pdfStatus.signatures.initial}
              placeholder=""
              enableScroll={handleEnableScroll}
              addSignature={handleAddSignature}
            />
          </View>
          <View style={styles.signatureContainer}>
            <Text style={[styles.defaultFonts, styles.signatureTitle]}>Applicant Signature:</Text>
            <SignatureBox
              forId={"applicant"}
              resetSignature={resetSignature}
              signatureStat={!!pdfStatus.signatures.applicant}
              placeholder="Signature"
              enableScroll={handleEnableScroll}
              addSignature={handleAddSignature}
            />
          </View>
          {applicantAge && applicantAge < 18 ? (
            <View style={styles.signatureContainer}>
              <Text style={[styles.defaultFonts, styles.signatureTitle]}>Guardian Signature:</Text>
              <SignatureBox
                forId={"guardian"}
                resetSignature={resetSignature}
                signatureStat={!!pdfStatus.signatures.guardian}
                placeholder="Signature"
                enableScroll={handleEnableScroll}
                addSignature={handleAddSignature}
              />
            </View>
          ) : null}
          <NextButton onPress={handleVerify} text="Verify" style={styles.verifyBtn} textStyle={{ color: colors.darkBlack }} />
          <PdfModal
            applicantName={`${formState.firstName} ${formState.lastName}`}
            visible={pdfStatus.visible}
            signatures={pdfStatus.signatures}
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
    flexDirection: "row",
    columnGap: 15,
    marginVertical: 15,
  },
  signatureTitle: {
    fontSize: 20,
  },
  signatureContainer: {
    rowGap: 10,
    marginTop: 20,
  },
  defaultFonts: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
