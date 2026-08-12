import type { Movie } from "../types/movie";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export const searchMovie = async (query: string) => {
    const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&include_adult=false`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                accept: "application/json",
            },
        }
    );

    return await response.json();
};

export const getMovieDetail = async (movieId: number) => {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                accept: "application/json",
            },
        }
    );

    return await response.json();
};

export const getMovie = async (query: string): Promise<Movie> => {
    // 1. 영화 제목으로 검색
    const searchData = await searchMovie(query);

    const searchResult = searchData.results[0];

    // 2. 검색된 영화의 id로 상세 정보 요청
    const detail = await getMovieDetail(searchResult.id);

    // 3. 우리 Movie 타입으로 변환
    return {
        id: detail.id,
        title: detail.title,
        titleEn: detail.original_title,
        year: Number(detail.release_date.slice(0, 4)),
        genres: detail.genres.map(
            (genre: { id: number; name: string }) => genre.name
        ),
        posterUrl: detail.poster_path
            ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
            : "",
        description: detail.overview,
        country: detail.production_countries?.[0]?.iso_3166_1 ?? "",
    };
};

export const getPosterUrl = async (query: string) => {
    const data = await searchMovie(query);

    const posterPath = data.results[0]?.poster_path;

    if (!posterPath) {
        return "";
    }

    return `https://image.tmdb.org/t/p/w500${posterPath}`;
};