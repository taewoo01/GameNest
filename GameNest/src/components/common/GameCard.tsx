interface GameCardProps {
  title: string;
  thumbnail: string;
}

const GameCard = ({ title, thumbnail }: GameCardProps) => {
  return (
    <div className="w-[180px] flex flex-col items-center text-center bg-black rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-200">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-[150px] object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.png'; // 기본 이미지
        }}
      />
      <h3 className="mt-2 font-bold text-white text-sm truncate" title={title}>
        {title}
      </h3>
    </div>
  );
};

export default GameCard;
