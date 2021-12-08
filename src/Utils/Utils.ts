import mongoose from 'mongoose';
import chalk from "chalk";
import moment from 'moment'
const fetch = require("node-fetch");

class Utils {

    /**
 * Logger for the console
 * @param {string} message Error Message
 * @param {string} type Error Or Log 
 * @returns void
 */

    logger(message: string, type: string = "log"): void {
        const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;

        switch (type) {
            case "log":
                return console.log(
                    `[${chalk.gray(date)}]: [${chalk.black.bgGreen(
                        type.toUpperCase()
                    )}] ${message}`
                );
            case "error":
                return console.log(
                    `[${chalk.gray(date)}]: [${chalk.black.bgRed(
                        type.toUpperCase()
                    )}] ${message}`
                );
            default:
                throw new TypeError("Logger type must be either log or error!");
        }
    }

    connectToDataBase(mongourl: string): void {
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4,
            useUnifiedTopology: true,
        };
        mongoose.connect(mongourl, dbOptions);
        mongoose.Promise = global.Promise;
        mongoose.connection.on("connected", () => {
            this.logger("[DB] DATABASE CONNECTED");
        });
        mongoose.connection.on("err", (err) => {
            this.logger(`Mongoose connection error: \n ${err.stack}`, "error");
        });
        mongoose.connection.on("disconnected", () => {
            this.logger("Mongoose disconnected", "error");

        }
        )
    };

    /**
 * Simple function to perform GET Requests
 * @param {string} url the link 
 * @param {object} options node-fetch additional options
 * @returns JSON
 */

    async request(url: string, options: {} = {}): Promise<any> {
        try {
            const request = await fetch(url, options);
            const responseToJson = await request.json();
            return responseToJson;
        } catch (err) {
            throw err;
        }
    }
}
export { Utils }