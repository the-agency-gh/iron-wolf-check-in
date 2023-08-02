import * as dotenv from "dotenv";
dotenv.config();

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      API_TOKEN: process.env.API_TOKEN,
      API_URL: process.env.API_URL,
      HOST_ADDRESS: process.env.HOST_ADDRESS,
      SENDER_EMAIL: process.env.SENDER_EMAIL,
      SENDER_PASSWORD: process.env.SENDER_PASSWORD,
      eas: {
        projectId: "68c10eb8-03cd-4d7e-b0dd-c2f9f84f9603",
      },
    },
  };
};
