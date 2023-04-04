import { create } from "zustand";
import { addSubmissions, SubmissionProps } from "./database";
export type StateType = { formState: Partial<SubmissionProps> };
export interface FormAction {
  updateState: (data: StateType) => void;
  // handleAddSubmission: () => Promise<unknown>;
  handleAddSubmission: () => void;
  resetState: () => void;
}

//var yyyyMMdd = date.toISOString().slice(0,10);
//   var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
// var yyyyMMdd = date.toLocaleDateString('en-US', options).replace(/\//g, '-');
//sqlite date for mat in string yyyy-MM-dd HH:mm:ss

const initialState: StateType = {
  formState: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dataOfBirth: new Date(),
    profileUri: "",
    photoIdUri: "",
    pdfUri: "",
  },
};

export const useFormStore = create<StateType & FormAction>((set, get) => ({
  ...initialState,
  updateState: (data: StateType) =>
    set((state) => ({
      ...state.formState,
      ...data,
    })),
  resetState: () => {
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
