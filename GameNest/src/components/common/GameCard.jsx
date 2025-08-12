import React from "react";

function GameCard({ title, image }) {
    return (
        <div className="w-[150px] flex flex-col items-center text-center bg-black">
            <img
                src={image}
                alt={title}
                className="w-full h-[150px] object-cover rounded-lg"
            />
            <h3 className="mt-2 font-bold text-white">{title}</h3>
        </div>
    );
}

export default GameCard;
