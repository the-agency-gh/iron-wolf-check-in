import { FC } from "react";
import { View, Text, StyleSheet, Pressable, StyleProp } from "react-native";
import { colors } from "../../../styles/variables";
import LeftArrow from "../../../assets/icons/arrow-left.svg";
interface WaiverTextsProps {
    style: StyleProp<any>;
    handleBack: () => void;
}

const WaiverTexts: FC<WaiverTextsProps> = ({ style, handleBack }) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.titleContainer}>
                <Pressable style={styles.button} onPress={handleBack}>
                    <LeftArrow />
                </Pressable>
                <Text style={[styles.titleFont, styles.bold]}>Iron Wolf Fitness ONE-TIME Daily Pass and Agreement</Text>
            </View>
            <Text style={[styles.defaultFonts, styles.bold]}>Gym Policies</Text>
            <Text style={[styles.defaultFonts, styles.bold, { marginTop: 10 }]}>1. Disclaimers.</Text>
            <Text style={styles.defaultFonts}>Iron Wolf is not responsible for any loss or damage to personal belongings.</Text>
            <Text style={styles.defaultFonts}>
                Applicant must be 18 or older to sign up. If under the age of 18, applicant must get waiver approved by parentor legal
                guardian and use of their credit and bank information.
            </Text>
            <Text style={[styles.defaultFonts, styles.bold, { marginTop: 10 }]}>
                Release and Waiver of Liability and Code of Conduct Conformity
            </Text>
            <Text style={styles.defaultFonts}>
                In consideration of being permitted to utilize the facilities, services, and programs of Iron Wolf Fitness Studio, but not
                limited to, observation or use of facilities and equipment and participation in any program, I, on behalf of myself and any
                y children, dependents, or personal representatives, hereby:
            </Text>
            <Text style={[styles.defaultFonts, { marginTop: 10 }]}>
                1. Acknowledge that | have: (a) read this release and waiver of liability; (b) had the opportunity to inspect Iron Wolf
                Fitness Studio's facilities and equipment or will immediately upon entering or participating and will inspect and carefully
                consider such premises, facilities, or programs; (c) accept the facilities, equipment, and programs as being safe and
                reasonably suited for the purposes intended and (d) voluntarily sign this release and waiver of liability.
            </Text>
            <Text style={[styles.defaultFonts, { marginTop: 10 }]}>
                2. Release Iron Wolf Fitness Studio, its directors, officers, employees, and volunteers (collectively "gym releases") from
                all liability to me for any loss or damage to property or injury or death to person, whether caused by the ordinary
                negligence of the gym's releases or any other person, and while I am in, upon or about any gym equipment therein or
                participating in any program or service affiliated with the Iron Wolf Fitness Studio.
            </Text>
            <Text style={[styles.defaultFonts, { marginTop: 10 }]}>
                3. Agree not to sue Iron Wolf Fitness Studio Releases for any loss, liability, damage, injury, or death described above and
                agree to indemnify and hold harmless the gym releases and each of them from any loss, damage or cost they may incur due to
                my presence in, upon or about gym Facilities or equipment therein or from my participation in any program or service
                affiliated with Iron Wolf Fitness Studio whether caused by the ordinary negligence of the gym's releases or by any other
                person. I assume full responsibility for the risk of such loss, liability, damage, injury, or death.
            </Text>
            <Text style={[styles.defaultFonts]}>
                I intend for this release and waiver of liability to be as broad and inclusive as is permitted by the laws of the State of
                Illinois. If any portion hereof is held invalid, I agree that the balance shall continue in full force and effect. I hereby
                state that I am joining this fitness studio of my own volition and that I have not been solicited or pressured to join in
                anyway whatsoever.
            </Text>
            <Text style={[styles.defaultFonts]}>
                In addition, I have read the attached Code of Conduct conditions and I agree to be legally obligated to conform with all
                rules of the Iron Wolf fitness.
            </Text>
        </View>
    );
};

export default WaiverTexts;
const styles = StyleSheet.create({
    container: {
        rowGap: 5,
    },
    titleContainer: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
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
