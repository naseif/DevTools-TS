import mongoose from 'mongoose';
import chalk from "chalk";
import moment from 'moment'

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

}
export { Utils }