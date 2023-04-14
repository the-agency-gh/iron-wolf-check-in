import { FC, useState } from "react";
import { Modal, View, StyleSheet, Button } from "react-native";
import { WebView } from "react-native-webview";

import { waiverFormHtml } from "./WaiverFormHTML";
import { colors } from "../../../styles/variables";
import NextButton from "./buttons/NextButton";
import LoadingView from "../../LoadingView";

interface PdfModalProps {
  applicantName: string;
  signatures: { initial: string; applicant: string; guardian: string };
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PdfModal: FC<PdfModalProps> = ({ applicantName, signatures, visible, onConfirm, onCancel }) => {
  return (
    <Modal style={styles.modal} visible={visible} animationType="slide">
      <View style={styles.container}>
        <WebView style={styles.waiverContainer} originWhiteList={"*"} source={{ html: waiverFormHtml({ ...signatures, applicantName }) }} />
        <View style={styles.buttonContainer}>
          <NextButton text="Cancel" onPress={onCancel} style={{ backgroundColor: colors.amber3 }} />
          <NextButton text="Confirm" onPress={onConfirm} style={{ backgroundColor: colors.green }} />
        </View>
      </View>
    </Modal>
  );
};

export default PdfModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.baseBlack,
    rowGap: 20,
  },
  waiverContainer: {
    backgroundColor: colors.baseBlack,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
