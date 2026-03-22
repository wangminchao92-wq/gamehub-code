import React from 'react';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, excerpt, image, author, date, readTime }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-40 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{excerpt}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{author}</span>
          <div className="flex items-center space-x-2">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;