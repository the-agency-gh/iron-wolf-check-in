import { FC, useState } from "react";
import { View, Text, TextInput, StyleSheet, useWindowDimensions, Pressable, Animated } from "react-native";
import { useForm, Controller } from "react-hook-form";
import FormButton from "./FormButton";
import { colors } from "../../styles/variables";
import { FieldValues } from "react-hook-form/dist/types";

type settingDataProp = { email: string; password: string; [rest: string]: string };
interface SettingsProps {
  onSubmit: (data: FieldValues) => void;
  onError: (error: FieldValues) => void;
  onUpdate: (data: FieldValues) => void;
  settingData: settingDataProp | unknown;
}

const ErrorMsg: FC<{ children: string }> = ({ children }) => {
  return (
    <Animated.View style={[styles.errorMsgCont]}>
      <Text style={[styles.errorMsg]}>{children}</Text>;
    </Animated.View>
  );
};

const Settings: FC<SettingsProps> = ({ onSubmit, onError, onUpdate, settingData }) => {
  const [settingStatus, setSettingStatus] = useState({
    initialized: !!settingData,
    update: false,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: settingData ? (settingData as settingDataProp).email : "",
      password: settingData ? (settingData as settingDataProp).password : "",
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
      {!(settingStatus.initialized && settingStatus.update) ? (
        <View style={styles.settingForm}>
          <View style={styles.inputCont}>
            <Text style={[styles.defaultText, styles.label]}>Email</Text>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please Type in Valid Email",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={[styles.input, styles.defaultText]} onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
            {errors.email && <Text style={[styles.errorMsg]}>{errors.email.message}</Text>}
          </View>
          <View style={styles.inputCont}>
            <Text style={[styles.defaultText, styles.label]}>Password</Text>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Passwword is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={[styles.input, styles.defaultText]} onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
            {errors.password && <Text style={[styles.errorMsg]}>{errors.password.message}</Text>}
          </View>
          <View style={styles.buttonCont}>
            <FormButton onPress={handleSubmit(onSubmit, onError)} style={styles.submitBtn}>
              <Text style={[styles.defaultText]}>{!settingStatus.initialized ? "Submit" : "Update"}</Text>
            </FormButton>
            <FormButton onPress={handleCancel} style={styles.cancelBtn}>
              <Text style={[styles.defaultText]}>Cancel</Text>
            </FormButton>
          </View>
        </View>
      ) : (
        <Pressable style={styles.settingForm} onPress={() => {}}>
          <Text>{(settingData as settingDataProp).email}</Text>
          <Text>{(settingData as settingDataProp).password}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {},
  settingForm: {
    padding: 10,
    alignItems: "center",
    minWidth: "50%",
    rowGap: 40,
  },
  defaultText: {
    color: colors.white,
    fontSize: 20,
  },
  inputCont: {
    position: "relative",
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 10,
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
  submitBtn: {},
  cancelBtn: {
    backgroundColor: colors.amber2,
  },
});
