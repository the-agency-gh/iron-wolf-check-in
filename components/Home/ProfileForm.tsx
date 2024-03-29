import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { z } from "zod";

//-----components
import { StackNavigationProp } from "@react-navigation/stack";
import Checkbox from "expo-checkbox";
import { RootStackParamList } from "../../App";
import { colors, shadow } from "../../styles/variables";
import { SubmissionProps } from "../../utils/database";
import { useGlobalStore } from "../../utils/formContex";
import FormInputField from "../FormInputField";
import LoadingView from "../LoadingView";
import CameraModal from "./parts/CameraModal";
import CameraShowButton from "./parts/buttons/CameraShowButton";
import NextButton from "./parts/buttons/NextButton";

interface ProfileFormProps {
  currentPage: 0 | 1;
  changePage: (toPage: 0 | 1) => void;
}

const formSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First Name is Required" }),
  lastName: z.string().trim().min(1, { message: "Last Name is Required" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is Required" })
    .email({ message: "Please Type in Valid Email" }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "Phone Number is Required" })
    .regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
      message: "Please Type in Valid Phone Number",
    }),
  memberName: z.string().trim().min(1, { message: "Member Name is Required" }),
});

const ProfileForm: FC<ProfileFormProps> = ({ currentPage, changePage }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [formState, resetFormState, updateFormState] = useGlobalStore(
    (state) => [state.formState, state.resetFormState, state.updateFormState]
  );
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitted, isSubmitting, errors, isDirty },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      memberName: "",
    },
  });
  const formInitialized =
    !!formState.firstName && !!formState.lastName && !!formState.email;
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [cashPayment, setCashPayment] = useState<boolean>(false);
  const [cameraStatus, setCameraStatus] = useState({
    profileShow: false,
    idShow: false,
    guardianId: false,
  });
  //handle camera and date modals and input
  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type !== "set") {
      setDatePickerShow(false);
      return;
    }
    setDatePickerShow(false);
    updateFormState({
      dateOfBirth: date,
    });
  };
  const handleCameraShowPress = (
    selected: "profile" | "photoId" | "guardianId",
    open: boolean
  ) => {
    setCameraStatus((curr) => ({
      ...curr,
      profileShow: selected === "profile" && open,
      idShow: selected === "photoId" && open,
      guardianId: selected === "guardianId" && open,
    }));
  };

  const handleCameraInput = (
    forId: "profile" | "photoId" | "guardianId",
    photoUri: string,
    imageBase64: string
  ) => {
    updateFormState({
      profileUri: forId === "profile" ? photoUri : formState.profileUri,
      profileBase64:
        forId === "profile" ? imageBase64 : formState.profileBase64,
      photoIdUri: forId === "photoId" ? photoUri : formState.photoIdUri,
      photoIdBase64:
        forId === "photoId" ? imageBase64 : formState.photoIdBase64,
      guardianPhotoIdUri:
        forId === "guardianId" ? photoUri : formState.guardianPhotoIdUri,
      guardianPhotoIdBase64:
        forId === "guardianId" ? imageBase64 : formState.guardianPhotoIdBase64,
    });
  };
  //----on submit and on error handler
  const handleFormSubmit = (data: Partial<SubmissionProps>) => {
    if (
      !formState.dateOfBirth ||
      !formState.photoIdUri ||
      !formState.profileUri ||
      (!applicantAge && !formState.profileUri)
    )
      return;
    updateFormState({
      ...data,
      cash: cashPayment,
    });
    console.log(data);
    console.log(
      formState.guardianPhotoIdUri,
      formState.photoIdUri,
      formState.profileUri
    );
    // console.log("formState: ", formState);
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
      guardianId: false,
    }));
    // sets initial
    setCashPayment(false);
  };
  const applicantAge =
    formState.dateOfBirth &&
    Math.floor(
      (Date.now() - formState.dateOfBirth.getTime()) /
        (365 * 24 * 60 * 60 * 1000)
    );
  const resetButtonActive =
    isDirty || formState.profileUri || formState.photoIdUri;

  useEffect(() => {
    !formInitialized && handleResetPress();
  }, [formInitialized]);

  useEffect(() => {
    navigation.setOptions({
      title: currentPage === 1 ? "Waiver" : "Guest Sign In",
      headerRight: () =>
        resetButtonActive && currentPage === 0 ? (
          <Pressable style={styles.resetButton} onPress={handleResetPress}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        ) : null,
    });
  }, [resetButtonActive, currentPage, navigation]);

  function setProfileDetails() {
    setValue("firstName", "adam");
    setValue("lastName", "bob");
    setValue("email", "jimbo@gmail.com");
    setValue("memberName", "joseph");
    setValue("phoneNumber", "8477304180");
  }

  return (
    <>
      {isSubmitting && (
        <LoadingView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
          }}
        />
      )}
      <ScrollView style={styles.container}>
        <View style={styles.mainFormContainer}>
          <View style={[styles.formContent]}>
            <View style={styles.nameCont}>
              {/* <Pressable
                style={[styles.DOBButton, shadow]}
                onPress={() => navigation.navigate("Settings")}
              >
                <Text>Settings</Text>
              </Pressable>
              <Pressable
                style={[styles.DOBButton, shadow]}
                onPress={() => setProfileDetails()}
              >
                <Text>prefill</Text>
              </Pressable> */}
              <FormInputField
                style={styles.nameInput}
                control={control}
                name="firstName"
                label="First Name"
                placeholder="Iron"
                error={errors?.firstName}
              />
              <FormInputField
                style={styles.nameInput}
                control={control}
                name="lastName"
                label="Last Name"
                placeholder="Wolf"
                error={errors?.lastName}
              />
            </View>
            <FormInputField
              control={control}
              name="email"
              label="Email"
              error={errors?.email}
              placeholder="email@gmail.com"
              keyboardType={"email-address"}
            />
            <FormInputField
              control={control}
              name="phoneNumber"
              label="Phone Number"
              error={errors?.phoneNumber}
              placeholder="8009991234"
              keyboardType={"number-pad"}
            />
            <View style={styles.additionalFieldCont}>
              {formState.dateOfBirth && (
                <Text style={styles.defaultFont}>
                  D.O.B:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {formState.dateOfBirth.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
                      color:
                        isSubmitted && !formState.dateOfBirth
                          ? colors.amber
                          : colors.baseBlack,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    },
                  ]}
                >
                  {formState.dateOfBirth
                    ? "Update Date of Birth"
                    : "Select Date of Birth"}
                </Text>
              </Pressable>
              {isSubmitted && !formState.dateOfBirth && (
                <Text style={styles.datePickerError}>
                  Date of Birth is Required
                </Text>
              )}
              {datePickerShow && (
                <DateTimePicker
                  display="spinner"
                  testID="mainFormDateTimePicker"
                  id="mainFormDateTimePicker"
                  value={formState.dateOfBirth || new Date()}
                  mode="date"
                  is24Hour={true}
                  onChange={onDateChange}
                />
              )}
            </View>
            <View style={styles.additionalFieldCont}>
              <View style={styles.paymentValidationCont}>
                <Checkbox
                  value={!cashPayment}
                  onValueChange={() => setCashPayment(false)}
                  style={styles.checkbox}
                />
                <Text
                  style={styles.defaultFont}
                  onPress={() => setCashPayment(false)}
                >
                  Charge Member
                </Text>
              </View>
              <View style={styles.paymentValidationCont}>
                <Checkbox
                  value={cashPayment === true}
                  onValueChange={() => setCashPayment(true)}
                  style={styles.checkbox}
                />
                <Text
                  style={styles.defaultFont}
                  onPress={() => setCashPayment(true)}
                >
                  Cash
                </Text>
              </View>
              <View style={[styles.memberNameInput]}>
                <FormInputField
                  style={{ flex: 1 }}
                  control={control}
                  name="memberName"
                  label="Member's Name"
                  placeholder="Iron Wolf"
                  error={errors?.memberName}
                />
              </View>
            </View>
          </View>
          <View style={styles.cameraCont}>
            <CameraShowButton
              text={
                isSubmitted && !formState.profileUri
                  ? "Selfie Required"
                  : formState.profileUri
                  ? "Retake Selfie"
                  : "Selfie"
              }
              style={
                isSubmitted && !formState.profileUri
                  ? { backgroundColor: "#8f061f" }
                  : {}
              }
              onPress={handleCameraShowPress.bind(null, "profile", true)}
              backgroundImg={formState.profileBase64 || undefined}
            />
            {cameraStatus.profileShow && (
              <CameraModal
                forId="profile"
                closeModal={handleCameraShowPress}
                handleCameraInput={handleCameraInput}
              />
            )}
          </View>
          <View style={styles.cameraCont}>
            <CameraShowButton
              text={
                isSubmitted && !formState.photoIdUri
                  ? "Photo ID Required"
                  : formState.photoIdUri
                  ? "Retake Photo ID"
                  : "Photo ID"
              }
              style={
                isSubmitted && !formState.photoIdUri
                  ? { backgroundColor: "#8f061f" }
                  : {}
              }
              onPress={handleCameraShowPress.bind(null, "photoId", true)}
              backgroundImg={formState.photoIdBase64 || undefined}
            />
            {cameraStatus.idShow && (
              <CameraModal
                forId="photoId"
                closeModal={handleCameraShowPress}
                handleCameraInput={handleCameraInput}
              />
            )}
          </View>
          {applicantAge !== undefined &&
            (applicantAge === 0 || applicantAge < 18) && (
              <View style={styles.cameraCont}>
                <CameraShowButton
                  text={
                    isSubmitted && !formState.guardianPhotoIdUri
                      ? "Guardian Photo ID Required"
                      : formState.guardianPhotoIdUri
                      ? "Retake Guardian Photo ID"
                      : "Guardian Photo ID"
                  }
                  style={
                    isSubmitted && !formState.guardianPhotoIdUri
                      ? { backgroundColor: "#8f061f" }
                      : {}
                  }
                  onPress={handleCameraShowPress.bind(null, "guardianId", true)}
                  backgroundImg={formState.guardianPhotoIdBase64 || undefined}
                />
                {cameraStatus.guardianId && (
                  <CameraModal
                    forId="guardianId"
                    closeModal={handleCameraShowPress}
                    handleCameraInput={handleCameraInput}
                  />
                )}
              </View>
            )}
          <View style={styles.formButtons}>
            <NextButton onPress={handleSubmit(handleFormSubmit)} text="Next" />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileForm;
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
  },
  mainFormContainer: {
    rowGap: 40,
    padding: 25,
  },
  formContent: {
    rowGap: 40,
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
  checkbox: {
    marginRight: 8,
  },
  DOBButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    textTransform: "uppercase",
  },
  additionalFieldCont: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    columnGap: 35,
  },
  paymentValidationCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerError: {
    position: "absolute",
    bottom: -22,
    color: colors.amber,
  },
  memberNameInput: {
    width: "50%",
  },
  cameraCont: {
    flex: 1,
    width: "100%",
    height: 200,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  resetButton: {
    marginRight: 15,
    borderWidth: 1,
    borderColor: colors.amber3,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resetText: {
    fontSize: 18,
    color: colors.amber3,
    fontWeight: "600",
  },
});
