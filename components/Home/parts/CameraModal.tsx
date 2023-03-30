import { FC, useState } from "react";
import { Modal, Text, StyleSheet, View, Pressable } from "react-native";
import { Camera, CameraType } from "expo-camera";
//------components, etc
import { colors, shadow } from "../../../styles/variables";
import CloseButton from "./CloseButton";

interface CameraModalProps {
  forId: "profile" | "photoId";
  closeModal: (selected: "profile" | "photoId", open: boolean) => void;
}

const CameraModal: FC<CameraModalProps> = ({ closeModal, forId }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  if (!permission) {
    return (
      <Modal style={styles.screen} animationType="fade">
        <View style={styles.container} />
      </Modal>
    );
  }
  if (!permission.granted) {
    return (
      <Modal style={styles.screen} animationType="fade">
        <View style={[styles.container, styles.permissionScreen]}>
          <Text style={[styles.permissionText]}>We need permission to use camera</Text>
          <View style={styles.permissionBtnCont}>
            <Pressable
              style={[styles.permissionButton, shadow, { backgroundColor: colors.darkBlue }]}
              onPress={requestPermission}
              android_ripple={{ color: colors.baseBlack }}
            >
              <Text style={styles.permissionBtnTxt}>Grant Permission</Text>
            </Pressable>
            <Pressable
              style={[styles.permissionButton, shadow, { backgroundColor: colors.amber2 }]}
              onPress={() => closeModal(forId, false)}
              android_ripple={{ color: colors.baseBlack }}
            >
              <Text style={styles.permissionBtnTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }
  return (
    <Modal style={styles.screen} animationType="fade">
      <View style={styles.container}>
        <Camera style={styles.camera} type={type}>
          <CloseButton style={styles.closeButton} onPress={() => closeModal(forId, false)} />
        </Camera>
      </View>
    </Modal>
  );
};

export default CameraModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.baseBlack,
  },
  permissionScreen: {
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    rowGap: 25,
  },
  permissionText: {
    color: colors.white,
    fontSize: 25,
  },
  permissionBtnCont: {
    flexDirection: "row",
    width: "75%",
    columnGap: 25,
  },
  permissionButton: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: colors.white,
    borderRadius: 10,
    flex: 1,
  },
  permissionBtnTxt: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  camera: {
    flex: 1,
  },
  cameraContent: {
    flex: 1,
  },
  closeButton: {},
});
