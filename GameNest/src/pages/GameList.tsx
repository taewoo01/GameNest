import { Search } from 'lucide-react';
import { useState, useEffect } from 'react'
import GameCard from '../components/common/GameCard';
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'

function GameList() {
  type Game = {
    id: number;
    game_title: string;
    game_thumbnail: string;
  };

  const [game, setGames] = useState<Game[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortedGames, setSortedGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axiosInstance.get('/game/list');
        setGames(res.data);
        setSortedGames(res.data);
      } catch (err) {
        console.error("❌ 게임 목록 불러오기 실패:", err);
        setError("게임 목록 불러오기 실패");
      }
    };

    fetchGames();
  }, []);

  // 🔍 검색 핸들러
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSortedGames(game); // 검색어 없으면 전체
    } else {
      const filtered = game.filter((g) =>
        g.game_title.toLowerCase().includes(value.toLowerCase())
      );
      setSortedGames(filtered);
    }
  };

  const toggleFilter = () => setShowFilter(!showFilter);

  const fetchSortedGames = async (sortType: string) => {
    try {
      const res = await axiosInstance.get(`/game/list?sort=${sortType}`);
      setSortedGames(res.data);
      setShowFilter(false);
    } catch (err) {
      console.error("❌ 게임 목록 불러오기 실패:", err);
      setError("게임 목록 불러오기 실패");
    }
  };

  const sortByDate = () => fetchSortedGames('date');
  const sortByLikes = () => fetchSortedGames('likes');
  const sortByRating = () => fetchSortedGames('rating');
  const sortByTitle = () => fetchSortedGames('title');
  const sortById = () => fetchSortedGames('id');

  return (
    <div className="bg-black min-h-screen">
      <div className="cards-section">
        <div className="header-row flex justify-between items-center mb-4 px-4">
          <h2 className="title text-2xl font-bold text-white">모든 게임들</h2>
            <div className="flex items-center gap-3">
            {/* 검색창 */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-md">
              <Search size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="게임 검색..."
                value={searchTerm}
                onChange={handleSearch}
                className="outline-none bg-transparent text-sm w-96 q text-black"
              />
            </div>

            {/* 필터 버튼 */}
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
                    { label: '🔢 기본', action: sortById, color: 'hover:bg-green-100' },
                    { label: '📅 날짜순', action: sortByDate, color: 'hover:bg-blue-100' },
                    { label: '❤️ 찜순', action: sortByLikes, color: 'hover:bg-pink-100' },
                    { label: '⭐ 별점순', action: sortByRating, color: 'hover:bg-yellow-100' },
                    { label: '🔤 제목순', action: sortByTitle, color: 'hover:bg-purple-100' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 cursor-pointer transition ${item.color}`}
                      onClick={item.action}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 게임 카드들 */}
        <div className="card-grid flex flex-wrap gap-8 justify-start px-4 py-8">
          {sortedGames.map((game) => (
            <Link
              to={`/game/${game.id}`}
              key={game.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
              className="transform transition-transform hover:scale-105"
            >
              <GameCard
                title={game.game_title}
                thumbnail={game.game_thumbnail}
              />
            </Link>
          ))}
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* 필터 열릴 때 애니메이션 */}
      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideDown {
            animation: slideDown 0.2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

export default GameList;
