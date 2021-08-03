import dotenv from 'dotenv';
dotenv.config();

/*eslint no-process-env: 0*/
const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;
let ENV;

if (environment === "development") {
  ENV = process.env.ENVIRONMENT_DEV;
}
else {
  ENV = process.env.ENVIRONMENT_PROD;
}

const config = {

  PORT,
  ENV,
  DB : {
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    db_name: process.env.DB_NAME,
  },

};

export default config;