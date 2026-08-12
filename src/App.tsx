import {useState, useEffect, useRef} from "react";
import MovieCard from "./components/MovieCard";
import CustomTooltip from "./components/CustomTooltip";
import {movieTitles } from "./data/movies";
import type{Movie} from "./types/movie";
import { getMovie } from "./api/tmdb";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";


function App() {
    // 포스터 로딩 상태
    const [isLoading, setIsLoading] = useState(true);


    // 현재 라운드 후보
    const [candidates, setCandidates] = useState<Movie[]>([]);

    // 현재 대결에서 첫 번째 영화의 index
    const [currentIndex, setCurrentIndex] = useState(0);

    const firstMovie = candidates[currentIndex];
    const secondMovie = candidates[currentIndex + 1];

    // 가장 최근에 선택한 영화 저장
    //const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // 선택했던 영화들을 전부 저장
    const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);

    // 현재 라운드의 승자들을 저장
    const [winners, setWinners] = useState<Movie[]>([]);

    // 장르별 횟수를 저장
    const [genreCount, setGenreCount] = useState<Record<string, number>>({});

    // 최종 우승 영화
    const [champion, setChampion] = useState<Movie | null>(null);

    // 차트 툴팁 hover 좌표
    const [tooltipPosition, setTooltipPosition] = useState<{
        x: number;
        y: number;
        side: "left" | "right";
    } | null>(null);

    // 차트 DOM 위치를 확인하기 위한 ref
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPosters = async () => {
            const updatedMovies = await Promise.all(
                movieTitles.map((title) => getMovie(title))
            );

            console.log("포스터 추가된 영화:", updatedMovies);
            setCandidates(updatedMovies);

            // 포스터 로딩 완료
            setIsLoading(false);
        };

        // TMDB 영화 데이터 테스트
        const testMovie = async () => {
            const movie = await getMovie("인터스텔라");

            console.log("TMDB에서 가져온 영화:", movie);
        };

        loadPosters();
        testMovie();
    }, []);

    const selectMovie = (movie: Movie) => {
        // setSelectedMovie(movie);

        // 선택할 때마다 배열에 추가
        const newSelectedMovies = [...selectedMovies, movie];
        setSelectedMovies(newSelectedMovies);

        console.log("선택 기록:", newSelectedMovies);

        // 이번 대결의 승자를 현재 라운드 승자 배열에 추가
        const newWinners = [...winners, movie];
        setWinners(newWinners);

        // 후보가 2개라면 결승전이므로 선택한 영화를 최종 우승자로 저장
        if(candidates.length === 2){
            setChampion(movie);

            const newGenreCount: Record<string, number> = {};

            newSelectedMovies.forEach((selectedMovie) => {
                selectedMovie.genres.forEach((genre) => {
                    newGenreCount[genre] = (newGenreCount[genre] || 0) + 1;
                });
            });

            setGenreCount(newGenreCount);

            console.log("장르별 선택 횟수:", newGenreCount);

            return;
        }

        // 현재 라운드가 끝났다면 승자들로 다음 라운드 시작
        if (currentIndex + 2 >= candidates.length) {
            setCandidates(newWinners);
            setWinners([]);
            setCurrentIndex(0);
            return;
        }

        // 같은 라운드의 다음 대결로 이동
        setCurrentIndex(currentIndex + 2);
    };

    // 장르별 횟수의 합계를 구하기
    const totalGenreCount = Object.values(genreCount).reduce(
        (sum, count) => sum + count,
        0
    );

    // 차트에 넣을 데이터 배열
    const genreChartData = Object.entries(genreCount)
        .map(([genre, count]) => {
            const percentage = Math.round(
                (count / totalGenreCount) * 100
            );

            return {
                genre,
                percentage,
            };
        })
        .sort((a, b) => b.percentage - a.percentage);

    // 장르 갯수에 따른 차트 높이
    const chartHeight = Math.max(360, genreChartData.length * 45);

    return (
        <>
            <div className="titleWrap">
                <h1>CINE PICK</h1>
                <p>영화 월드컵으로 알아보는 나의 영화 취향</p>
            </div>

            {isLoading ? (
                <p className="loadTxt">영화를 불러오는 중...</p>
            ):(
                champion ?
                    (
                        <div className="winnerMovie">
                            <h2>🏆{champion.title}</h2>

                            <div className="movieChart">
                                <div style={{ width: "100%", height: `${chartHeight}px`}} ref={chartRef}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={genreChartData}
                                            layout="vertical"
                                            barCategoryGap="15%"
                                            onMouseMove={(state) => {
                                                if (!state?.activeCoordinate) {
                                                    return;
                                                }

                                                const rect = chartRef.current?.getBoundingClientRect();

                                                if (!rect) {
                                                    return;
                                                }

                                                const tooltipWidth = 140;
                                                const offset = 12;

                                                // 차트 내부에서의 마우스 위치
                                                const mouseX = state.activeCoordinate.x;
                                                const mouseY = state.activeCoordinate.y;

                                                // 브라우저 화면 기준 마우스 X 위치
                                                const browserX = rect.left + mouseX;

                                                // 오른쪽에 툴팁을 놓았을 때 화면을 벗어나는지 확인
                                                const shouldShowLeft =
                                                    browserX + tooltipWidth + offset > window.innerWidth;

                                                setTooltipPosition({
                                                    x: shouldShowLeft
                                                        ? mouseX - tooltipWidth - offset
                                                        : mouseX + offset,

                                                    y: mouseY,

                                                    side: shouldShowLeft ? "left" : "right",
                                                });
                                            }}
                                            onMouseLeave={() => {
                                                setTooltipPosition(null);
                                            }}
                                        >
                                            <XAxis
                                                type="number"
                                                domain={[0, 100]}
                                                unit="%"
                                                tick={{ fill: "#64748b", fontSize: 14 }}
                                                axisLine={{ stroke: "#cbd5e1" }}
                                                tickLine={{ stroke: "#cbd5e1" }}
                                            />

                                            <YAxis
                                                type="category"
                                                dataKey="genre"
                                                interval={0}
                                                tick={{ fill: "#64748b", fontSize: 14 }}
                                                axisLine={{ stroke: "#cbd5e1" }}
                                                tickLine={false}
                                                width={80}
                                            />

                                            <Tooltip
                                                content={
                                                    <CustomTooltip
                                                        side={tooltipPosition?.side ?? "right"}
                                                    />
                                                }
                                                cursor={{ fill: "#eff6ff" }}
                                                position={
                                                    tooltipPosition
                                                        ? {
                                                            x: tooltipPosition.x,
                                                            y: tooltipPosition.y - 35,
                                                        }
                                                        : undefined
                                                }
                                            />

                                            <Bar
                                                dataKey="percentage"
                                                fill="#bfdbfe"
                                                activeBar={{ fill: "#2563eb" }}
                                                radius={[0, 5, 5, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    ):(
                        <div className="movieSelectWrap">
                            <MovieCard
                                movie={firstMovie}
                                onSelect={selectMovie}
                            />

                            <p className="vs">VS</p>

                            <MovieCard
                                movie={secondMovie}
                                onSelect={selectMovie}
                            />

                            {/*
                            {
                                selectedMovie&& (<p>선택한 영화 :{selectedMovie.title} </p>)
                            }
                            */}

                        </div>
                    )

            )}
        </>
    );
}

export default App;