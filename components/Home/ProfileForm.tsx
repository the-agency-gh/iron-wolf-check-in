import { FC } from "react";
import { useForm } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";
import FormInputField from "../FormInputField";
interface ProfileFormProps {}

const ProfileForm: FC<ProfileFormProps> = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm();
  return (
    <View style={styles.container}>
      <View style={styles.nameCont}>
        <FormInputField
          style={styles.nameInput}
          control={control}
          name="firstName"
          label="First Name"
          error={errors?.firstName}
          placeholder="Iron"
        />
        <FormInputField
          style={styles.nameInput}
          control={control}
          name="lastName"
          label="Last Name"
          error={errors?.lastName}
          placeholder="Wolf"
        />
      </View>
      <FormInputField control={control} name="email" label="Email" error={errors?.email} placeholder="email@email.com" />
      <FormInputField control={control} name="phoneNumber" label="Phone Number" error={errors?.phoneNumber} placeholder="000-000-0000" />
    </View>
  );
};

export default ProfileForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    rowGap: 40,
  },
  nameCont: {
    flexDirection: "row",
    columnGap: 35,
  },
  nameInput: {
    flex: 1,
  },
});
