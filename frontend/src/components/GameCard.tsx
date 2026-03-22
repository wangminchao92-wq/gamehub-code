import React from 'react';

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  rating: number;
  platform: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, image, rating, platform }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1 font-medium">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">{platform}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;