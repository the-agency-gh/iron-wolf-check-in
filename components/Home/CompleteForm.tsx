import { FC, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

//-------components
import ProfileForm from "./ProfileForm";
import WaiverForm from "./WaiverForm";
import InitialScreenModal from "./parts/InitialScreenModal";

interface CompleteFormProps {}
const windowWidth = Dimensions.get("window").width;

const CompleteForm: FC<CompleteFormProps> = () => {
  const [currentPage, setCurrentPage] = useState<0 | 1>(0);
  const [isInital, setIsIntial] = useState<boolean>(true);
  const scrollableForm = useRef<ScrollView>(null);
  const handleChangePage = (toPage: 0 | 1) => {
    setCurrentPage(toPage);
    scrollableForm.current?.scrollTo({
      y: windowWidth * toPage,
      animated: true,
    });
  };

  return (
    <>
      <InitialScreenModal
        visible={isInital}
        closeModal={() => {
          setIsIntial(false);
        }}
      />
      <ScrollView
        ref={scrollableForm}
        style={styles.formContainer}
        scrollEnabled={false}
        horizontal={true}
      >
        <ProfileForm changePage={handleChangePage} currentPage={currentPage} />
        <WaiverForm
          changePage={handleChangePage}
          currentPage={currentPage}
          resetModal={() => {
            setIsIntial(true);
          }}
        />
      </ScrollView>
    </>
  );
};

export default CompleteForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    flexDirection: "row",
  },
});
