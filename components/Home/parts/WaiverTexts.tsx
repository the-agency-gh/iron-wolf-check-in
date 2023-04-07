import { FC } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../../styles/variables";
import LeftArrow from "../../../assets/icons/arrow-left.svg";
interface WaiverTextsProps {
  clientName: string;
  handleBack: () => void;
}

const WaiverTexts: FC<WaiverTextsProps> = ({ clientName, handleBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Pressable style={styles.button} onPress={handleBack}>
          <LeftArrow />
        </Pressable>
        <Text style={[styles.titleFont]}>
          Name: <Text style={{ fontWeight: "bold" }}>{clientName}</Text>
        </Text>
      </View>
      <Text style={styles.defaultFonts}>
        In consideration of being allowed to participate in any way in the program, related events and activities, and use of equipment, I
        the undersigned, acknowledge, appreciate, and agree that:
      </Text>
      <Text style={styles.defaultFonts}>
        1. The risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis
        and death.
      </Text>
      <Text style={styles.defaultFonts}>
        2. <Text style={styles.bold}>I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS</Text>, both known and unknown,
        <Text style={styles.bold}>EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASEES</Text> or others, and assume full responsibility for
        my participation.
      </Text>
      <Text style={styles.defaultFonts}>
        4. I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin,{" "}
        <Text style={styles.bold}>HEREBY RELEASE, INDEMNIFY, AND HOLD HARMLESS</Text>{" "}
        <Text style={[styles.bold, styles.underline]}>Iron Wolf Fitness</Text> its officers, officials, agents and/or employees, other
        participants, sponsors, advertisers, and, if applicable, owners and lessors of premises used to conduct the event (RELEASEES), from
        any and all claims, demands, losses, and liability arising out of or related to any{" "}
        <Text style={styles.bold}>INJURY, DISABILITY OR DEATH</Text> I may suffer, or loss or damage to person or property,{" "}
        <Text style={styles.bold}>WHETHER ARISING FROM THE NEGLIGENCE OF THE RELEASEES OR OTHERWISE</Text>, to the fullest extent permitted
        by law.
      </Text>
      <Text style={styles.defaultFonts}>
        <Text style={styles.bold}>Health Statement</Text>I will notify{" "}
        <Text style={[styles.bold, styles.underline]}>Iron Wolf Fitness</Text> ownership or employees if I suffer from any medical or health
        condition that may cause injury to myself, others, or may require emergency care during my participation.
      </Text>
      <Text style={styles.defaultFonts}>
        <Text style={styles.bold}>Media Statement</Text>
        By signing below, I hereby grant and convey to <Text style={[styles.bold, styles.underline]}>Iron Wolf Fitness</Text> all right,
        title and interest in and to record my name, image, voice, or statements including any and all photographic images and video or
        audio recordings made by <Text style={[styles.bold, styles.underline]}>Iron Wolf Fitness</Text>
      </Text>
      <Text style={[styles.defaultFonts, styles.bold]}>
        I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP
        SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.
      </Text>
    </View>
  );
};

export default WaiverTexts;
const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  titleContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 20,
    marginBottom: 15,
  },
  button: {
    position: "absolute",
    left: 0,
    width: 50,
    height: 40,
  },
  titleFont: {
    color: colors.white,
    fontSize: 22,
  },
  defaultFonts: {
    color: colors.white,
    fontSize: 18,
  },
  bold: {
    fontWeight: "bold",
  },
  underline: {
    textDecorationLine: "underline",
    textDecorationColor: colors.white,
  },
});
