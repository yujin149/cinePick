export type Genre =
    | "action"
    | "comedy"
    | "drama"
    | "romance"
    | "thriller"
    | "sf"
    | "fantasy"
    | "animation";

export interface Movie {
    id: number;
    title: string;
    titleEn: string;
    year: number;
    genres: Genre[];
    posterUrl: string;
    description: string;
    country: string;
}