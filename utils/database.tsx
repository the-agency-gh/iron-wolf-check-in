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
            email TEXT NOT NULL,
            phoneNumber TEXT NOT NULL,
            dataOfBirth DATE NOT NULL,
            profileUri TEXT NOT NULL,
            photoIdUri TEXT NOT NULL,
            pdfUri TEXT NOT NULL,
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
            host TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            designatedEmail TEXT NOT NULL,
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
export interface SubmissionProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dataOfBirth: Date;
  profileUri: string;
  photoIdUri: string;
  pdfUri: string;
}
export function addSubmissions({ firstName, lastName, email, phoneNumber, dataOfBirth, profileUri, photoIdUri, pdfUri }: SubmissionProps) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO submissions (firstName, lastName, email, phoneNumber, dataOfBirth, profileUri, photoIdUri, pdfUri) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [firstName, lastName, email, phoneNumber, dataOfBirth.toString(), profileUri, photoIdUri, pdfUri],
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
export function deleteSubmission(id: string) {
  return new Promise(async (resolve, reject) => {
    const selected = (await retrieveSubmission(id)) as SubmissionProps;
    database.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM submissions WHERE id = ?",
        [id],
        async (_, result) => {
          const deleteProfilePicture = deleteAsync(selected.profileUri);
          const deleteLicensePicture = deleteAsync(selected.photoIdUri);
          const deletePdf = deleteAsync(selected.pdfUri);
          await Promise.all([deleteProfilePicture, deleteLicensePicture, deletePdf]);
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
export function retrieveSubmissions() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM submissions",
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}
export function retrieveSubmission(id: string) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM submissions WHERE id = ?",
        [id],
        (_, result) => {
          const data = result.rows._array[0];
          resolve(data);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}
// settings query
export interface SettingProps {
  host: string;
  email: string;
  password: string;
  designatedEmail: string;
  saveSubmission: 0 | 1;
}
export function addSetting({ host, email, password, designatedEmail, saveSubmission = 0 }: SettingProps) {
  return new Promise(async (resolve, reject) => {
    const currentSetting = await retrieveSetting();
    if (currentSetting) {
      reject("setting already exits! Please Request Update Instead.");
      return;
    }
    database.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO settings (host, email, password, designatedEmail, saveSubmission) VALUES(?, ?, ?, ?, ?)",
        [host, email, password, designatedEmail, saveSubmission ? 1 : 0],
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
export async function updateSetting({ host, email, password, designatedEmail, saveSubmission = 0 }: SettingProps) {
  await resetSetting();
  return addSetting({ host, email, password, designatedEmail, saveSubmission });
}
export function resetSetting() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM settings",
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
