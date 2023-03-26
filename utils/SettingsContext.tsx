import { FC, createContext, ReactNode, useState, useEffect } from "react";
import { retrieveSetting, addSetting, updateSetting, SettingProps } from "./database";

interface SettingContextProps {
  children: ReactNode;
}

export const SettingContext = createContext({
  initialized: false,
  email: "",
  password: "",
  saveSubmission: false,
  initializeSetting: ({ email, password, saveSubmission }: SettingProps) => {},
  updatingSetting: ({ email, password, saveSubmission }: SettingProps) => {},
});

const SettingContextProvider: FC<SettingContextProps> = ({ children }) => {
  const [settingStatus, setSettingStatus] = useState({
    initialized: true,
    email: "",
    password: "",
    saveSubmission: false,
  });
  useEffect(() => {
    (async () => {
      const initSetting = (await retrieveSetting()) as SettingProps | undefined;
      setSettingStatus((curr) => ({
        ...curr,
        initialized: !!initSetting,
        email: initSetting?.email || curr.email,
        password: initSetting?.password || curr.password,
        saveSubmission: initSetting?.saveSubmission || curr.saveSubmission,
      }));
    })();
  }, []);
  const initializeSetting = ({ email, password, saveSubmission = false }: SettingProps) => {
    if (settingStatus.initialized) return "Setting Already Exists";
    return addSetting({ email, password, saveSubmission });
  };
  const updatingSetting = ({
    email = settingStatus.email,
    password = settingStatus.password,
    saveSubmission = settingStatus.saveSubmission,
  }: SettingProps) => {
    return updateSetting({ email, password, saveSubmission });
  };
  const value = {
    ...settingStatus,
    initializeSetting,
    updatingSetting,
  };
  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>;
};

export default SettingContextProvider;
