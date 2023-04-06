import { FC, useRef, useState } from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import { SubmissionProps } from "../../utils/database";
//-------components
import ProfileForm from "./ProfileForm";
import WaiverForm from "./WaiverForm";
interface CompleteFormProps {}
const windowWidth = Dimensions.get("window").width;

const CompleteForm: FC<CompleteFormProps> = () => {
  const [submissionFields, setSubmissionFields] = useState<SubmissionProps>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dataOfBirth: new Date(),
    profileUri: "",
    photoIdUri: "",
    pdfUri: "",
  });
  const scrollableForm = useRef<ScrollView>(null);
  const handleChangePage = (dir: "left" | "right", page: number) => {
    scrollableForm.current?.scrollTo({
      y: windowWidth * (page + (dir === "left" ? -2 : 1)),
      animated: true,
    });
  };
  //-------main form submit updater
  const handleMainFormSubmit = (data: Partial<SubmissionProps>) => {
    setSubmissionFields((curr) => ({
      ...curr,
      ...data,
    }));
  };
  const handleReset = () => {
    setSubmissionFields((curr) => ({
      ...curr,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dataOfBirth: new Date(),
      profileUri: "",
      photoIdUri: "",
      pdfUri: "",
    }));
  };
  return (
    <ScrollView ref={scrollableForm} style={styles.formContainer} scrollEnabled={false} horizontal={true}>
      <WaiverForm changePage={handleChangePage} page={2} />
      <ProfileForm changePage={handleChangePage} page={1} mainFormSubmission={handleMainFormSubmit} handleReset={handleReset} />
    </ScrollView>
  );
};

export default CompleteForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    flexDirection: "row",
  },
});
