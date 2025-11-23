

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StockChart from './components/StockChart';
import BackupChart from './components/BackupChart';
import NewsCard from './components/NewsCard';
import FinancialMetric from './components/FinancialMetric';
import RevenueCard from './components/RevenueCard';
import CompanyInfoCard from './components/CompanyInfoCard';
import InstitutionalCard from './components/InstitutionalCard';
import ApiResourcesCard from './components/ApiResourcesCard'; 
import { analyzeStock } from './services/geminiService';
import { fetchFinMindData } from './services/finMindService';
import { StockData, FinMindCombinedData } from './types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity, 
  BarChart3, 
  FileText,
  AlertCircle,
  Briefcase,
  Database
} from 'lucide-react';

const App: React.FC = () => {
  const [stockCode, setStockCode] = useState('2330');
  const [data, setData] = useState<StockData | null>(null);
  const [finMindData, setFinMindData] = useState<FinMindCombinedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (code: string) => {
    setStockCode(code);
    setLoading(true);
    setError(null);
    setFinMindData([]); 

    try {
      const [result, finData] = await Promise.all([
        analyzeStock(code),
        fetchFinMindData(code)
      ]);
      
      setData(result);
      setFinMindData(finData);

    } catch (err) {
      setError("無法獲取完整數據，請檢查網路或股票代碼。");
      console.error(err);
      // Even on error, if we have partial data, keep it? 
      // For now, allow retry.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('2330');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safe safe access for render
  const isPositive = data ? (data.change.includes('+') || (parseFloat(data.change || '0') > 0)) : false;
  const trendColor = isPositive ? 'text-red-500' : 'text-green-500';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header onSearch={handleSearch} loading={loading} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
             <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
             <p className="text-gray-500 font-medium animate-pulse">正在分析 {stockCode} 市場數據...</p>
          </div>
        ) : data ? (
          <div className="flex flex-col gap-8">
            
            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Chart */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-3xl font-bold text-gray-900">{data.symbol}</h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                            {data.sector}
                          </span>
                          <span className="px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 text-xs">
                            {data.market === 'OTC' ? '上櫃' : '上市'}
                          </span>
                        </div>
                        <h3 className="text-xl text-gray-500 mt-1">{data.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-bold tracking-tight flex items-center justify-end gap-2 ${trendColor}`}>
                          {data.price}
                          <TrendIcon className="w-8 h-8" />
                        </div>
                        <div className={`text-lg font-medium mt-1 ${trendColor}`}>
                          {data.change} ({data.changePercent})
                        </div>
                        <div className="text-sm text-gray-400 mt-1">更新: {data.updateTime}</div>
                      </div>
                    </div>
                 </div>

                 <StockChart 
                    symbol={data.symbol} 
                    market={data.market} 
                    data={finMindData}
                    loading={loading}
                 />
                 
                 <BackupChart symbol={data.symbol} />
              </div>

              {/* Right Column: Info & Metrics */}
              <div className="flex flex-col gap-6">
                 <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-lg">
                      <Activity className="w-5 h-5 text-gray-600" />
                      AI 市場分析觀點
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed text-justify">
                      {data.aiSummary}
                    </p>
                 </div>

                 <CompanyInfoCard symbol={data.symbol} />

                 <div className="grid grid-cols-2 gap-4">
                    <FinancialMetric 
                      label="本益比 (P/E)" 
                      value={data.peRatio || 'N/A'} 
                      icon={<PieChart className="w-4 h-4" />}
                    />
                    <FinancialMetric 
                      label="淨值比 (P/B)" 
                      value={data.pbRatio || 'N/A'} 
                      icon={<Briefcase className="w-4 h-4" />}
                    />
                    <FinancialMetric 
                      label="殖利率" 
                      value={data.dividendYield || 'N/A'} 
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                    <FinancialMetric 
                      label="EPS" 
                      value={data.eps || 'N/A'} 
                      icon={<BarChart3 className="w-4 h-4" />}
                    />
                 </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-8">
                {/* Institutional Table */}
                <div className="w-full">
                  <InstitutionalCard data={finMindData} loading={loading} />
                </div>

                {/* Revenue Chart */}
                <div className="w-full">
                  <RevenueCard 
                    revenueHistory={data.revenueHistory}
                    marginHistory={data.marginHistory}
                  />
                </div>

                {/* News & Resources */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <NewsCard news={data.news} />
                    <ApiResourcesCard
                      title="MOPS 詳細財報"
                      icon={<FileText className="w-5 h-5 text-indigo-600" />}
                      resources={[
                        {
                          name: `合併綜合損益表 (${data.symbol})`,
                          description: "查詢季度合併綜合損益表與財務指標。",
                          url: `https://mops.twse.com.tw/mops/#/web/t164sb04?dataType=2&companyId=${data.symbol}&year=113&season=3&subsidiaryCompanyId=`
                        }
                      ]}
                    />
                  </div>

                  <div className="space-y-6">
                    <ApiResourcesCard
                      title="TWSE 盤後資訊"
                      icon={<Database className="w-5 h-5 text-indigo-600" />}
                      resources={[
                        {
                          name: "每日收盤行情",
                          description: "證交所每日收盤後公布的詳細個股行情表。",
                          url: "https://www.twse.com.tw/zh/trading/historical/mi-index.html"
                        },
                        {
                          name: "外資買賣超彙總",
                          description: "外資及陸資買賣超彙總表。",
                          url: "https://www.twse.com.tw/zh/trading/foreign/bfi82u.html"
                        }
                      ]}
                    />

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                       <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          更多來源
                       </h3>
                       <ul className="space-y-3">
                         <li>
                            <a href={`https://www.wantgoo.com/stock/${data.symbol}/technical-chart`} target="_blank" rel="noreferrer" className="text-base text-indigo-600 hover:underline">
                               WantGoo 玩股網
                            </a>
                         </li>
                         <li>
                            <a href={`https://goodinfo.tw/tw/ShowK_Chart.asp?STOCK_ID=${data.symbol}`} target="_blank" rel="noreferrer" className="text-base text-indigo-600 hover:underline">
                               GoodInfo 股市資訊網
                            </a>
                         </li>
                       </ul>
                    </div>
                  </div>
                </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-300">請輸入台股代碼 (例如: 2330)</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
