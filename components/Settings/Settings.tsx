import { FC, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { FieldValues } from "react-hook-form/dist/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
//--components
import FormButton from "./parts/FormButton";
import LoadingView from "../LoadingView";
import HorizontalRule from "../HorizontalRule";
import BackIcon from "../navigation/BackIcon";
import FormInputField from "../FormInputField";
import { colors } from "../../styles/variables";
import { addSetting, updateSetting } from "../../utils/database";
import { RootStackParamList } from "../../App";

interface SettingsProps {
  settingData: settingDataProp;
}

export type settingDataProp = { email: string; password: string; designatedEmail: string; saveSubmission: 1 | 0; [rest: string]: any };

const Settings: FC<SettingsProps> = ({ settingData }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [settingStatus, setSettingStatus] = useState({
    initialized: !!settingData,
    update: false,
    email: settingData?.email,
    password: settingData?.password,
    designatedEmail: settingData?.designatedEmail,
  });
  const [saveSub, setSaveSub] = useState(+settingData.saveSubmission === 1);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: settingStatus.email || "",
      password: settingStatus.password || "",
      designatedEmail: settingStatus.designatedEmail || "",
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
  useEffect(() => {
    setSettingStatus((curr) => ({
      ...curr,
      initialized: !!settingData,
      update: false,
      email: settingData?.email,
      password: settingData?.password,
      designatedEmail: settingData?.designatedEmail,
    }));
    setSaveSub(+settingData?.saveSubmission === 1);
    setValue("email", settingData.email);
    setValue("password", settingData.password);
    setValue("designatedEmail", settingData.designatedEmail);
  }, [settingData]);
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
            <FormInputField
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please Type in Valid Email",
                },
              }}
              name="email"
              label="Email"
              error={errors.email}
            />
            <FormInputField
              control={control}
              rules={{
                required: "Password is required",
              }}
              name="password"
              label="Password"
              error={errors.password}
            />
            <HorizontalRule />
            <FormInputField
              control={control}
              rules={{
                required: "Designated Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please Type in Valid Email",
                },
              }}
              name="designatedEmail"
              label="Designated Email"
              error={errors.designatedEmail}
            />
            <View style={styles.saveSubCont}>
              <Switch
                trackColor={{ false: "#767577", true: colors.darkBlue }}
                thumbColor={saveSub ? colors.lightBlue : colors.amber}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setSaveSub((curr) => !curr)}
                value={saveSub}
              />
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
  buttonCont: {
    flexDirection: "row",
    columnGap: 25,
  },
  saveSubCont: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 25,
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
