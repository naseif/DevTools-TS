import fetch from "node-fetch";
const jikanjs = require("jikanjs");
jikanjs.settings.setBaseURL("https://api.jikan.moe/v3", 3);

export default class APIs {

    protected ShowID: string | undefined;
    protected MovieID: string | undefined;

    private async getShowID(query: string, key: string): Promise<any> {
        try {
            const apiCall = await fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&page=1&query=${query}`
            );

            const convertResponeToJson: any = await apiCall.json();
            return this.ShowID = convertResponeToJson.results[0].id
        } catch (err) {
            throw err;

        }
    }

    async getShowDetails(query: string, key: string): Promise<any> {
        try {
            this.getShowID(query, key)
            const apiCall = await fetch(
                `https://api.themoviedb.org/3/tv/${this.ShowID}?api_key=${key}&language=en-US`
            );
            const convertRes = await apiCall.json();
            return convertRes;
        } catch (err) {
            throw err;
        }
    }


    async getAnimeInfo(query: string, type: string = "anime"): Promise<{}> {
        try {
            const getId = await jikanjs.search(type, query, [1]);
            const animeId = getId.results[0].mal_id;
            const getFullInfo = await jikanjs.loadAnime(animeId, "/");
            const genresArray = getFullInfo.genres.map((element: any) => element.name);

            return {
                malid: getFullInfo.mal_id,
                imageUrl: getFullInfo.image_url,
                titlerom: getFullInfo.title,
                titleeng: getFullInfo.title_english,
                episodes: getFullInfo.episodes,
                status: getFullInfo.status,
                rating: getFullInfo.rating,
                score: getFullInfo.score,
                rank: getFullInfo.rank,
                synopsis: getFullInfo.synopsis,
                premiered: getFullInfo.premiered,
                genres: genresArray,
                aired: getFullInfo.aired.string,
            };
        } catch (err) {
            throw err;
        }
    }


    private async getMovieID(query: string, year: string | number, key: string): Promise<string> {
        try {
            const apiCall = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${query}&page=1&include_adult=false&year=${year}`
            );
            const convertResponeToJson: any = await apiCall.json();
            if (!convertResponeToJson.total_results)
                throw new Error(`${"Nothing found with this name!"}`);

            return this.MovieID = convertResponeToJson.results[0].id;
        } catch (err) {
            throw err;
        }
    }



    async getDetails(query: string, year: string | number, key: string): Promise<{}> {
        try {
            this.getMovieID(query, year, key)
            const apiCall = await fetch(
                `https://api.themoviedb.org/3/movie/${this.MovieID}?api_key=${key}&language=en-US`
            );
            const convertRes: any = await apiCall.json();
            return convertRes;
        } catch (err) {
            throw err;
        }
    }







}