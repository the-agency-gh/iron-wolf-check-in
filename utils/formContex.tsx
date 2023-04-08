import { create } from "zustand";
import { addSubmissions, SubmissionProps, retrieveSetting, SettingProps } from "./database";
export type StateType = { formState: Partial<SubmissionProps>; settingState: Partial<SettingProps> };

export interface FormAction {
  updateFormState: (data: Partial<SubmissionProps>) => void;
  updateSettingState: (data: Partial<SettingProps>) => void;
  resetFormState: () => void;
  // handleAddSubmission: () => Promise<unknown>;
  handleAddSubmission: (pdfBase64: string) => void;
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
    photoIdUri: undefined,
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
  updateFormState: (data: Partial<SubmissionProps>) =>
    set((state) => ({
      formState: {
        ...state.formState,
        ...data,
      },
    })),
  updateSettingState: (data: Partial<SettingProps>) =>
    set((state) => ({
      settingState: {
        ...state.settingState,
        ...data,
      },
    })),
  resetFormState: () => {
    set({ ...initialState });
  },
  handleAddSubmission: () => {
    console.log(get());
    // set((state) => ({
    //   ...initialState
    // }))
    // return addSubmissions(get());
  },
}));
