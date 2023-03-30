import { create } from "zustand";
import { addSubmissions, SubmissionProps } from "./database";

interface FormAction {
  updateState: (data: SubmissionProps) => void;
  handleAddSubmission: () => Promise<unknown>;
}
//var yyyyMMdd = date.toISOString().slice(0,10);
//   var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
// var yyyyMMdd = date.toLocaleDateString('en-US', options).replace(/\//g, '-');
//sqlite date for mat in string yyyy-MM-dd HH:mm:ss
const initialState: SubmissionProps = {
  firstName: "",
  lastName: "",
  birthDate: new Date(),
  email: "",
  phoneNumber: "",
  profileUri: "",
  licenseUri: "",
  pdfUri: "",
};

export const useFormStore = create<SubmissionProps & FormAction>((set, get) => ({
  ...initialState,
  updateState: (data: SubmissionProps) =>
    set(() => ({
      ...data,
    })),
  resetState: () => {
    set(initialState);
  },
  handleAddSubmission: () => {
    return addSubmissions(get());
  },
}));
