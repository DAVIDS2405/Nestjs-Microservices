import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MS_HOST: string;
  PRODUCTS_MS_PORT: number;
  // DATABASE_URL: string;
}

const envSchemas = joi
  .object({
    PORT: joi.number().required(),
    PRODUCTS_MS_HOST: joi.string().required(),
    PRODUCTS_MS_PORT: joi.number().required(),
    // DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchemas.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  products_ms_port: envVars.PRODUCTS_MS_PORT,
  products_ms_host: envVars.PRODUCTS_MS_HOST,
  // databaseUrl: envVars.DATABASE_URL,
};
