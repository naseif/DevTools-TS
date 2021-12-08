const fetch = require("node-fetch");
const jikanjs = require("jikanjs");
jikanjs.settings.setBaseURL("https://api.jikan.moe/v3", 3);

class APIs {

    protected ShowID: string | undefined;
    protected MovieID: string | undefined;

    /**
     * Gets the Show ID from TheMovieDB
     * @param {string} query 
     * @param {string} key 
     * @returns {string} the Show ID
     */

    private async getShowID(query: string, key: string): Promise<any> {
        try {
            const req = await fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&query=${query}`
            );
            const res: any = await req.json();
            return this.ShowID = res.results[0].id
        } catch (err) {
            throw err;

        }
    }

    /**
     * Gets a Show Info from TheMovieDB
     * @param query 
     * @param key 
     * @returns {object} ShowInfo
     */

    async getShowDetails(query: string, key: string): Promise<any> {
        try {
            await this.getShowID(query, key)
            const req = await fetch(
                `https://api.themoviedb.org/3/tv/${this.ShowID}?api_key=${key}&language=en-US`
            );
            const res = await req.json();
            return res;
        } catch (err) {
            console.error(err)
        }
    }


    /**
     * Gets an Anime Info from MyAnimeList
     * @param {string} query 
     * @param {string} type 
     * @returns {object}
     */

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


    /**
     * Gets a Movie ID from TheMovieDB
     * @param {string} query 
     * @param {string | number} year 
     * @param {string} key 
     * @returns {string} The Movie ID
     */

    private async getMovieID(query: string, key: string): Promise<string> {
        try {
            const req = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${query}`
            );
            const res: any = await req.json();
            if (!res.total_results)
                throw new Error(`${"Nothing found with this name!"}`);

            return this.MovieID = res.results[0].id;
        } catch (err) {
            throw err;
        }
    }


    /**
     * Gets a Movie Info from TheMovieDB
     * @param {string} query 
     * @param {string | number} year 
     * @param {string} key 
     * @returns {object} MovieInfo
     */

    async getMovieDetails(query: string, key: string): Promise<{}> {
        try {
            await this.getMovieID(query, key)
            const req = await fetch(
                `https://api.themoviedb.org/3/movie/${this.MovieID}?api_key=${key}&language=en-US`
            );
            const res: any = await req.json();
            return res;
        } catch (err) {
            throw err;
        }
    }
}
export { APIs }