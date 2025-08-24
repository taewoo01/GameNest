import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import GameCard from "../components/common/GameCard";

interface Game {
  id: number;
  game_title: string;
  game_thumbnail: string;
}

const validTypes = ["platform", "mode", "tag"];

export default function CategoryPage() {
  const { type, value } = useParams<{ type: string; value: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [sortedGames, setSortedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!type || !value) return;
    if (!validTypes.includes(type)) {
      setError("잘못된 카테고리 타입입니다.");
      setGames([]);
      setSortedGames([]);
      setLoading(false);
      return;
    }

    const decodedValue = decodeURIComponent(value);
    setLoading(true);
    setError(null);

    axiosInstance
      .get(`/game/category/${type}/${decodedValue}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setGames(res.data);
          setSortedGames(res.data);
        } else {
          console.warn("Unexpected response data:", res.data);
          setGames([]);
          setSortedGames([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("게임을 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => setLoading(false));
  }, [type, value]);

  const toggleFilter = () => setShowFilter((prev) => !prev);

  // 정렬 함수들
  const sortById = () => {
    const sorted = [...games].sort((a, b) => a.id - b.id);
    setSortedGames(sorted);
  };

  const sortByTitle = () => {
    const sorted = [...games].sort((a, b) =>
      a.game_title.localeCompare(b.game_title, "ko")
    );
    setSortedGames(sorted);
  };

  const sortByDate = () => {
    const sorted = [...games].sort((a, b) => b.id - a.id);
    setSortedGames(sorted);
  };

  const sortByLikes = async () => {
    try {
      const res = await axiosInstance.get(`/game/category/${type}/${value}?sort=likes`);
      setSortedGames(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sortByRating = async () => {
    try {
      const res = await axiosInstance.get(`/game/category/${type}/${value}?sort=rating`);
      setSortedGames(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-white">불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="title text-2xl font-bold text-white">
          {decodeURIComponent(value ?? "")} 게임
        </h2>
        <div className="filter-wrapper relative">
          <button
            className="filter-button px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={toggleFilter}
          >
            필터
          </button>
          {showFilter && (
            <div className="filter-modal absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideDown z-20">
              {[
                { label: "🔢 기본", action: sortById, color: "hover:bg-green-100" },
                { label: "📅 날짜순", action: sortByDate, color: "hover:bg-blue-100" },
                { label: "❤️ 찜순", action: sortByLikes, color: "hover:bg-pink-100" },
                { label: "⭐ 별점순", action: sortByRating, color: "hover:bg-yellow-100" },
                { label: "🔤 제목순", action: sortByTitle, color: "hover:bg-purple-100" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 cursor-pointer transition ${item.color}`}
                  onClick={() => {
                    item.action();
                    setShowFilter(false);
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {sortedGames.length > 0 ? (
        <div className="card-grid flex flex-wrap gap-8 justify-start py-8">
          {sortedGames.map((game) => (
            <Link
              to={`/game/${game.id}`}
              key={game.id}
              className="transform transition-transform hover:scale-105"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <GameCard
                title={game.game_title}
                thumbnail={game.game_thumbnail}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p>게임이 없습니다.</p>
      )}
    </div>
  );
}
