import { FC, useLayoutEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Animated, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { FieldValues } from "react-hook-form/dist/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
//--components
import FormButton from "./parts/FormButton";
import { colors } from "../../styles/variables";
import LoadingView from "../LoadingView";
import HorizontalRule from "../HorizontalRule";
import { addSetting, updateSetting } from "../../utils/database";
import BackIcon from "../navigation/BackIcon";
import { RootStackParamList } from "../../App";

type settingDataProp = { email: string; password: string; designatedEmail: string; [rest: string]: string };
interface SettingsProps {
  settingData: settingDataProp | unknown;
}

const ErrorMsg: FC<{ children: string }> = ({ children }) => {
  return (
    <Animated.View style={[styles.errorMsgCont]}>
      <Text style={[styles.errorMsg]}>{children}</Text>;
    </Animated.View>
  );
};

const Settings: FC<SettingsProps> = ({ settingData }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [settingStatus, setSettingStatus] = useState({
    initialized: !!settingData,
    update: false,
    email: (settingData as settingDataProp)?.email,
    password: (settingData as settingDataProp)?.password,
    designatedEmail: (settingData as settingDataProp)?.designatedEmail,
  });
  const [saveSub, setSaveSub] = useState(+(settingData as settingDataProp)?.saveSubmission === 1);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: (settingData as settingDataProp)?.email || "",
      password: (settingData as settingDataProp)?.password || "",
      designatedEmail: (settingData as settingDataProp)?.designatedEmail || "",
    },
  });
  const handleSettingSubmit = async (data: FieldValues) => {
    const formData = { email: data.email, password: data.password, designatedEmail: data.designatedEmail, saveSubmission: saveSub };
    if (!settingStatus.initialized) {
      await addSetting(formData);
      navigation.navigate("Home");
    } else {
      await updateSetting(formData);
    }
    setSettingStatus((curr) => ({
      ...curr,
      initialized: true,
      update: false,
      email: data.email,
      password: data.password,
      designatedEmail: data.designatedEmail,
    }));
  };
  const handleSettingError = (error: FieldValues) => {
    console.error(error);
  };
  const handleCancel = () => {
    setValue("email", settingStatus.email);
    setValue("password", settingStatus.password);
    setValue("designatedEmail", settingStatus.designatedEmail);
    setSettingStatus((curr) => ({
      ...curr,
      update: false,
    }));
    setSaveSub(!!(settingData as settingDataProp)?.saveSubmission);
  };
  const handleSubmissionsRedirect = () => {
    navigation.navigate("Submissions");
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: settingStatus.initialized ? "Settings" : "Initial Settings",
      headerLeft: () => {
        return settingStatus.initialized && <BackIcon onPress={() => navigation.navigate("Home")} />;
      },
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      {!settingStatus.initialized || settingStatus.update ? (
        !isSubmitting ? (
          <View style={styles.settingForm}>
            <View style={styles.inputCont}>
              <Text style={[styles.defaultText, styles.label]}>Email</Text>
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please Type in Valid Email",
                  },
                }}
                render={({ field: { onChange, onBlur, value, ...fields } }) => (
                  <TextInput
                    id="email"
                    style={[styles.input, styles.defaultText]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    {...fields}
                  />
                )}
                name="email"
              />
              {errors.email && <Text style={[styles.errorMsg]}>{errors.email.message as string}</Text>}
            </View>
            <View style={styles.inputCont}>
              <Text style={[styles.defaultText, styles.label]}>Password</Text>
              <Controller
                control={control}
                rules={{
                  required: "Password is required",
                }}
                render={({ field: { onChange, onBlur, value, ...fields } }) => (
                  <TextInput
                    id="password"
                    style={[styles.input, styles.defaultText]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    {...fields}
                  />
                )}
                name="password"
              />
              {errors.password && <Text style={[styles.errorMsg]}>{errors.password.message as string}</Text>}
            </View>
            <HorizontalRule />
            <View style={styles.inputCont}>
              <Text style={[styles.defaultText, styles.label]}>Designated Email</Text>
              <Controller
                control={control}
                rules={{
                  required: "Designated Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please Type in Valid Email",
                  },
                }}
                render={({ field: { onChange, onBlur, value, ...fields } }) => (
                  <TextInput
                    id="designatedEmail"
                    style={[styles.input, styles.defaultText]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    {...fields}
                  />
                )}
                name="designatedEmail"
              />
              {errors.designatedEmail && <Text style={[styles.errorMsg]}>{errors.designatedEmail.message as string}</Text>}
            </View>
            <View style={styles.saveSubCont}>
              <Pressable
                onPress={() => setSaveSub((curr) => !curr)}
                style={[styles.saveSubCheckbox, { backgroundColor: saveSub ? colors.lightBlue : "transparent" }]}
              ></Pressable>
              <Text style={[styles.defaultText, styles.saveSubmissionLabel]}>Save Submission</Text>
            </View>
            <View style={styles.buttonCont}>
              <FormButton onPress={handleSubmit(handleSettingSubmit, handleSettingError)} style={styles.submitBtn}>
                {!settingStatus.initialized ? "Register" : "Update"}
              </FormButton>
              {settingStatus.initialized && (
                <FormButton onPress={handleCancel} style={styles.cancelBtn}>
                  Cancel
                </FormButton>
              )}
            </View>
          </View>
        ) : (
          <LoadingView />
        )
      ) : (
        <>
          <View style={styles.settingForm}>
            <Text style={styles.settingInfoText}>
              Email: <Text style={styles.settingInfoTitle}>{settingStatus.email}</Text>
            </Text>
            <Text style={styles.settingInfoText}>
              Password: <Text style={styles.settingInfoTitle}>{settingStatus.password.replace(/[\w\W]/g, "*")}</Text>
            </Text>
            <Text style={styles.settingInfoText}>
              Designated Email: <Text style={styles.settingInfoTitle}>{settingStatus.designatedEmail}</Text>
            </Text>
            <Text style={styles.settingInfoText}>
              Save Submission: <Text style={styles.settingInfoTitle}>{saveSub.toString()}</Text>
            </Text>
            <View style={{ flexDirection: "row" }}>
              <FormButton
                style={styles.updateBtn}
                onPress={() => {
                  setSettingStatus((curr) => ({
                    ...curr,
                    update: true,
                  }));
                }}
              >
                Update
              </FormButton>
            </View>
          </View>
          <Pressable style={styles.submissionButton} onPress={handleSubmissionsRedirect}>
            <Text style={[styles.defaultText, { fontWeight: "bold" }]}>Previous Submissions</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingForm: {
    minWidth: "100%",
    rowGap: 40,
    borderWidth: 2,
    borderColor: colors.white,
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  defaultText: {
    color: colors.white,
    fontSize: 18,
  },
  inputCont: {
    position: "relative",
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 5,
    padding: 14,
    width: "100%",
  },
  label: {
    position: "absolute",
    fontWeight: "bold",
    textTransform: "uppercase",
    top: 0,
    left: 5,
    transform: [{ translateY: -14 }],
    backgroundColor: colors.baseBlack,
  },
  input: {},
  errorMsgCont: {},
  errorMsg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    color: colors.amber,
    fontSize: 16,
    transform: [{ translateY: 24 }],
  },
  buttonCont: {
    flexDirection: "row",
    columnGap: 25,
  },
  saveSubCont: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 25,
  },
  saveSubCheckbox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.white,
  },
  saveSubmissionLabel: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  settingInfoText: {
    color: colors.white,
    fontSize: 20,
  },
  settingInfoTitle: {
    fontWeight: "bold",
  },
  submitBtn: {},
  cancelBtn: {
    backgroundColor: colors.amber2,
  },
  updateBtn: {
    alignSelf: "center",
    backgroundColor: colors.yellow,
  },
  submissionButton: {
    marginTop: 50,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
});
