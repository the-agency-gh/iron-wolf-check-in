import { FC, createContext } from "react";
import { retrieveSetting } from "./database";

export const SettingsContext = createContext({});

const SettingContextProvider: FC = () => {
  const value = {};
  return <SettingsContext.Provider value={value}></SettingsContext.Provider>;
};

export default SettingContextProvider;
