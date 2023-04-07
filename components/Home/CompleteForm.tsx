import { FC, useRef, useState } from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import { SubmissionProps } from "../../utils/database";
//-------components
import ProfileForm from "./ProfileForm";
import WaiverForm from "./WaiverForm";

interface CompleteFormProps {}
const windowWidth = Dimensions.get("window").width;

const CompleteForm: FC<CompleteFormProps> = () => {
  const [submissionFields, setSubmissionFields] = useState<Partial<SubmissionProps>>({
    firstName: "tesfirstNametfn",
    lastName: "testlastNamefn",
    email: "teemailstfn",
    phoneNumber: "testphoneNumberfn",
    dataOfBirth: new Date(),
    profileUri: "testprofileUri",
    photoIdUri: "testphotoIdUri",
  });
  const scrollableForm = useRef<ScrollView>(null);
  const handleChangePage = (toPage: 0 | 1) => {
    scrollableForm.current?.scrollTo({
      y: windowWidth * toPage,
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
      <ProfileForm changePage={handleChangePage} mainFormSubmission={handleMainFormSubmit} handleReset={handleReset} />
      <WaiverForm changePage={handleChangePage} submissionData={submissionFields} />
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
