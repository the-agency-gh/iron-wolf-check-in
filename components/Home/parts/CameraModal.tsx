import { FC, useRef, useState } from "react";
import { Modal, Text, StyleSheet, View, Pressable } from "react-native";
import { Camera, CameraType } from "expo-camera";
//------components, etc
import { colors, shadow } from "../../../styles/variables";
import CloseButton from "./buttons/CloseButton";
import PersonOutline from "../../../assets/icons/person-outline.svg";
import ShootButton from "./buttons/ShootButton";
import RotateButton from "./buttons/RotateButton";

interface CameraModalProps {
  forId: "profile" | "photoId";
  closeModal: (selected: "profile" | "photoId", open: boolean) => void;
}

const CameraModal: FC<CameraModalProps> = ({ closeModal, forId }) => {
  const camera = useRef<Camera>(null);
  const [cameraState, setCameraState] = useState<{ ready: boolean; type: CameraType; imageUri: string | undefined }>({
    ready: false,
    type: CameraType.front,
    imageUri: undefined,
  });
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
  const handlePhotoShoot = async () => {
    console.log("hi?avs", cameraState.ready);
    if (!cameraState.ready) return;
    const camOptions = {};
    const photo = await camera.current?.takePictureAsync();
    console.log(photo);
  };
  console.log(cameraState);
  return (
    <Modal style={styles.screen} animationType="fade">
      <View style={styles.container}>
        <CloseButton style={styles.closeButton} onPress={() => closeModal(forId, false)} />
        <Camera
          ref={camera}
          style={styles.camera}
          type={cameraState.type}
          onCameraReady={() => {
            setCameraState((curr) => ({ ...curr, ready: true }));
          }}
        >
          <View style={styles.cameraIndicatorCont}>{forId === "profile" ? <PersonOutline /> : <View style={styles.cardShape}></View>}</View>
        </Camera>
        <View style={styles.controls}>
          <ShootButton onPress={handlePhotoShoot} />
          <RotateButton
            onPress={() => {
              if (!cameraState.ready) return;
              setCameraState((curr) => ({
                ...curr,
                type: curr.type === CameraType.front ? CameraType.back : CameraType.front,
              }));
            }}
          />
        </View>
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
    backgroundColor: "colors.baseBlack",
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
  cameraIndicatorCont: {
    flex: 1,
    width: "100%",
    opacity: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  cardShape: {
    width: "70%",
    aspectRatio: "3625/2375",
    borderWidth: 5,
    borderColor: colors.white,
    borderRadius: 25,
  },
  closeButton: {
    zIndex: 1,
    position: "absolute",
    top: 15,
    right: 10,
  },
  controls: {
    position: "relative",
    height: "14%",
    padding: 25,
    backgroundColor: colors.darkBlack,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
