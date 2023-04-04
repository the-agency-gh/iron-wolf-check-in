import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

//-----components
import { colors, shadow } from "../../styles/variables";
import { SubmissionProps } from "../../utils/database";
import { StateType, useFormStore } from "../../utils/formContex";
import FormInputField from "../FormInputField";
import CameraShowButton from "./parts/CameraShowButton";
import CameraModal from "./parts/CameraModal";
import NextButton from "./parts/buttons/NextButton";
import LoadingView from "../LoadingView";

interface ProfileFormProps {
  pressNext: (dir: "left" | "right", page: number) => void;
  page: number;
}

const ProfileForm: FC<ProfileFormProps> = ({ pressNext, page }) => {
  const [formSubmitCtx, formReset] = useFormStore((state) => [state.updateState, state.resetState]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm();
  const [imageStatus, setImageStatus] = useState<{
    profileUri: string | undefined;
    profileError: boolean;
    photoIdUri: string | undefined;
    photoIdError: boolean;
  }>({
    profileUri: undefined,
    photoIdUri: undefined,
    profileError: false,
    photoIdError: false,
  });
  const [datePickerStatus, setDatePickerStatus] = useState({ date: new Date(), picked: false, show: false, error: false });
  const [cameraStatus, setCameraStatus] = useState({ profileShow: false, idShow: false });
  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type !== "set") {
      setDatePickerStatus((curr) => ({
        ...curr,
        show: false,
      }));
      return;
    }
    setDatePickerStatus((curr) => ({
      ...curr,
      date: date as Date,
      picked: true,
      show: false,
      error: false,
    }));
  };
  const handleCameraShowPress = (selected: "profile" | "photoId", open: boolean) => {
    setCameraStatus((curr) => ({
      ...curr,
      profileShow: selected === "profile" && open,
      idShow: selected === "photoId" && open,
    }));
  };
  const handleCameraInput = (forId: "profile" | "photoId", photoUri: string) => {
    setImageStatus((curr) => ({
      ...curr,
      profileUri: forId === "profile" ? photoUri : curr.profileUri,
      photoIdUri: forId === "photoId" ? photoUri : curr.photoIdUri,
      profileError: curr.profileError && forId !== "profile",
      photoIdError: curr.photoIdError && forId !== "photoId",
    }));
  };
  const handleProfileFormSubmit = (data: Partial<SubmissionProps>) => {
    if (!datePickerStatus.picked || !imageStatus.profileUri || !imageStatus.photoIdUri) {
      setImageStatus((curr) => ({
        ...curr,
        profileError: !imageStatus.profileUri,
        photoIdError: !imageStatus.photoIdUri,
      }));
      setDatePickerStatus((curr) => ({
        ...curr,
        error: !!!datePickerStatus.picked,
      }));
      return;
    }
    const passableData: StateType = {
      formState: {
        ...data,
        dataOfBirth: datePickerStatus.date,
        profileUri: imageStatus.profileUri,
        photoIdUri: imageStatus.photoIdUri,
      },
    };
    formSubmitCtx(passableData);
    pressNext("right", page);
  };
  const handleResetPress = () => {
    formReset();
    reset();
    setImageStatus((curr) => ({
      ...curr,
      profileUri: undefined,
      photoIdUri: undefined,
      profileError: false,
      photoIdError: false,
    }));
    setDatePickerStatus((curr) => ({
      ...curr,
      date: new Date(),
      picked: false,
      show: false,
      error: false,
    }));
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
            {datePickerStatus.picked && (
              <Text style={styles.defaultFont}>
                Date of Birth:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {datePickerStatus.date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </Text>
              </Text>
            )}
            <Pressable
              style={[styles.DOBButton, shadow]}
              android_ripple={{ color: colors.lightBlue }}
              onPress={() => {
                setDatePickerStatus((curr) => ({ ...curr, show: true }));
              }}
            >
              <Text
                style={[
                  styles.defaultFont,
                  { color: datePickerStatus.error ? colors.amber : colors.baseBlack, fontWeight: "bold", textTransform: "uppercase" },
                ]}
              >
                Pick Date of Birth
              </Text>
            </Pressable>
            {datePickerStatus.error && <Text style={styles.datePickerError}>Date of Birth is Required!</Text>}
            {datePickerStatus.show && (
              <DateTimePicker
                testID="mainFormDateTimePicker"
                id="mainFormDateTimePicker"
                value={datePickerStatus.date}
                mode="date"
                is24Hour={true}
                onChange={onDateChange}
              />
            )}
          </View>
        </View>
        <View style={styles.cameraCont}>
          <CameraShowButton
            text={imageStatus.profileError ? "Profile Required" : imageStatus.profileUri ? "Retake Profile Picture" : "Profile"}
            style={imageStatus.profileError ? { backgroundColor: "#fd858b" } : {}}
            onPress={handleCameraShowPress.bind(null, "profile", true)}
            backgroundImg={imageStatus.profileUri || undefined}
          />
          {cameraStatus.profileShow && (
            <CameraModal forId="profile" closeModal={handleCameraShowPress} handleCameraInput={handleCameraInput} />
          )}
        </View>
        <View style={styles.cameraCont}>
          <CameraShowButton
            text={imageStatus.photoIdError ? "Photo ID Required" : imageStatus.photoIdUri ? "Retake Photo ID Picture" : "Photo ID"}
            style={imageStatus.photoIdError ? { backgroundColor: "#fd858b" } : {}}
            onPress={handleCameraShowPress.bind(null, "photoId", true)}
            backgroundImg={imageStatus.photoIdUri || undefined}
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
          <NextButton onPress={handleSubmit(handleProfileFormSubmit)} text="Next" />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileForm;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
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
