const baseurl = "https://api.themoviedb.org/3";
const apikey = "5080cc62760a871965429917413a6b31";


export interface SearchResponse {
    total_results: number,
    results: SearchResult[]
}

export interface SearchResult {
    poster_path: string
}

export type PosterSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";


export async function fetchCoverUrl(name: string, size: PosterSize): Promise<string> {
    let res = await search(name);
    return getPosterUrl(size, res.poster_path);
}

export async function search(query: string) {
    const fn = "/search/multi?";
    let encodedQuery = encodeURIComponent(query);
    let request = baseurl + fn + getApiKey() + "&include_adult=false&query=" + encodedQuery;

    let resposne: SearchResponse = await (await fetch(request)).json();

    if (resposne.total_results > 0) {
        return resposne.results[0];
    }
}

export function getPosterUrl(size: PosterSize, poster_path: string) {
    return "https://image.tmdb.org/t/p/" + size + poster_path;
}

function getApiKey() {
    return "api_key=" + apikey;
}


