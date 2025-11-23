
import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';

interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
}

interface NewsCardProps {
  news: NewsItem[];
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            最新個股新聞
        </h3>
        <span className="text-xs font-normal text-gray-500 px-3 py-1 bg-gray-100 rounded-full">近 15 則</span>
      </div>
      
      <div className="space-y-4">
        {news.length === 0 ? (
            <p className="text-lg text-gray-500">暫無最新新聞。</p>
        ) : (
            news.map((item, index) => (
            <div key={index} className="group">
                <a href={item.url || '#'} target="_blank" rel="noreferrer" className="block">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                    {/* Reverted to standard size text-base (1x) as requested */}
                    <h4 className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {item.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{item.source}</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                        </span>
                    </div>
                    </div>
                    {item.url && <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 mt-1" />}
                </div>
                </a>
                {index < news.length - 1 && <div className="h-px bg-gray-100 mt-4" />}
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NewsCard;
