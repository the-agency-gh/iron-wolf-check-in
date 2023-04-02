import { FC, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

//-----components
import { colors, shadow } from "../../styles/variables";
import { SubmissionProps } from "../../utils/database";
import { FormAction, useFormStore } from "../../utils/formContex";
import FormInputField from "../FormInputField";
import CameraShowButton from "./parts/CameraShowButton";
import CameraModal from "./parts/CameraModal";
import NextButton from "./parts/buttons/NextButton";

interface ProfileFormProps {}

const ProfileForm: FC<ProfileFormProps> = () => {
  const formCtx = useFormStore((state) => state);
  console.log(formCtx);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm();
  const [imageStatus, setImageStatus] = useState<{ profileUri: string | undefined; photoIdUri: string | undefined }>({
    profileUri: "",
    photoIdUri: "",
  });
  const [datePickerStatus, setDatePickerStatus] = useState({ date: new Date(), picked: false, show: false });
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
    }));
  };
  const handleProfileFormSubmit = (data: FieldValues) => {
    console.log(data);
  };
  return (
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
            <Text style={[styles.defaultFont, { color: colors.baseBlack, fontWeight: "bold", textTransform: "uppercase" }]}>
              Pick Date of Birth
            </Text>
          </Pressable>
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
          text={!!imageStatus.profileUri ? "Retake Profile Picture" : "Profile"}
          onPress={handleCameraShowPress.bind(null, "profile", true)}
          backgroundImg={imageStatus.profileUri || undefined}
        />
        {cameraStatus.profileShow && (
          <CameraModal forId="profile" closeModal={handleCameraShowPress} handleCameraInput={handleCameraInput} />
        )}
      </View>
      <View style={styles.cameraCont}>
        <CameraShowButton
          text={!!imageStatus.photoIdUri ? "Retake Photo ID Picture" : "Photo ID"}
          onPress={handleCameraShowPress.bind(null, "photoId", true)}
          backgroundImg={imageStatus.photoIdUri || undefined}
        />
        {cameraStatus.idShow && <CameraModal forId="photoId" closeModal={handleCameraShowPress} handleCameraInput={handleCameraInput} />}
      </View>
      <NextButton onPress={handleSubmit(handleProfileFormSubmit)} text="Next" />
    </KeyboardAvoidingView>
  );
};

export default ProfileForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    margin: 10,
    rowGap: 20,
  },
  formContent: {
    rowGap: 40,
    marginBottom: 20,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 35,
  },
  cameraCont: {
    flex: 1,
    width: "100%",
  },
});
