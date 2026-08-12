const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export const searchMovie = async (query: string) => {
    const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko-KR`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                accept: "application/json",
            },
        }
    );

    const data = await response.json();

    console.log("TMDB 검색 결과:", data);

    return data;
};

export const getPosterUrl = async (query: string) => {
    const data = await searchMovie(query);

    const posterPath = data.results[0]?.poster_path;

    if (!posterPath) {
        return "";
    }

    return `https://image.tmdb.org/t/p/w500${posterPath}`;
};