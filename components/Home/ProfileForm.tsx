import { FC, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

//-----components
import { colors, shadow } from "../../styles/variables";
import { SubmissionProps } from "../../utils/database";
import { useGlobalStore } from "../../utils/formContex";
import FormInputField from "../FormInputField";
import CameraShowButton from "./parts/buttons/CameraShowButton";
import CameraModal from "./parts/CameraModal";
import NextButton from "./parts/buttons/NextButton";
import LoadingView from "../LoadingView";

interface ProfileFormProps {
  changePage: (toPage: 0 | 1) => void;
}

const ProfileForm: FC<ProfileFormProps> = ({ changePage }) => {
  const [formState, resetFormState, updateFormState] = useGlobalStore((state) => [
    state.formState,
    state.resetFormState,
    state.updateFormState,
  ]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitted, isSubmitting, errors, isDirty },
  } = useForm();

  const [datePickerShow, setDatePickerShow] = useState(false);
  const [cameraStatus, setCameraStatus] = useState({ profileShow: false, idShow: false });

  //handle camera and date modals and input
  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type !== "set") {
      setDatePickerShow(false);
      return;
    }
    setDatePickerShow(false);
    updateFormState({
      dataOfBirth: date,
    });
  };
  const handleCameraShowPress = (selected: "profile" | "photoId", open: boolean) => {
    setCameraStatus((curr) => ({
      ...curr,
      profileShow: selected === "profile" && open,
      idShow: selected === "photoId" && open,
    }));
  };
  const handleCameraInput = (forId: "profile" | "photoId", photoUri: string) => {
    updateFormState({
      profileUri: forId === "profile" ? photoUri : formState.profileUri,
      photoIdUri: forId === "photoId" ? photoUri : formState.photoIdUri,
    });
  };

  //----on submit and on error handler
  const handleFormSubmit = (data: Partial<SubmissionProps>) => {
    if (!formState.dataOfBirth || !formState.photoIdUri || !formState.profileUri) return;
    updateFormState({
      ...data,
    });
    changePage(1);
  };
  const handleResetPress = () => {
    reset();
    resetFormState();
    setDatePickerShow(false);
    setCameraStatus((curr) => ({
      ...curr,
      profileShow: false,
      idShow: false,
    }));
  };

  return (
    <>
      {isSubmitting && <LoadingView style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 1 }} />}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} enabled={false} style={styles.container}>
        <View style={styles.formContent}>
          <View style={styles.nameCont}>
            <FormInputField
              style={styles.nameInput}
              control={control}
              name="firstName"
              label="First Name"
              placeholder="Iron"
              rules={{
                required: "First Name is Required",
              }}
              error={errors?.firstName}
            />
            <FormInputField
              style={styles.nameInput}
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Wolf"
              rules={{
                required: "Last Name is Required",
              }}
              error={errors?.lastName}
            />
          </View>
          <FormInputField
            control={control}
            name="email"
            label="Email"
            error={errors?.email}
            placeholder="email@email.com"
            keyboardType={"email-address"}
            rules={{
              required: "Email is Required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please Type in Valid Email",
              },
            }}
          />
          <FormInputField
            control={control}
            name="phoneNumber"
            label="Phone Number"
            error={errors?.phoneNumber}
            placeholder="000-000-0000"
            keyboardType={"number-pad"}
            rules={{
              required: "Phone Number is Required",
              pattern: {
                value: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                message: "Please Type in Valid Phone Number",
              },
            }}
          />
          <View style={styles.datePickerCont}>
            {formState.dataOfBirth && (
              <Text style={styles.defaultFont}>
                Date of Birth:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {formState.dataOfBirth.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </Text>
              </Text>
            )}
            <Pressable
              style={[styles.DOBButton, shadow]}
              android_ripple={{ color: colors.lightBlue }}
              onPress={() => {
                setDatePickerShow(true);
              }}
            >
              <Text
                style={[
                  styles.defaultFont,
                  {
                    color: isSubmitted && !formState.dataOfBirth ? colors.amber : colors.baseBlack,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  },
                ]}
              >
                Pick Date of Birth
              </Text>
            </Pressable>
            {isSubmitted && !formState.dataOfBirth && <Text style={styles.datePickerError}>Date of Birth is Required!</Text>}
            {datePickerShow && (
              <DateTimePicker
                testID="mainFormDateTimePicker"
                id="mainFormDateTimePicker"
                value={formState.dataOfBirth || new Date()}
                mode="date"
                is24Hour={true}
                onChange={onDateChange}
              />
            )}
          </View>
        </View>
        <View style={styles.cameraCont}>
          <CameraShowButton
            text={isSubmitted && !formState.profileUri ? "Profile Required" : formState.profileUri ? "Retake Profile Picture" : "Profile"}
            style={isSubmitted && !formState.profileUri ? { backgroundColor: "#fd858b" } : {}}
            onPress={handleCameraShowPress.bind(null, "profile", true)}
            backgroundImg={formState.profileUri || undefined}
          />
          {cameraStatus.profileShow && (
            <CameraModal forId="profile" closeModal={handleCameraShowPress} handleCameraInput={handleCameraInput} />
          )}
        </View>
        <View style={styles.cameraCont}>
          <CameraShowButton
            text={
              isSubmitted && !formState.photoIdUri ? "Photo ID Required" : formState.photoIdUri ? "Retake Photo ID Picture" : "Photo ID"
            }
            style={isSubmitted && !formState.photoIdUri ? { backgroundColor: "#fd858b" } : {}}
            onPress={handleCameraShowPress.bind(null, "photoId", true)}
            backgroundImg={formState.photoIdUri || undefined}
          />
          {cameraStatus.idShow && <CameraModal forId="photoId" closeModal={handleCameraShowPress} handleCameraInput={handleCameraInput} />}
        </View>
        <View style={styles.formButtons}>
          {isDirty ? (
            <NextButton
              onPress={handleResetPress}
              text="Reset"
              style={[{ backgroundColor: colors.amber }]}
              textStyle={{ color: colors.white }}
            />
          ) : (
            <View></View>
          )}
          <NextButton
            onPress={() => {
              changePage(1);
            }}
            text="NextPage"
          />
          <NextButton onPress={handleSubmit(handleFormSubmit)} text="Next" />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    padding: 25,
    rowGap: 30,
  },
  formContent: {
    rowGap: 40,
    marginBottom: 10,
  },
  nameCont: {
    flexDirection: "row",
    columnGap: 35,
  },
  nameInput: {
    flex: 1,
  },
  defaultFont: {
    color: colors.white,
    fontSize: 20,
  },
  DOBButton: {
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    textTransform: "uppercase",
  },
  datePickerCont: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 35,
  },
  datePickerError: {
    position: "absolute",
    left: 12,
    bottom: -22,
    color: colors.amber,
  },
  cameraCont: {
    flex: 1,
    width: "100%",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
