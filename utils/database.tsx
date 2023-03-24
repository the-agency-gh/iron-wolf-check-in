import * as SQLite from "expo-sqlite";
import { deleteAsync } from "expo-file-system";

const database = SQLite.openDatabase("iron_wolf");

//initialize tables
export const initializeTable = () => {
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

  return Promise.all([submissionsTable]);
};
