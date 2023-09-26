import mongoose from "mongoose";
import config from "./config";
import redis from "./app/services/services.redis";
import app from "./app";
import os from 'os';

const networkInterfaces = os.networkInterfaces();
const wifiServerIP = networkInterfaces['Wi-Fi']?.[1]?.address;

async function databaseConnection() {
    try {
        console.clear();
        // database connection
        await mongoose.connect(`mongodb://localhost:27017/${config.DB_NAME}`);
        //  await mongoose.connect(`mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0.yz2oh.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`);
        console.log("database connect successfully", config.DB_NAME);

        // redis connection
        await redis.connect();

        app.listen(config.PORT, () => {
            console.log(`Server is listening on port ${config.PORT} open with`)
            console.log(`---------------- http://localhost:${config.PORT}/ -----------------`);
            console.log(`---------------- http://127.0.0.1:${config.PORT}/ -----------------`);
            console.log(`---------------- http://${wifiServerIP}:${config.PORT}/ -----------------`)
        })
    } catch (error) {
        console.log("not possible to connect");
        console.error(error);
    }
}
databaseConnection();