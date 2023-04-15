import axios from "axios";
import { create } from "zustand";
import Constants from "expo-constants";
import { addSubmissions, SubmissionProps, SettingsProps } from "./database";
import { deleteAsync, getInfoAsync, FileInfo } from "expo-file-system";

const ENVVARIABLES = Constants.expoConfig?.extra;

type Base64 = { profileBase64: string; photoIdBase64: string };
export type StateType = {
  formState: Partial<SubmissionProps & Base64>;
  settingState: Partial<SettingsProps>;
};

export interface FormAction {
  updateFormState: (data: Partial<SubmissionProps & Base64>) => void;
  updateSettingState: (data: Partial<SettingsProps>) => void;
  resetFormState: () => void;
  addSubmissionsPromise: (pdfUri: string, pdfBase64: string) => Promise<unknown>;
}

//var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
// var yyyyMMdd = date.toLocaleDateString('en-US', options).replace(/\//g, '-');
//sqlite date for mat in string yyyy-MM-dd HH:mm:ss

const initialState: StateType = {
  formState: {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    phoneNumber: undefined,
    dateOfBirth: undefined,
    cash: true,
    memberName: "",
    profileUri: undefined,
    profileBase64: undefined,
    photoIdUri: undefined,
    photoIdBase64: undefined,
  },
  settingState: {
    apiUrl: ENVVARIABLES?.API_URL || undefined,
    apiToken: ENVVARIABLES?.API_TOKEN || undefined,
    host: undefined,
    email: undefined,
    password: undefined,
    designatedEmail: undefined,
    saveSubmission: false,
  },
};

export const useGlobalStore = create<StateType & FormAction>((set, get) => ({
  ...initialState,
  updateFormState: (data: Partial<SubmissionProps & Base64>) =>
    set((state) => ({
      formState: {
        ...state.formState,
        ...data,
      },
    })),
  updateSettingState: (data: Partial<SettingsProps>) =>
    set((state) => ({
      settingState: {
        ...state.settingState,
        ...data,
      },
    })),
  resetFormState: () => {
    set({ formState: { ...initialState.formState } });
  },
  addSubmissionsPromise: async (pdfUri, pdfBase64) => {
    const { formState, settingState } = get();
    if (!settingState.apiUrl || !settingState.apiToken) return;
    const { firstName, lastName, email, phoneNumber, dateOfBirth, cash, memberName, profileBase64, photoIdBase64, profileUri, photoIdUri } =
      formState as SubmissionProps & Base64;
    const stringDate = dateOfBirth.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    //--------add to sqlite db
    if (!settingState.saveSubmission) {
      try {
        deleteAsync(formState.profileUri as string);
        deleteAsync(formState.photoIdUri as string);
        deleteAsync(pdfUri as string);
      } catch (err) {
        console.error(err);
      }
    } else {
      addSubmissions({
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth,
        cash,
        memberName,
        profileUri,
        photoIdUri,
        pdfUri,
      });
    }
    //--------add to sqlite db
    const totalFileSize = (
      await Promise.all([
        getInfoAsync(profileUri, { size: true }),
        getInfoAsync(photoIdUri, { size: true }),
        getInfoAsync(pdfUri, { size: true }),
      ])
    )
      .map((f: { [rest: string]: any }) => f.size)
      .reduce((a: number, b: number) => a + b);

    const postBody = {
      host: settingState.host,
      email: settingState.email,
      password: settingState.password,
      designatedEmail: settingState.designatedEmail,
      clientInfo: {
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth: stringDate,
        cash,
        memberName,
        profileBase64: totalFileSize < 1_000_000 ? profileBase64 : "",
        photoIdBase64: totalFileSize < 1_000_000 ? photoIdBase64 : "",
        pdfBase64,
      },
    };

    const postConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${settingState.apiToken}`,
      },
    };
    //------- send request
    try {
      return await axios.post(settingState.apiUrl, postBody, postConfig);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      return { data: { status: "failed" } };
    }
  },
}));
