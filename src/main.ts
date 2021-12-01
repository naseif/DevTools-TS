
import fetch from "node-fetch";

export default class TypeScriptDevTools {


    /**
     * Chunks a single string into multiple multiple strings
     * @param {string} str the string
     * @param {number} size chunk by length
     * @returns Array containing the chunked strings
     */

    chunkSubString(str: string, size: number): string[] {
        const numChunks = Math.ceil(str.length / size);
        const chunks = new Array(numChunks);

        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
            chunks[i] = str.substr(o, size);
        }

        return chunks;
    }

    /**
     * A simple random password generator
     * @param {number} length 
     * @returns string
     */

    RandomPasswordGenerator(length: number): string {
        const validCharacters =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890?!$";
        const maximalLength = length;
        let result = "";

        for (let i = 0; i < maximalLength; i++) {
            const randomNumber = Math.floor(Math.random() * validCharacters.length);
            result += validCharacters[randomNumber];
        }

        return result;
    }


    /**
     * Simple function that creates multiple random passwords
     * @param {number} howMany number of passwords to generate
     * @param {number} passwordlength length of the password
     * @returns str[] of random passwords
     */

    GenerateABunchOfRandomPasswords(howMany: number, passwordlength: number): string[] {
        let result = [];

        for (let i = 0; i < howMany; i++) {
            result.push(this.RandomPasswordGenerator(passwordlength));
        }

        return result;
    }


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