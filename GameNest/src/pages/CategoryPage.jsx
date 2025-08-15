import React from "react";
import { useParams, Link } from "react-router-dom";
import games from "../data/games";
import GameCard from "../components/GameCard";

const CategoryPage = () => {
    const { categoryType, categoryValue } = useParams();

    const keyMap = {
        genre: "genre",
        theme: "theme",
        platform: "platform",
        play: "playType",
        flow: "progressType",
    };

    const key = keyMap[categoryType];

    if (!key) {
        return <p>잘못된 카테고리입니다.</p>;
    }

    const filteredGames = games.filter((game) => {
        const value = game[key];
        if (!value) return false;
        if (Array.isArray(value)) return value.includes(categoryValue);
        return value === categoryValue;
    });

    return (
        <div>
            <h2>{`카테고리: ${categoryValue}`}</h2>

            {/* .game-list 를 Tailwind로 재현 */}
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] gap-4 p-5">
                {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                        <Link
                            key={game.id}
                            to={`/game/${game.id}`}
                            className="no-underline [color:inherit]"
                        >
                            <GameCard
                                title={game.game_title}
                                image={game.game_thumbnail}
                            />
                        </Link>
                    ))
                ) : (
                    <p>해당 카테고리에 게임이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
