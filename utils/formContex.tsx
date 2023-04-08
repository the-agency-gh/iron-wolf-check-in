import axios from "axios";
import { create } from "zustand";
import { addSubmissions, SubmissionProps, SettingsProps } from "./database";

type Base64 = { profileBase64: string; photoIdBase64: string };
export type StateType = {
  formState: Partial<SubmissionProps & Base64>;
  settingState: Partial<SettingsProps>;
};

export interface FormAction {
  updateFormState: (data: Partial<SubmissionProps & Base64>) => void;
  updateSettingState: (data: Partial<SettingsProps>) => void;
  resetFormState: () => void;
  // addSubmission: () => Promise<unknown>;
  addSubmissionsPromise: (pdfBase64: string) => void;
}

//var yyyyMMdd = date.toISOString().slice(0,10);
//var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
// var yyyyMMdd = date.toLocaleDateString('en-US', options).replace(/\//g, '-');
//sqlite date for mat in string yyyy-MM-dd HH:mm:ss

const initialState: StateType = {
  formState: {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    phoneNumber: undefined,
    dataOfBirth: undefined,
    profileUri: undefined,
    profileBase64: undefined,
    photoIdUri: undefined,
    photoIdBase64: undefined,
    pdfUri: undefined,
  },
  settingState: {
    host: undefined,
    email: undefined,
    password: undefined,
    designatedEmail: undefined,
    saveSubmission: 0,
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
    set({ ...initialState });
  },
  addSubmissionsPromise: async () => {
    const { formState, settingState } = get();
    await axios;
    // return addSubmissions(get());
  },
}));
