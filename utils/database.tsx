import * as SQLite from "expo-sqlite";
import { deleteAsync } from "expo-file-system";

const database = SQLite.openDatabase("iron_wolf");

//initialize tables
export function initializeTable() {
  const submissionsTable = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            profileUri TEXT NOT NULL,
            licenseUri TEXT NOT NULL,
            formUri TEXT NOT NULL,
            submissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
  const settingsTable = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY NOT NULL,
            email TEXT NOT NULL,
            saveSubmission BOOLEAN DEFAULT FALSE
        )`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
  return Promise.all([submissionsTable, settingsTable]);
}

//submissions query

// settings query
interface SettingProps {
  id?: number;
  email?: string;
  saveSubmission?: boolean;
}
export function addSetting({ email, saveSubmission = false }: SettingProps) {
  return new Promise(async (resolve, reject) => {
    const currentSetting = await retrieveSetting();
    if (currentSetting) {
      reject("setting already exits! Please Request Update Instead.");
      return;
    }
    database.transaction((tx) => {
      tx.executeSql(
        "INTER INTO setting (email, saveSubmission) VALUES(?, ?)",
        [email || "", saveSubmission ? 1 : 0],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}
export function updateSetting({ email, saveSubmission }: SettingProps) {
  return new Promise(async (resolve, reject) => {
    const currentSetting = (await retrieveSetting()) as SettingProps;
    if (currentSetting) {
      reject("There is no setting to update.");
    }
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE settings SET email=?,saveSubmission=? WHERE id=?`,
        [email || "", saveSubmission ? 1 : 0, currentSetting.id || ""],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}
export function resetSetting() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "DROP FROM setting",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}
export function retrieveSetting() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM settings LIMIT ?",
        [1],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}
