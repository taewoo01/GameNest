import React, { useState } from "react";

function StarRatingModal({ onClose, onSubmit }) {
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);

    const handleClick = (rating) => {
        setSelectedRating(rating);
    };

    return (
        <div className="modal-overlay fixed inset-0 w-full h-full bg-black/70 flex justify-center items-center z-[999]">
            <div className="modal bg-[#1a1a1a] p-6 rounded-[12px] shadow-[0_10px_25px_rgba(0,0,0,0.5)] w-[300px] text-center text-white">
                <h2 className="modal-title text-[20px] mb-4 font-bold text-white">
                    별점을 남겨주세요
                </h2>
                <div className="stars text-[36px] mb-4">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled =
                            (hoverRating || selectedRating) >= star;
                        return (
                            <span
                                key={star}
                                className={`star ${
                                    isFilled ? "filled" : ""
                                } cursor-pointer transition-colors duration-200 ${
                                    isFilled
                                        ? "text-[gold] [text-shadow:0_0_6px_rgba(255,215,0,0.7)]"
                                        : "text-gray-500"
                                }`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleClick(star)}
                            >
                                ★
                            </span>
                        );
                    })}
                </div>
                <div className="modal-buttons flex justify-between gap-[10px]">
                    <button
                        className="close-btn px-4 py-2 rounded-[8px] text-[14px] cursor-pointer bg-[#444] text-white border-0"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                    <button
                        className="submit-btn px-4 py-2 rounded-[8px] text-[14px] cursor-pointer bg-[#007bff] text-white border-0"
                        onClick={() => onSubmit(selectedRating)}
                    >
                        제출
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StarRatingModal;
