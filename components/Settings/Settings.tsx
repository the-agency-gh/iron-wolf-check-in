import { FC, useLayoutEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, Pressable, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
//--components
import { colors } from "../../styles/variables";
import { addSetting, updateSetting, SettingsProps } from "../../utils/database";
import { RootStackParamList } from "../../App";
import { useGlobalStore } from "../../utils/formContex";
import FormButton from "./parts/FormButton";
import LoadingView from "../LoadingView";
import HorizontalRule from "../HorizontalRule";
import BackIcon from "../navigation/BackIcon";
import FormInputField from "../FormInputField";

interface SettingsCompProps {}

const settingSchema = z.object({
  apiUrl: z.string().trim().toLowerCase().min(1, { message: "API Url is Required" }),
  apiToken: z.string().trim().min(1, { message: "API Token is Required" }),
  host: z.string().trim().toLowerCase().min(1, { message: "Host Address is Required" }),
  email: z.string().trim().toLowerCase().min(1, { message: "Email is Required" }).email({ message: "Valid Email is Required" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
  designatedEmail: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Designated Email is Required" })
    .email({ message: "Valid Email is Required" }),
});

const Settings: FC<SettingsCompProps> = ({}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [settingState, updateSettingState] = useGlobalStore((state) => [state.settingState, state.updateSettingState]);
  const initialized = !!settingState.host && !!settingState.email && !!settingState.password && !!settingState.designatedEmail;

  const [updateSettingToggle, setUpdateSettingToggle] = useState(false);
  const [saveSub, setSaveSub] = useState<boolean>(settingState.saveSubmission || false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      apiUrl: settingState.apiUrl || "",
      apiToken: settingState.apiToken || "",
      host: settingState.host || "",
      email: settingState.email || "",
      password: settingState.password || "",
      designatedEmail: settingState.designatedEmail || "",
    },
  });

  const handleSettingSubmit = async (data: Omit<SettingsProps, "saveSubmission">) => {
    const formData: SettingsProps = {
      apiUrl: data.apiUrl,
      apiToken: data.apiToken,
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
    setValue("apiUrl", settingState.apiUrl || "");
    setValue("apiToken", settingState.apiToken || "");
    setValue("host", settingState.host || "");
    setValue("email", settingState.email || "");
    setValue("password", settingState.password || "");
    setValue("designatedEmail", settingState.designatedEmail || "");
    setSaveSub(settingState.saveSubmission || false);
    setUpdateSettingToggle(false);
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
  }, [navigation, initialized]);
  return (
    <View style={styles.container}>
      {initialized && !updateSettingToggle ? (
        <ScrollView>
          <View style={styles.settingForm}>
            <Text style={styles.settingInfoText}>
              API Url: <Text style={styles.settingInfoTitle}>{settingState.apiUrl}</Text>
            </Text>
            <Text style={styles.settingInfoText}>
              API Token: <Text style={styles.settingInfoTitle}>{settingState.apiToken?.replace(/[\w\W]/g, "*")}</Text>
            </Text>
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
              Save Submission: <Text style={styles.settingInfoTitle}>{saveSub ? "True" : "False"}</Text>
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
          <Pressable
            style={styles.submissionButton}
            onPress={() => {
              navigation.navigate("Submissions");
            }}
          >
            <Text style={[styles.defaultText, { fontWeight: "bold" }]}>Previous Submissions</Text>
          </Pressable>
        </ScrollView>
      ) : isSubmitting ? (
        <LoadingView />
      ) : (
        <ScrollView>
          <View style={styles.settingForm}>
            <FormInputField control={control} name="apiUrl" label="API Url" error={errors?.apiUrl} keyboardType="url" />
            <FormInputField control={control} name="apiToken" label="API Token" error={errors?.apiToken} secureTextEntry={true} />
            <HorizontalRule />
            <FormInputField control={control} name="host" label="Host" error={errors?.host} />
            <FormInputField control={control} name="email" label="Email" error={errors?.email} keyboardType="email-address" />
            <FormInputField control={control} name="password" label="Password" error={errors?.password} secureTextEntry={true} />
            <HorizontalRule />
            <FormInputField
              control={control}
              name="designatedEmail"
              label="Designated Email"
              error={errors?.designatedEmail}
              keyboardType="email-address"
            />
            <View style={styles.saveSubCont}>
              <Switch
                trackColor={{ false: "#767577", true: colors.darkBlue }}
                thumbColor={saveSub ? colors.lightBlue : colors.amber}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setSaveSub(!saveSub)}
                value={saveSub}
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
        </ScrollView>
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
    rowGap: 30,
    minWidth: "100%",
    borderWidth: 2,
    borderColor: colors.white,
    paddingHorizontal: 25,
    paddingVertical: 20,
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
