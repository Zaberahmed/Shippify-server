import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

const config = {
    PORT: process.env.PORT as string,
    DB_NAME: process.env.DB_NAME as string,
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    JWT_KEY: process.env.JWT_KEY as string,
    REDIS_URL: process.env.REDIS_URL as string,
    MAIL_USER: process.env.MAIL_USER as string,
    MAIL_PASS: process.env.MAIL_PASS as string,
}

export default config;