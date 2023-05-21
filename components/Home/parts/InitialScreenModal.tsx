import { FC } from "react";
import { Modal, Pressable, View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../../../styles/variables";
import logo from "./Logo";
import RippleEffect from "../RippleEffect";

interface InitialScreenModalProps {
    visible: boolean;
    closeModal: () => void;
}

const InitialScreenModal: FC<InitialScreenModalProps> = ({ visible, closeModal }) => {
    return (
        <Modal style={styles.screen} animationType="slide" visible={visible}>
            <View style={[styles.container]}>
                <Pressable onPress={closeModal}>
                    <View style={styles.logoImage}>
                        <Image style={{ flex: 1, width: "100%", height: "100%" }} source={{ uri: logo }} resizeMode="cover" />
                        <RippleEffect rippleCount={5} color={colors.white} looped={true} duration={1000} />
                    </View>
                </Pressable>
                <Text style={[styles.Text]}>Tap To Start</Text>
            </View>
        </Modal>
    );
};

export default InitialScreenModal;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.baseBlack,
    },
    container: {
        flex: 1,
        backgroundColor: colors.baseBlack,
        justifyContent: "center",
        alignItems: "center",
    },
    logoImage: {
        zIndex: 1,
        position: "relative",
        width: "25%",
        aspectRatio: 1 / 1,
        alignItems: "center",
        justifyContent: "center",
    },
    Text: {
        color: colors.white,
        fontSize: 25,
    },
});
