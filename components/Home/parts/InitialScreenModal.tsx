import { FC } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../styles/variables";
import RippleEffect from "../RippleEffect";
import logo from "./Logo";

interface InitialScreenModalProps {
  visible: boolean;
  closeModal: () => void;
}

const InitialScreenModal: FC<InitialScreenModalProps> = ({
  visible,
  closeModal,
}) => {
  return (
    <Modal style={styles.screen} animationType="slide" visible={visible}>
      <View style={[styles.container]}>
        <Text
          style={[styles.Text, { fontSize: 42, marginBottom: 10 }]}
          onPress={closeModal}
        >
          GUEST SIGN IN
        </Text>
        <Pressable onPress={closeModal}>
          <View style={styles.logoImage}>
            <Image
              style={styles.image}
              source={{ uri: logo }}
              resizeMode="cover"
            />
            <RippleEffect
              rippleCount={4}
              color={colors.white}
              looped={true}
              duration={2000}
            />
          </View>
        </Pressable>
        <Text style={[styles.Text]} onPress={closeModal}>
          TAP TO START
        </Text>
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
    rowGap: 15,
  },
  logoImage: {
    zIndex: 1,
    position: "relative",
    width: "45%",
    aspectRatio: 1 / 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    transform: [{ scale: 1.15 }],
  },
  Text: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "bold",
  },
});
