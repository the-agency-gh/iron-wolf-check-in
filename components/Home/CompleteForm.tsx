import { FC, useRef, useState } from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import ProfileForm from "./ProfileForm";
interface CompleteFormProps {}
const windowWidth = Dimensions.get("window").width;
const CompleteForm: FC<CompleteFormProps> = () => {
  const scrollableForm = useRef<ScrollView>(null);
  const [pageStatus, setPageStatus] = useState({
    page: 1,
  });
  const handleNextPress = (dir: "left" | "right", page: number) => {
    console.log(page);
    scrollableForm.current?.scrollTo({
      y: windowWidth * (page + 1),
      animated: true,
    });
  };
  return (
    <ScrollView ref={scrollableForm} style={styles.formContainer} scrollEnabled={false} horizontal={true}>
      <ProfileForm pressNext={handleNextPress} page={1} />
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
