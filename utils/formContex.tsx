import { create } from "zustand";
import { addSubmissions, SubmissionProps } from "./database";

interface FormAction {
  handleAddSubmission: () => void;
}

//sqlite date for mat in string yyyy-MM-dd HH:mm:ss

export const useFormStore = create<SubmissionProps & FormAction>((set, get) => ({
  firstName: "",
  lastName: "",
  birthDate: new Date(),
  email: "",
  phoneNumber: "",
  profileUri: "",
  licenseUri: "",
  pdfUri: "",
  handleAddSubmission: () => {
    addSubmissions();
  },
}));
