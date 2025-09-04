import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import StarRatingModal from '../components/modals/StarRatingModal';
import axiosInstance from '../axiosInstance';
import Comments from '../components/comments/comments';

interface JwtPayload {
  id: number;
  user_id?: string;
}

interface Game {
  game_title: string;
  game_thumbnail: string;
  game_media: string | string[];
  game_release_date: string;
  game_developer: string;
  game_platforms: string | string[];
  game_modes: string | string[];
  game_tags: string | string[];
  game_description: string;
  game_story: string;
}

// JWT 디코딩
function base64UrlDecode(str: string) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const getUserIdFromToken = (): number | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return decodeJwtPayload(token)?.id ?? null;
  };

  // 게임 상세정보 불러오기
  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const userId = getUserIdFromToken();
      const queryUserId = userId ? `?user_id=${userId}` : '';

      const res = await axiosInstance.get(`/game/${id}/detail${queryUserId}`);
      const data = res.data;

      setGame(data.game);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
      setUserRating(data.myRating);
      setAverageRating(data.averageRating);
    } catch (err: any) {
      console.error(err);
      setError('게임 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleRatingSubmit = async (rating: number) => {
    const userId = getUserIdFromToken();
    if (!userId) return alert('로그인 후 별점을 등록할 수 있습니다.');

    try {
      await axiosInstance.post(`/game/${id}/rating`, { user_id: userId, rating });
      setShowModal(false);
      fetchDetail();
    } catch (err) {
      console.error('별점 등록 실패:', err);
      alert('별점 등록에 실패했습니다.');
    }
  };

  const toggleLike = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return alert('로그인 후 찜하기를 이용할 수 있습니다.');

    const prevLiked = liked;
    const prevCount = likeCount;

    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await axiosInstance.post(`/game/${id}/like`, { user_id: userId });
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const uniqueValues = (value: string | string[]): string =>
    [...new Set(Array.isArray(value) ? value : [value])].join(', ');

  // 미디어 처리
  let mediaUrls: string[] | null = null;
  if (typeof game?.game_media === 'string') {
    try {
      mediaUrls = JSON.parse(game.game_media);
    } catch {
      mediaUrls = [game.game_media];
    }
  } else {
    mediaUrls = game?.game_media || null;
  }
  const videoUrl = Array.isArray(mediaUrls) && mediaUrls.length > 0 ? mediaUrls[0] : null;

  if (loading) return <div className="text-center text-white">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!game) return <div className="text-center text-white">게임을 찾을 수 없습니다.</div>;

  return (
    <div className="bg-black text-white max-w-4xl mx-auto p-5 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{game.game_title}</h1>

      <div className="relative w-full max-h-[400px] overflow-hidden rounded-lg mb-6">
        <img
          src={game.game_thumbnail}
          alt={game.game_title}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-3">게임 영상</h2>
      <ReactPlayer
        url={videoUrl || 'https://www.youtube.com/watch?v=O4eG3lgrS2I'}
        width="100%"
        height="360px"
        controls
        className="mb-6"
      />

      <table className="w-full border-collapse mb-6">
        <tbody>
          <tr>
            <td className="p-2 font-bold">출시일</td>
            <td className="p-2">{game.game_release_date}</td>
          </tr>
          {/* ✅ 개발사 개별 클릭 */}
          <tr>
            <td className="p-2 font-bold">개발사</td>
            <td className="p-2">
              {Array.isArray(game.game_developer) ? (
                game.game_developer.map((dev, idx) => (
                  <span
                    key={idx}
                    className="text-sky-400 cursor-pointer hover:underline mr-2"
                    onClick={() => navigate(`/category/developer/${encodeURIComponent(dev)}`)}
                  >
                    {dev}
                  </span>
                ))
              ) : (
                <span
                  className="text-sky-400 cursor-pointer hover:underline"
                  onClick={() => navigate(`/category/developer/${encodeURIComponent(game.game_developer)}`)}
                >
                  {game.game_developer}
                </span>
              )}
            </td>
          </tr>

          {/* ✅ 플랫폼 개별 클릭 */}
          <tr>
            <td className="p-2 font-bold">플랫폼</td>
            <td className="p-2 flex flex-wrap gap-2">
              {(Array.isArray(game.game_platforms) ? game.game_platforms : [game.game_platforms]).map(
                (platform, idx) =>
                  platform && (
                    <span
                      key={idx}
                      className="text-sky-400 cursor-pointer hover:underline"
                      onClick={() => navigate(`/category/platform/${encodeURIComponent(platform)}`)}
                    >
                      {platform}
                    </span>
                  )
              )}
            </td>
          </tr>

          {/* ✅ 플레이 방식 개별 클릭 */}
          <tr>
            <td className="p-2 font-bold">플레이 방식</td>
            <td className="p-2 flex flex-wrap gap-2">
              {(Array.isArray(game.game_modes) ? game.game_modes : [game.game_modes]).map(
                (mode, idx) =>
                  mode && (
                    <span
                      key={idx}
                      className="text-sky-400 cursor-pointer hover:underline"
                      onClick={() => navigate(`/category/mode/${encodeURIComponent(mode)}`)}
                    >
                      {mode}
                    </span>
                  )
              )}
            </td>
          </tr>

          {/* ✅ 태그 개별 클릭 */}
          <tr>
            <td className="p-2 font-bold">태그</td>
            <td className="p-2 flex flex-wrap gap-2">
              {(Array.isArray(game.game_tags) ? game.game_tags : [game.game_tags]).map(
                (tag, idx) =>
                  tag && (
                    <span
                      key={idx}
                      className="text-sky-400 cursor-pointer hover:underline"
                      onClick={() => navigate(`/category/tag/${encodeURIComponent(tag)}`)}
                    >
                      {tag}
                    </span>
                  )
              )}
            </td>
          </tr>

          <tr>
            <td className="p-2 cursor-pointer" onClick={() => setShowModal(true)}>
              <strong>⭐ 별점:</strong>{' '}
              {userRating
                ? `내 별점: ${userRating}.0 | 전체 평균: ${averageRating.toFixed(1)} / 5.0`
                : `전체 평균: ${averageRating.toFixed(1)} / 5.0`}
            </td>
            <td className="p-2 flex items-center gap-3">
              <button
                onClick={toggleLike}
                className={`px-3 py-1 rounded text-sm font-bold transition ${
                  liked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {liked ? '❤️ 찜 해제' : '🤍 찜하기'}
              </button>
              <span>
                <strong>🔥 좋아요 수:</strong> {likeCount}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">게임 소개</h2>
        <p className="mt-2">{game.game_description || '게임 소개가 없습니다.'}</p>

        <h2 className="text-2xl font-semibold mt-6">게임 설명</h2>
        <p className="mt-2">{game.game_story || '게임 설명이 없습니다.'}</p>
      </div>

      {showModal && (
        <StarRatingModal onClose={() => setShowModal(false)} onSubmit={handleRatingSubmit} />
      )}

      {/* ✅ 댓글 컴포넌트 */}
      <Comments type="game" id={id!} loggedUserId={getUserIdFromToken()} />
    </div>
  );
};

export default GameDetail;
