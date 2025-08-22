import { useState } from 'react';

interface StarRatingModalProps {
  onClose: () => void;
  onSubmit: (rating: number) => void | Promise<void>;
}

const StarRatingModal: React.FC<StarRatingModalProps> = ({ onClose, onSubmit }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    if (!selectedRating) {
      alert('별점을 선택해주세요.');
      return;
    }
    onSubmit(selectedRating);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[999]">
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg w-72 text-center text-white">
        <h2 className="text-lg font-bold mb-4">별점을 남겨주세요</h2>

        <div className="text-4xl mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer transition-colors duration-200 ${
                (hoverRating || selectedRating) >= star
                  ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]'
                  : 'text-gray-400'
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleClick(star)}
              aria-label={`${star}점 별`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(star);
                }
              }}
            >
              ★
            </span>
          ))}
        </div>

        <div className="flex justify-between gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600"
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white text-sm ${
              selectedRating
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-blue-300/40 cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={!selectedRating}
            type="button"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarRatingModal;
