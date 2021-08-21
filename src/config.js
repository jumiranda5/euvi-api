import dotenv from 'dotenv';
dotenv.config();

/*eslint no-process-env: 0*/
const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
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
    graph_pass: process.env.AURA_PASS,
    graph_username: process.env.AURA_USERNAME,
    graph_uri: process.env.AURA_URI
  },
  CLIENT_ID: process.env.CLIENT_ID,
  TOKEN_SECRET: process.env.TOKEN_SECRET,

};

export default config;
