import React from "react";
import { Link } from "react-router-dom";
import { baseGames } from "../pages/GameList";
import GameCard from "../components/common/GameCard";

const games = baseGames.map((game, index) => ({ id: index + 1, ...game }));

const LikedGames = () => {
    const likedGames = games.filter((game) => game.isLiked);

    return (
        <div className="cards-section p-4">
            <div className="header-row flex items-center justify-between mb-4">
                <h2 className="title text-xl font-bold text-white">
                    찜한 게임들
                </h2>
                <Link to="/" className="text-sm underline">
                    ← 메인으로
                </Link>
            </div>

            {likedGames.length > 0 ? (
                <div className="card-grid flex flex-wrap gap-5">
                    {likedGames.map((game) => (
                        <Link
                            to={`/game/${game.id}`}
                            key={game.id}
                            className="no-underline text-white"
                        >
                            <GameCard title={game.title} image={game.image} />
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center mt-10">찜한 게임이 없습니다.</p>
            )}
        </div>
    );
};

export default LikedGames;
