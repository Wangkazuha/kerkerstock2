
import React, { useMemo } from 'react';
import { ExternalLink, BarChart2 } from 'lucide-react';
import { FinMindCombinedData } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

interface StockChartProps {
  symbol: string; // e.g., "2330"
  market?: string; // "TWSE" or "OTC"
  data: FinMindCombinedData[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Attempt to find the price payload
    const pricePayload = payload.find((p: any) => p.dataKey === 'price');
    const pointData = pricePayload ? pricePayload.payload : (payload[0] ? payload[0].payload : null);

    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-gray-200 shadow-xl rounded-xl text-xs z-50 min-w-[150px]">
        <p className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1">{label}</p>
        
        {pointData && (
          <div className="mb-3">
             <div className="flex justify-between items-center gap-4">
               <span className="text-gray-500">收盤價:</span>
               <span className="text-red-600 font-bold font-mono text-base">{pointData.price}</span>
             </div>
             {/* If we have OHLC data, we can still show it in tooltip even if chart is just a line */}
             {(pointData.open > 0) && (
                 <div className="grid grid-cols-3 gap-2 mt-1 text-gray-400 text-[10px]">
                    <span>開 {pointData.open}</span>
                    <span>高 {pointData.high}</span>
                    <span>低 {pointData.low}</span>
                 </div>
             )}
          </div>
        )}

        <div className="space-y-1 pt-1 border-t border-gray-100">
          {payload.map((p: any, index: number) => {
             if (p.dataKey === 'price') return null;
             const value = p.value;
             let valueColor = 'text-gray-700';
             if (value > 0) valueColor = 'text-red-600';
             if (value < 0) valueColor = 'text-green-600';
             return (
              <div key={index} className="flex justify-between items-center gap-4">
                <span className="text-gray-600">{p.name}</span>
                <span className={`font-mono ${valueColor}`}>{value.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ symbol, market = "TWSE", data, loading }) => {
  const isOTC = market === "OTC" || market === "上櫃" || market === "TPEX";
  const yahooSuffix = isOTC ? ".TWO" : ".TW";
  const yahooUrl = `https://tw.stock.yahoo.com/quote/${symbol}${yahooSuffix}/technical-analysis`;

  // Safe Data Processing
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    // Reverse for display: Oldest (Left) -> Newest (Right)
    // Filter invalid price data to prevent crash
    const validData = [...data].reverse().filter(item => item.price > 0);

    return validData.map(item => ({
      date: item.date,
      foreign: Math.round(item.foreignBuy / 1000), 
      trust: Math.round(item.investmentTrustBuy / 1000),
      dealer: Math.round(item.dealerBuy / 1000),
      open: item.open,
      high: item.high,
      low: item.low,
      price: item.price // This is the Close price used for the Line
    }));
  }, [data]);

  // Safe Domain Calculation based on CLOSE PRICE only
  const priceDomain = useMemo(() => {
     if (chartData.length === 0) return ['auto', 'auto'];
     // Use close price for domain since we are drawing a line of close prices
     const prices = chartData.map(d => d.price).filter(n => !isNaN(n) && n > 0);
     
     if (prices.length === 0) return ['auto', 'auto'];

     const min = Math.min(...prices);
     const max = Math.max(...prices);
     const buffer = (max - min) * 0.1; 
     return [Math.floor(min - buffer), Math.ceil(max + buffer)];
  }, [chartData]);

  // Determine if we should show chart or fallback
  const showChart = !loading && chartData.length > 0;

  return (
    <div className="relative mt-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* HEADER: ALWAYS VISIBLE to ensure Yahoo button is accessible */}
      <div className="flex flex-wrap justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50 gap-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-800">法人買賣超 vs 收盤價</h3>
          </div>

          <a 
            href={yahooUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#400090] text-white rounded-full text-xs font-bold shadow-sm hover:bg-[#300070] transition-colors"
          >
             前往 Yahoo 技術分析
             <ExternalLink className="w-3 h-3" />
          </a>
      </div>
      
      {/* CHART CONTENT */}
      <div className="h-[400px] w-full p-2 relative bg-white">
        {loading && (
           <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 backdrop-blur-sm">
               <div className="text-indigo-600 font-medium animate-pulse">載入圖表數據中...</div>
           </div>
        )}

        {showChart ? (
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="gradForeign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradTrust" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradDealer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#b45309" stopOpacity={1} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                
                <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                    axisLine={false} 
                    tickLine={false}
                />

                <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: '#dc2626' }} 
                    axisLine={false} 
                    tickLine={false}
                    domain={priceDomain}
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                
                <ReferenceLine y={0} yAxisId="left" stroke="#e5e7eb" />

                <Bar yAxisId="left" dataKey="foreign" name="外資" fill="url(#gradForeign)" barSize={6} />
                <Bar yAxisId="left" dataKey="trust" name="投信" fill="url(#gradTrust)" barSize={6} />
                <Bar yAxisId="left" dataKey="dealer" name="自營" fill="url(#gradDealer)" barSize={6} />

                <Line 
                    yAxisId="right"
                    type="monotone"
                    dataKey="price" 
                    name="收盤價"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                />
                </ComposedChart>
            </ResponsiveContainer>
        ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                <BarChart2 className="w-10 h-10 opacity-20" />
                <p>暫無完整技術線圖資料</p>
                <p className="text-xs text-gray-400">請點擊上方按鈕前往 Yahoo 股市查看</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;
