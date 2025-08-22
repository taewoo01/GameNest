import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GameCard from "../components/common/GameCard";
import axiosInstance from "../axiosInstance";

interface Game {
  id: number;
  game_title: string;
  game_thumbnail: string;
}

const LikedGames = () => {
  const [likedGames, setLikedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedGames = async () => {
      try {
        // 1. 토큰 가져오기
        const token = localStorage.getItem("token");
        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // 2. 찜한 게임 목록 요청 (토큰 헤더 포함)
        const likesRes = await axiosInstance.get("/game/likes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLikedGames(likesRes.data);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("로그인이 필요합니다.");
        } else {
          setError("찜한 게임을 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLikedGames();
  }, []);

  if (loading) return <p className="text-white">불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">찜한 게임들</h2>
        <Link to="/" className="text-sm underline text-gray-300 hover:text-white">
          ← 메인으로
        </Link>
      </div>

      {likedGames.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {likedGames.map((game) => (
            <Link
              to={`/game/${game.id}`}
              key={game.id}
              className="transform transition-transform hover:scale-105"
            >
              <GameCard
                title={game.game_title}
                thumbnail={game.game_thumbnail}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center mt-10 text-gray-400">
          찜한 게임이 없습니다.
        </p>
      )}
    </div>
  );
}

export default LikedGames;