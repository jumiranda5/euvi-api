import dotenv from 'dotenv';
dotenv.config();

/*eslint no-process-env: 0*/
const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
let ENV;

console.log(`environment: ${environment}`);

if (environment === "development") {
  ENV = process.env.ENVIRONMENT_DEV;
}
else {
  ENV = process.env.ENVIRONMENT_PROD;
}

const config = {

  PORT,
  ENV

};

export default config;
