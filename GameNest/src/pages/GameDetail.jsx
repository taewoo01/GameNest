import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
import games from "../data/games";
import StarRatingModal from "../modals/StarRatingModal";
import ReactPlayer from "react-player";
import Comments from "../components/Comments";

const GameDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const game = games.find((g) => g.id === parseInt(id));
    const [showVideo, setShowVideo] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userRating, setUserRating] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    if (!game) return <div>게임을 찾을 수 없습니다.</div>;

    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            setComments([...comments, newComment.trim()]);
            setNewComment("");
        }
    };

    const uniqueValues = (value) =>
        [...new Set(Array.isArray(value) ? value : [value])].join(", ");

    const navigateToCategory = (type, value) => {
        if (value) {
            navigate(`/category/${type}/${value}`);
        }
    };

    return (
        <div className="game-detail-container w-full max-w-[800px] mx-auto p-5 box-border bg-black text-white">
            <h1 className="text-2xl font-bold mb-2 text-white">
                {game.game_title}
            </h1>

            {/* 대표 이미지/비디오 슬라이드 영역 */}
            <div className="relative w-full max-h-[400px] overflow-hidden rounded-lg">
                <img
                    src={game.game_thumbnail}
                    alt={game.game_title}
                    className={
                        "absolute inset-0 w-full h-full object-cover rounded-lg transition-transform duration-500 ease-in-out " +
                        (showVideo ? "translate-x-full" : "translate-x-0")
                    }
                />
                <video
                    src={game.video}
                    controls
                    className={
                        "absolute inset-0 w-full h-full rounded-lg transition-transform duration-500 ease-in-out " +
                        (showVideo
                            ? "block translate-x-0"
                            : "hidden -translate-x-full")
                    }
                />
            </div>

            {/* 게임 영상 (YouTube) */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2 text-white">
                    게임 영상
                </h2>
                <ReactPlayer
                    url="https://www.youtube.com/watch?v=O4eG3lgrS2I"
                    width="100%"
                    height="360px"
                    controls
                />
            </div>

            {/* 게임 이미지 */}
            <div className="mt-5">
                <h3 className="text-lg font-medium mb-2">게임 이미지</h3>
                <img
                    src={game.game_thumbnail}
                    alt={`${game.game_title} 이미지`}
                    className="w-full max-h-[220px] object-cover rounded-md border border-[#333]"
                />
            </div>

            <hr className="my-5 border-t border-[#555]" />

            {/* 정보 테이블 */}
            <table className="w-full border-collapse mb-8">
                <tbody>
                    <tr>
                        <td className="p-2 font-bold">출시일</td>
                        <td className="p-2">{game.game_release_date}</td>
                    </tr>
                    <tr>
                        <td className="p-2 font-bold">개발사</td>
                        <td className="p-2">{game.game_developer}</td>
                    </tr>
                    <tr>
                        <td className="p-2 font-bold">플랫폼</td>
                        <td
                            className="p-2 text-[#61dafb] cursor-pointer"
                            onClick={() =>
                                navigateToCategory("platform", game.platform)
                            }
                        >
                            {uniqueValues(game.platform || [])}
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2 font-bold">플레이 방식</td>
                        <td
                            className="p-2 text-[#61dafb] cursor-pointer"
                            onClick={() =>
                                navigateToCategory("play", game.playType)
                            }
                        >
                            {uniqueValues(game.playType || [])}
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2 font-bold">장르</td>
                        <td
                            className="p-2 text-[#61dafb] cursor-pointer"
                            onClick={() =>
                                navigateToCategory("genre", game.genre)
                            }
                        >
                            {game.genre || "정보 없음"}
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2 font-bold">테마</td>
                        <td
                            className="p-2 text-[#61dafb] cursor-pointer"
                            onClick={() =>
                                navigateToCategory("theme", game.theme)
                            }
                        >
                            {game.theme || "정보 없음"}
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2 font-bold">진행 방식</td>
                        <td
                            className="p-2 text-[#61dafb] cursor-pointer"
                            onClick={() =>
                                navigateToCategory("flow", game.progressType)
                            }
                        >
                            {game.progressType || "정보 없음"}
                        </td>
                    </tr>
                    <tr>
                        <td
                            className="p-2 cursor-pointer"
                            onClick={() => setShowModal(true)}
                        >
                            <strong>⭐ 별점:</strong>{" "}
                            {userRating ? `${userRating}.0 / 5.0` : "4.5 / 5.0"}
                        </td>
                        <td className="p-2">
                            <strong>🔥 좋아요 수:</strong> 1234
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* 소개/설명 */}
            <div className="desc-box">
                <h2 className="text-xl font-semibold text-white">게임 소개</h2>
                <p className="mt-2">
                    {game.game_description || "게임 소개가 없습니다."}
                </p>

                <h2 className="text-xl font-semibold mt-8 text-white">
                    게임 설명
                </h2>
                <p className="mt-2">
                    {game.game_story || "게임 설명이 없습니다."}
                </p>
            </div>

            {/* 댓글 */}
            <Comments />

            {/* 별점 모달 */}
            {showModal && (
                <StarRatingModal
                    onClose={() => setShowModal(false)}
                    onSubmit={(rating) => {
                        setUserRating(rating);
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default GameDetail;
