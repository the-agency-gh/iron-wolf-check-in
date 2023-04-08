import { FC, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
//--components
import { colors } from "../../styles/variables";
import { addSetting, updateSetting, SettingProps } from "../../utils/database";
import { RootStackParamList } from "../../App";
import { useGlobalStore } from "../../utils/formContex";
import FormButton from "./parts/FormButton";
import LoadingView from "../LoadingView";
import HorizontalRule from "../HorizontalRule";
import BackIcon from "../navigation/BackIcon";
import FormInputField from "../FormInputField";

interface SettingsProps {}

const settingSchema = z.object({
  host: z.string().min(1, { message: "Host Address is Required" }),
  email: z.string().email({ message: "Valid Email is Required" }).min(1, { message: "Email is Required" }),
  password: z.string().min(1, { message: "Password is required" }),
  designatedEmail: z.string().email({ message: "Valid Email is Required" }).min(1, { message: "Designated Email is Required" }),
});

const Settings: FC<SettingsProps> = ({}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [settingState, updateSettingState] = useGlobalStore((state) => [state.settingState, state.updateSettingState]);
  const initialized = !!settingState.host && !!settingState.email && !!settingState.password && !!settingState.designatedEmail;

  const [updateSettingToggle, setUpdateSettingToggle] = useState(false);
  const [saveSub, setSaveSub] = useState<1 | 0>(settingState.saveSubmission || 0);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitted, isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      host: settingState.host || "",
      email: settingState.email || "",
      password: settingState.password || "",
      designatedEmail: settingState.designatedEmail || "",
    },
  });

  const handleSettingSubmit = async (data: Omit<SettingProps, "saveSubmission">) => {
    const formData: SettingProps = {
      host: data.host,
      email: data.email,
      password: data.password,
      designatedEmail: data.designatedEmail,
      saveSubmission: saveSub,
    };
    if (!initialized) {
      await addSetting(formData);
      navigation.navigate("Home");
    } else {
      await updateSetting(formData);
    }
    setUpdateSettingToggle(false);
    updateSettingState({
      ...settingState,
      ...formData,
    });
  };
  const handleCancel = () => {
    //check on transition
    setValue("host", settingState.host || "");
    setValue("email", settingState.email || "");
    setValue("password", settingState.password || "");
    setValue("designatedEmail", settingState.designatedEmail || "");
    setSaveSub(settingState.saveSubmission || 0);
    setUpdateSettingToggle(false);
  };
  const handleSubmissionsRedirect = () => {
    navigation.navigate("Submissions");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: initialized ? "Settings" : "Initial Settings",
      headerLeft: () => {
        return (
          initialized && (
            <BackIcon
              onPress={() => {
                handleCancel();
                navigation.navigate("Home");
              }}
            />
          )
        );
      },
    });
  }, [navigation]);
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {initialized && !updateSettingToggle ? (
        <>
          <View style={styles.settingForm}>
            <Text style={styles.settingInfoText}>
              Host: <Text style={styles.settingInfoTitle}>{settingState.host}</Text>
            </Text>
            <Text style={styles.settingInfoText}>
              Email: <Text style={styles.settingInfoTitle}>{settingState.email}</Text>
            </Text>
            <Text style={styles.settingInfoText}>
              Password: <Text style={styles.settingInfoTitle}>{settingState.password?.replace(/[\w\W]/g, "*")}</Text>
            </Text>
            <Text style={styles.settingInfoText}>
              Designated Email: <Text style={styles.settingInfoTitle}>{settingState.designatedEmail}</Text>
            </Text>
            <Text style={styles.settingInfoText}>
              Save Submission: <Text style={styles.settingInfoTitle}>{saveSub === 1 ? "True" : "False"}</Text>
            </Text>
            <View style={{ flexDirection: "row" }}>
              <FormButton
                style={styles.updateBtn}
                textStyle={{ color: colors.darkBlack }}
                onPress={() => {
                  setUpdateSettingToggle(true);
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
      ) : isSubmitting ? (
        <LoadingView />
      ) : (
        <View style={styles.settingForm}>
          <FormInputField
            control={control}
            rules={{
              required: "Host Address is required",
            }}
            name="host"
            label="Host"
            error={errors?.host}
          />
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
            error={errors?.email}
            keyboardType={"email-address"}
          />
          <FormInputField
            control={control}
            name="password"
            label="Password"
            error={errors?.password}
            rules={{
              required: "Password is required",
            }}
          />
          <HorizontalRule />
          <FormInputField
            control={control}
            name="designatedEmail"
            label="Designated Email"
            error={errors?.designatedEmail}
            keyboardType={"email-address"}
            rules={{
              required: "Designated Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please Type in Valid Email",
              },
            }}
          />
          <View style={styles.saveSubCont}>
            <Switch
              trackColor={{ false: "#767577", true: colors.darkBlue }}
              thumbColor={saveSub ? colors.lightBlue : colors.amber}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setSaveSub(saveSub === 1 ? 0 : 1)}
              value={saveSub === 1}
            />
            <Text style={[styles.defaultText, styles.saveSubmissionLabel]}>Save Submission</Text>
          </View>
          <View style={styles.buttonCont}>
            <FormButton onPress={handleSubmit(handleSettingSubmit)} style={styles.submitBtn}>
              {!initialized ? "Register" : "Update"}
            </FormButton>
            {initialized && (
              <FormButton onPress={handleCancel} style={styles.cancelBtn}>
                Cancel
              </FormButton>
            )}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
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
    borderRadius: 5,
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
    borderRadius: 5,
  },
});
