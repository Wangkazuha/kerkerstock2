
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, loading }) => {
  const [input, setInput] = useState('2330');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">台</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
            台股 AI <span className="text-indigo-600">分析助手</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入股票代碼 (如 2330, 2317)..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              disabled={loading}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </form>

        <div className="flex items-center gap-4">
           <span className="text-xs text-gray-500 hidden md:block">由 Gemini 2.5 提供技術支援</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
