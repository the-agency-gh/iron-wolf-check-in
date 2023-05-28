import { Camera, CameraPictureOptions, CameraType } from "expo-camera";
import { deleteAsync } from "expo-file-system";
import { FC, useRef, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
//------components, etc
import PersonOutline from "../../../assets/icons/person-outline.svg";
import { colors, shadow } from "../../../styles/variables";
import { resizeImage } from "../../../utils/imageProcesser";
import LoadingView from "../../LoadingView";
import CloseButton from "./buttons/CloseButton";
import RotateButton from "./buttons/RotateButton";
import ShootButton from "./buttons/ShootButton";

interface CameraModalProps {
    forId: "profile" | "photoId" | "guardianId";
    closeModal: (selected: "profile" | "photoId" | "guardianId", open: boolean) => void;
    handleCameraInput: (forId: "profile" | "photoId" | "guardianId", photoUri: string, imageBase64: string) => void;
}

const CameraModal: FC<CameraModalProps> = ({ forId, closeModal, handleCameraInput }) => {
    const camera = useRef<Camera>(null);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraState, setCameraState] = useState<{
        ready: boolean;
        loading: boolean;
        imageUri: string | undefined;
        imageBase64: string | undefined;
        type: CameraType;
    }>({
        ready: false,
        loading: false,
        imageUri: undefined,
        imageBase64: undefined,
        type: CameraType.front,
    });

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
        if (!cameraState.ready || !camera.current) return;
        setCameraState((curr) => ({ ...curr, loading: true }));
        const camOptions: CameraPictureOptions = {
            base64: true,
            exif: false,
            quality: 0.3,
        };
        const photo = await camera.current.takePictureAsync(camOptions);
        //const photo = await resizeImage(defaultPhoto.uri);
        setCameraState((curr) => ({ ...curr, loading: false, imageUri: photo.uri, imageBase64: photo.base64 }));
    };
    const handleRetake = async () => {
        setCameraState((curr) => ({
            ...curr,
            loading: true,
        }));
        try {
            await deleteAsync(cameraState.imageUri as string);
        } catch (err) {
            console.error(err);
        }
        setCameraState((curr) => ({
            ...curr,
            loading: false,
            imageUri: undefined,
            imageBase64: undefined,
        }));
    };
    const handleConfirm = () => {
        if (!cameraState.imageUri) return;
        handleCameraInput(forId, cameraState.imageUri as string, cameraState.imageBase64 as string);
        setCameraState((curr) => ({
            ...curr,
            imageUri: undefined,
        }));
        closeModal(forId, false);
    };
    return (
        <Modal style={styles.screen} animationType="fade">
            <View style={styles.container}>
                <CloseButton style={styles.closeButton} onPress={() => closeModal(forId, false)} />
                <View style={styles.camera}>
                    <Camera
                        ref={camera}
                        style={styles.camera}
                        type={cameraState.type}
                        onCameraReady={() => {
                            setCameraState((curr) => ({ ...curr, ready: true }));
                        }}
                    >
                        <View style={styles.cameraIndicatorCont}>
                            {forId === "profile" ? <PersonOutline /> : <View style={styles.cardShape}></View>}
                        </View>
                    </Camera>
                    {cameraState.loading && <LoadingView style={styles.previewCont} />}
                    {cameraState.imageUri && (
                        <View style={[styles.camera, styles.previewCont]}>
                            <Image style={{ flex: 1 }} source={{ uri: cameraState.imageUri }} resizeMode="cover" />
                        </View>
                    )}
                </View>

                <View style={styles.controls}>
                    {!cameraState.imageUri ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Pressable style={styles.selectionBtn} onPress={handleRetake}>
                                <Text style={[styles.permissionText, { fontWeight: "bold", color: colors.amber }]}>RETAKE</Text>
                            </Pressable>
                            <Pressable style={styles.selectionBtn} onPress={handleConfirm}>
                                <Text style={[styles.permissionText, { fontWeight: "bold", color: colors.lightBlue }]}>CONFIRM</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default CameraModal;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.baseBlack,
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
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    previewCont: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    cameraIndicatorCont: {
        flex: 1,
        width: "100%",
        opacity: 0.4,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
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
    selectionBtn: {
        padding: 10,
    },
    controls: {
        position: "relative",
        height: "14%",
        padding: 25,
        backgroundColor: colors.darkBlack,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 50,
    },
});
