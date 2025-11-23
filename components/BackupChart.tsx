
import React from 'react';
import { ExternalLink, BarChart2, LineChart, Layers } from 'lucide-react';

interface BackupChartProps {
  symbol: string;
}

const BackupChart: React.FC<BackupChartProps> = ({ symbol }) => {
  const externalLinks = [
    {
      name: 'WantGoo 玩股網',
      description: '專業技術線圖與籌碼分析',
      url: `https://www.wantgoo.com/stock/${symbol}/technical-chart`,
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-700',
      icon: <BarChart2 className="w-6 h-6" />
    },
    {
      name: 'GoodInfo 股市資訊',
      description: 'K線圖與詳細法人買賣超',
      url: `https://goodinfo.tw/tw/ShowK_Chart.asp?STOCK_ID=${symbol}`,
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
      icon: <LineChart className="w-6 h-6" />
    },
    {
      name: 'Yahoo 奇摩股市',
      description: '即時走勢與互動技術分析',
      url: `https://tw.stock.yahoo.com/quote/${symbol}.TW/technical-analysis`,
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
      icon: <Layers className="w-6 h-6" />
    }
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-6 bg-gray-600 rounded-full"></span>
          備用技術線圖與外部資源
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          若上方圖表無法正常顯示，請點擊下方按鈕開啟外部專業網站查詢。
        </p>
      </div>

      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {externalLinks.map((link, idx) => (
            <a 
              key={idx}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 group shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 ${link.color}`}
            >
              <div className="bg-white/80 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                 {link.icon}
              </div>
              <div className="text-center">
                <div className="font-bold text-lg mb-1">{link.name}</div>
                <div className="text-xs opacity-80 mb-3">{link.description}</div>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium opacity-90 group-hover:opacity-100">
                前往查看 <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackupChart;
