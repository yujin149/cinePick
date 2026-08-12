import type {Movie} from "../types/movie";

interface MovieCardProps {
    movie:Movie;
    onSelect: (movie: Movie) => void;
}

function MovieCard({ movie, onSelect }:MovieCardProps){
    return(
        <button onClick={() => onSelect(movie)} className="movieCard">
            {movie.posterUrl && (
                <img
                    src={movie.posterUrl}
                    alt={`${movie.title} 포스터`}
                    width="80"
                />
            )}

            <div className="movieInfo">
                <h2 className="title">{movie.title}</h2>
                <ul className="list">
                    <li className="titleEn">{movie.titleEn}</li>
                    <li className="year">{movie.year}</li>
                </ul>
                <p className="description">{movie.description}</p>
            </div>
        </button>
    )
}

export default MovieCard;