import { FC, createContext } from "react";

export const SettingsContext = createContext({});

const SettingContextProvider: FC = () => {
  const value = {};
  return <SettingsContext.Provider value={value}></SettingsContext.Provider>;
};
