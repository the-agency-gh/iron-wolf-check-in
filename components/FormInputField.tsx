import { FC } from "react";
import { View, Text, TextInput, StyleSheet, StyleProp } from "react-native";
import { colors } from "../styles/variables";
import { Control, Controller, FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { KeyboardTypeOptions } from "react-native/Libraries/Components/TextInput/TextInput";

interface FormInputFieldProps {
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  name: string;
  label: string;
  rules?: object;
  style?: StyleProp<any>;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

const FormInputField: FC<FormInputFieldProps> = ({
  style,
  control,
  error,
  name,
  label,
  rules,
  placeholder = "",
  keyboardType = "default",
}) => {
  return (
    <View style={[styles.inputCont, style]}>
      <Text style={[styles.defaultText, styles.label]}>{label}</Text>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value, ...fields } }) => (
          <TextInput
            id={name}
            style={[styles.defaultText, styles.input]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={"#777777"}
            keyboardType={keyboardType}
            {...fields}
          />
        )}
        name={name}
      />
      {error && <Text style={[styles.errorMsg]}>{error.message as string}</Text>}
    </View>
  );
};

export default FormInputField;

const styles = StyleSheet.create({
  inputCont: {
    position: "relative",
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 5,
    padding: 14,
  },
  label: {
    position: "absolute",
    fontWeight: "bold",
    textTransform: "uppercase",
    top: 0,
    left: 8,
    transform: [{ translateY: -14 }],
    backgroundColor: colors.baseBlack,
  },
  defaultText: {
    color: colors.white,
    fontSize: 18,
  },
  input: {
    fontSize: 22,
  },
  errorMsg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    color: colors.amber,
    fontSize: 16,
    transform: [{ translateY: 24 }],
  },
});
