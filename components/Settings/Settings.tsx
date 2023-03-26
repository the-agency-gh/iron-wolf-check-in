import { FC, useState } from "react";
import { View, Text, TextInput, StyleSheet, useWindowDimensions, Pressable, Animated } from "react-native";
import { useForm, Controller } from "react-hook-form";
import FormButton from "./FormButton";
import { colors } from "../../styles/variables";
import { FieldValues } from "react-hook-form/dist/types";
import LoadingView from "../LoadingView";

type settingDataProp = { email: string; password: string; [rest: string]: string };
interface SettingsProps {
  onSubmit: (data: FieldValues) => void;
  onError: (error: FieldValues) => void;
  settingData: settingDataProp | unknown;
}

const ErrorMsg: FC<{ children: string }> = ({ children }) => {
  return (
    <Animated.View style={[styles.errorMsgCont]}>
      <Text style={[styles.errorMsg]}>{children}</Text>;
    </Animated.View>
  );
};

const Settings: FC<SettingsProps> = ({ onSubmit, onError, settingData }) => {
  const [settingStatus, setSettingStatus] = useState({
    initialized: !!settingData,
    update: false,
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: (settingData as settingDataProp)?.email || "",
      password: (settingData as settingDataProp)?.password || "",
    },
  });
  const handleCancel = () => {
    setSettingStatus((curr) => ({
      ...curr,
      update: false,
    }));
  };
  return (
    <View style={styles.container}>
      <View style={styles.mainSettings}>
        {!(settingStatus.initialized && settingStatus.update) ? (
          !isSubmitting ? (
            <View style={styles.settingForm}>
              <View style={styles.inputCont}>
                <Text style={[styles.defaultText, styles.label]}>Email</Text>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    minLength: 8,
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please Type in Valid Email",
                    },
                  }}
                  render={({ field: { ref, onChange, ...fields } }) => (
                    <TextInput id="email" ref={ref} style={[styles.input, styles.defaultText]} {...fields} onChangeText={onChange} />
                  )}
                />
                {errors.email && <Text style={[styles.errorMsg]}>{errors.email.message as string}</Text>}
              </View>
              <View style={styles.inputCont}>
                <Text style={[styles.defaultText, styles.label]}>Password</Text>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field: { ref, onChange, ...fields } }) => (
                    <TextInput ref={ref} id="password" style={[styles.input, styles.defaultText]} {...fields} onChangeText={onChange} />
                  )}
                />
                {errors.password && <Text style={[styles.errorMsg]}>{errors.password.message as string}</Text>}
              </View>
              <View style={styles.buttonCont}>
                <FormButton onPress={handleSubmit(onSubmit, onError)} style={styles.submitBtn}>
                  <Text style={[styles.defaultText, styles.btnText]}>{!settingStatus.initialized ? "Register" : "Update"}</Text>
                </FormButton>
                {settingStatus.initialized && (
                  <FormButton onPress={handleCancel} style={styles.cancelBtn}>
                    <Text style={[styles.defaultText, styles.btnText]}>Cancel</Text>
                  </FormButton>
                )}
              </View>
            </View>
          ) : (
            <LoadingView />
          )
        ) : (
          <Pressable style={styles.settingForm} onPress={() => {}}>
            <Text>{(settingData as settingDataProp).email}</Text>
            <Text>{(settingData as settingDataProp).password}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainSettings: {
    borderWidth: 2,
    borderColor: colors.white,
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  settingForm: {
    minWidth: "100%",
    rowGap: 40,
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
  btnText: {
    fontWeight: "bold",
  },
  submitBtn: {},
  cancelBtn: {
    backgroundColor: colors.amber2,
  },
});
