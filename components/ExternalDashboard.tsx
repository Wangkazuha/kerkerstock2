
import React from 'react';
import { ExternalLink, LayoutDashboard } from 'lucide-react';

interface ExternalDashboardProps {
  title: string;
  url: string;
  height?: string;
  description?: string;
}

const ExternalDashboard: React.FC<ExternalDashboardProps> = ({ title, url, height = "h-[600px]", description }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            {title}
          </h3>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors flex items-center gap-1 shadow-sm"
        >
          全螢幕開啟 <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className={`w-full ${height} bg-gray-100 relative group`}>
        {/* Hint for user if iframe doesn't load */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-0">
           <div className="text-center p-4">
             <p>正在載入外部圖表...</p>
             <p className="text-xs mt-2">若無法顯示，請點擊右上方按鈕開啟</p>
           </div>
        </div>
        <iframe 
          src={url} 
          title={title}
          className="w-full h-full relative z-10 border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default ExternalDashboard;
