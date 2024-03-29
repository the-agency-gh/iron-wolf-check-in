import { printToFileAsync } from "expo-print";
import { FC, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import LeftArrow from "../../assets/icons/arrow-left.svg";
import { colors } from "../../styles/variables";
import { useGlobalStore } from "../../utils/formContex";
import LoadingView from "../LoadingView";
import SignatureBox from "./parts/SignatureBox";
import { waiverFormHtml } from "./parts/WaiverFormHTML";
import WaiverTexts from "./parts/WaiverTexts";
import NextButton from "./parts/buttons/NextButton";
interface WaiverFormProps {
  currentPage: 0 | 1;
  changePage: (toPage: 0 | 1) => void;
  resetModal: () => void;
}
type pdfStatus = {
  loading: boolean;
  submitted: boolean;
  error: boolean;
  visible: boolean;
  signatures: { applicant: string; guardian: string };
};

const WaiverForm: FC<WaiverFormProps> = ({
  currentPage,
  changePage,
  resetModal,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [formState, addSubmissionsPromise, resetFormState] = useGlobalStore(
    (state) => [
      state.formState,
      state.addSubmissionsPromise,
      state.resetFormState,
    ]
  );
  const [autoReset, setAutoReset] = useState<NodeJS.Timeout | null>(null);
  const applicantAge =
    formState.dateOfBirth &&
    Math.floor(
      (Date.now() - formState.dateOfBirth.getTime()) /
        (365 * 24 * 60 * 60 * 1000)
    );
  const [enableScroll, setEnableScroll] = useState(true);
  const [pdfStatus, setPdfStatus] = useState<pdfStatus>({
    loading: false,
    submitted: false,
    error: false,
    visible: false,
    signatures: {
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
  const resetSignature = (section: "applicant" | "guardian" | "all") => {
    setPdfStatus((prev) => ({
      ...prev,
      visible: false,
      submitted: false,
      error: false,
      signatures: {
        applicant:
          section === "applicant" || section === "all"
            ? ""
            : prev.signatures.applicant,
        guardian:
          section === "guardian" || section === "all"
            ? ""
            : prev.signatures.guardian,
      },
    }));
  };
  const handleBackPress = () => {
    !!autoReset && clearTimeout(autoReset);
    resetSignature("all");
    changePage(0);
  };
  const handleContinuePress = () => {
    handleBackPress();
    resetModal();
  };
  const handleAddSignature = (
    section: "applicant" | "guardian",
    signatureString: string
  ) => {
    setPdfStatus((prev) => ({
      ...prev,
      signatures: {
        applicant:
          section === "applicant" ? signatureString : prev.signatures.applicant,
        guardian:
          section === "guardian" ? signatureString : prev.signatures.guardian,
      },
    }));
  };
  const handleConfirm = async () => {
    if (
      !pdfStatus.signatures.applicant ||
      (applicantAge !== undefined &&
        (applicantAge === 0 || applicantAge < 18) &&
        !pdfStatus.signatures.guardian)
    ) {
      Alert.alert("Signiture is Required", "");
      return;
    }
    try {
      setPdfStatus((prev) => ({ ...prev, visible: false, loading: true }));

      const signedPdf = await printToFileAsync({
        html: waiverFormHtml({
          ...pdfStatus.signatures,
          applicantName: `${formState.firstName} ${formState.lastName}`,
          fontSize: 14,
        }),
        base64: true,
      });
      const submissionRes = await addSubmissionsPromise(
        signedPdf.uri,
        signedPdf.base64 as string
      );

      resetFormState();
      setPdfStatus((prev) => ({
        ...prev,
        loading: false,
        submitted: true,
        error:
          (submissionRes as { data: { status: string }; [rest: string]: any })
            .data.status !== "successful",
      }));

      let timeout = setTimeout(() => {
        handleBackPress();
        resetModal();
      }, 20000);
      setAutoReset(timeout);
    } catch (err) {
      console.log("err: ", JSON.stringify(err, null, 2).slice(0, 50));
      resetFormState();
    }
  };
  useEffect(() => {
    const handleHardwardBackPress = () => {
      handleBackPress();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwardBackPress
    );
    const headerRightOpt = currentPage == 1 ? { headerRight: () => null } : {};
    navigation.setOptions({
      title: currentPage === 1 ? "Waiver" : "Guest Sign In",
      headerLeft: () =>
        currentPage == 1 ? (
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <LeftArrow />
          </Pressable>
        ) : null,
      ...headerRightOpt,
    });
    return () => backHandler.remove();
  }, [currentPage]);

  return (
    <View style={styles.container}>
      {pdfStatus.loading ? (
        <LoadingView />
      ) : pdfStatus.submitted ? (
        <View style={styles.submittedContainer}>
          <Text
            style={[
              styles.submittedTitle,
              { color: pdfStatus.error ? colors.amber : colors.white },
            ]}
          >
            {pdfStatus.error
              ? "Something went wrong! \nPlease Try again"
              : "Thank you for your submission!"}
          </Text>
          <NextButton
            onPress={handleContinuePress}
            text="Continue"
            style={styles.continueBtn}
          />
        </View>
      ) : (
        <ScrollView scrollEnabled={enableScroll}>
          <WaiverTexts style={{ marginTop: 25 }} handleBack={handleBackPress} />
          <View style={styles.signatureContainer}>
            <Text style={[styles.defaultFonts, styles.signatureTitle]}>
              Applicant Signature:
            </Text>
            <SignatureBox
              forId={"applicant"}
              resetSignature={resetSignature}
              signatureStat={!!pdfStatus.signatures.applicant}
              placeholder="Signature"
              enableScroll={handleEnableScroll}
              addSignature={handleAddSignature}
            />
          </View>
          {applicantAge !== undefined &&
          (applicantAge === 0 || applicantAge < 18) ? (
            <View style={styles.signatureContainer}>
              <Text style={[styles.defaultFonts, styles.signatureTitle]}>
                Guardian Signature:
              </Text>
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
          <NextButton
            onPress={handleConfirm}
            text="Confirm"
            style={styles.verifyBtn}
            textStyle={{ color: colors.white }}
          />
          {/* <PdfModal
                        applicantName={`${formState.firstName} ${formState.lastName}`}
                        visible={pdfStatus.visible}
                        signatures={pdfStatus.signatures}
                        onConfirm={handleConfirm}
                        onCancel={() => {
                        setPdfStatus((prev) => ({ ...prev, visible: false }));
                        }}
                    /> */}
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
    borderWidth: 1,
    borderColor: colors.green,
  },
  verifyBtn: {
    width: "100%",
    marginVertical: 25,
    borderWidth: 1,
    borderColor: colors.green,
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
  backButton: {
    width: 50,
    height: 40,
    marginLeft: 15,
  },
  resetButton: {
    marginRight: 15,
  },
  resetText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "600",
  },
});
