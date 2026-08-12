export interface Movie {
    id: number;
    title: string;
    titleEn: string;
    year: number;
    genres: string[];
    posterUrl: string;
    description: string;
    country: string;
}

export interface RecommendedMovie {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    release_date: string;
}