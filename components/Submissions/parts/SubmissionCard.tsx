import { shareAsync } from "expo-sharing";
import { FC } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
//---------------funcs
import { colors } from "../../../styles/variables";
import { SubmissionProps } from "../../../utils/database";
//--------------comps
import IdCardIcon from "../../../assets/icons/idCard.svg";
import PDFICon from "../../../assets/icons/pdf.svg";
import TrashCanIcon from "../../../assets/icons/trash-can.svg";

type fetchedSubmission = SubmissionProps & {
  id: number;
  submissionDate: string;
};
interface SubmissionCardProps {
  data: fetchedSubmission;
  index: number;
  handleDelete: (data: fetchedSubmission, index: number) => void;
}

const SubmissionCard: FC<SubmissionCardProps> = ({
  data,
  index,
  handleDelete,
}) => {
  const handleDataPress = async (dataType: "id" | "pdf") => {
    await shareAsync(dataType === "id" ? data.photoIdUri : data.pdfUri);
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoCont}>
        <Image
          style={styles.profileImg}
          source={{ uri: data.profileUri }}
          resizeMode="cover"
        />
        <View style={styles.infoContent}>
          <Text style={styles.label}>
            Name:{" "}
            <Text style={styles.info}>
              {data.firstName} {data.lastName}
            </Text>
          </Text>
          <Text style={styles.label}>
            Email: <Text style={styles.info}>{data.email}</Text>
          </Text>
          <Text style={styles.label}>
            Phone Number: <Text style={styles.info}>{data.phoneNumber}</Text>
          </Text>
          <Text style={styles.label}>
            Date of Birth:{" "}
            <Text style={styles.info}>{data.dateOfBirth.toString()}</Text>
          </Text>
          <Text style={styles.label}>
            Cash Payment:{" "}
            <Text style={styles.info}>{data.cash ? "True" : "False"}</Text>
          </Text>
          {!data.cash && (
            <Text style={styles.label}>
              Member Name: <Text style={styles.info}>{data.memberName}</Text>
            </Text>
          )}
          <Text style={styles.label}>
            Submitted:{" "}
            <Text style={styles.info}>
              {data.submissionDate?.split(" ")[0]}
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.buttonCont}>
        <Pressable
          style={styles.button}
          android_ripple={{ color: colors.baseBlack }}
          onPress={handleDataPress.bind(null, "id")}
        >
          <IdCardIcon />
        </Pressable>
        <Pressable
          style={styles.button}
          android_ripple={{ color: colors.baseBlack }}
          onPress={handleDataPress.bind(null, "pdf")}
        >
          <PDFICon />
        </Pressable>
        <Pressable
          style={{ width: 35, aspectRatio: "1/1" }}
          android_ripple={{ color: colors.baseBlack }}
          onPress={() => {
            handleDelete(data, index);
          }}
        >
          <TrashCanIcon />
        </Pressable>
      </View>
    </View>
  );
};

export default SubmissionCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: "100%",
    borderWidth: 2,
    borderColor: colors.white,
    marginBottom: 35,
    columnGap: 15,
  },
  infoCont: {
    flex: 1,
    flexDirection: "row",
    columnGap: 25,
    rowGap: 10,
    overflow: "hidden",
  },
  infoContent: {
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: colors.white,
  },
  info: {
    fontWeight: "bold",
  },
  profileImg: {
    width: "30%",
    aspectRatio: "3/4",
    borderRadius: 10,
  },
  buttonCont: {
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    width: 45,
    aspectRatio: "1/1",
  },
});
