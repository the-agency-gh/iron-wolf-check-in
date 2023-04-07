import { FC, useRef } from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";

//-------components
import ProfileForm from "./ProfileForm";
import WaiverForm from "./WaiverForm";

interface CompleteFormProps {}
const windowWidth = Dimensions.get("window").width;

const CompleteForm: FC<CompleteFormProps> = () => {
  const scrollableForm = useRef<ScrollView>(null);
  const handleChangePage = (toPage: 0 | 1) => {
    scrollableForm.current?.scrollTo({
      y: windowWidth * toPage,
      animated: true,
    });
  };

  return (
    <ScrollView ref={scrollableForm} style={styles.formContainer} scrollEnabled={false} horizontal={true}>
      <ProfileForm changePage={handleChangePage} />
      <WaiverForm changePage={handleChangePage} />
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
