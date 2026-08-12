import type { Movie, RecommendedMovie } from "../types/movie";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

// 장르명과 ID를 연결하는 객체를 추가
export const genreIdMap: Record<string, number> = {
    "액션": 28,
    "모험": 12,
    "애니메이션": 16,
    "코미디": 35,
    "범죄": 80,
    "다큐멘터리": 99,
    "드라마": 18,
    "가족": 10751,
    "판타지": 14,
    "역사": 36,
    "공포": 27,
    "음악": 10402,
    "미스터리": 9648,
    "로맨스": 10749,
    "SF": 878,
    "TV 영화": 10770,
    "스릴러": 53,
    "전쟁": 10752,
    "서부": 37,
};

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

// 추천 영화 api 함수 만들기
export const getRecommendedMovies = async (
    genreIds: number[]
): Promise<RecommendedMovie[]> => {
    const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?` +
        `language=ko-KR` +
        `&include_adult=false` +
        `&sort_by=popularity.desc` +
        `&primary_release_date.gte=2012-01-01` +    // 개봉연도 2012년부터 지정
        //`&certification.lte=15` +                   // 연령 등급 필터링
        `&vote_count.gte=200` +                     // 최소 200명 이상이 평가한 영화만
        `&vote_average.gte=6` +                     // 평균 평점 6점 이상인 영화만
        `&with_genres=${genreIds.join("|")}`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                accept: "application/json",
            },
        }
    );

    const data = await response.json();

    return data.results;
};