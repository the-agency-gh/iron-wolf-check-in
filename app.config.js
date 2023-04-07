import * as dotenv from "dotenv";
dotenv.config();

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      API_TOKEN: process.env.API_TOKEN,
    },
  };
};
