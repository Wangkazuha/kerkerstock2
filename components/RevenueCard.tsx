

import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface RevenueData {
  date: string;
  revenue: number;
  mom: string;
  yoy: string;
  cumulativeRevenueYoy?: string;
}

interface MarginData {
  quarter: string;
  grossMargin: number; // Changed: Added Gross Margin
  operatingMargin: number;
  preTaxMargin?: number;
  netProfitMargin: number;
}

interface RevenueCardProps {
  revenueHistory?: RevenueData[];
  marginHistory?: MarginData[];
}

const CustomTooltipRevenue = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-xs z-50">
        <p className="font-bold text-gray-700 mb-1">{data.date}</p>
        <p className="text-indigo-600 font-semibold">營收: {data.revenue}億</p>
        <p className="text-teal-600">單月年增: {data.yoy}</p>
        <p className="text-gray-500">月增率: {data.mom}</p>
        {data.cumulativeRevenueYoy && (
             <p className="text-orange-500 font-medium">累計年增: {data.cumulativeRevenueYoy}</p>
        )}
      </div>
    );
  }
  return null;
};

const CustomTooltipMargin = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-xs z-50">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any, index: number) => {
           let labelName = p.name;
           if (p.name === 'Gross Margin') labelName = '毛利率';
           else if (p.name === 'Operating Margin') labelName = '營業利益率';
           else if (p.name === 'Pre-tax Margin') labelName = '稅前純益率';
           
           return (
            <p key={index} style={{ color: p.color }}>
                {labelName}: {p.value}%
            </p>
           );
        })}
      </div>
    );
  }
  return null;
};

const RevenueCard: React.FC<RevenueCardProps> = ({ 
  revenueHistory = [], 
  marginHistory = [] 
}) => {

  // Sort Revenue: Oldest to Newest (Left to Right)
  const sortedRevenue = useMemo(() => {
    return [...revenueHistory].sort((a, b) => {
      const dateA = new Date(a.date.replace('/', '-')); 
      const dateB = new Date(b.date.replace('/', '-'));
      
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.date.localeCompare(b.date);
    }).map(item => ({
        ...item,
        // Parse percentage strings to numbers for chart lines
        cumulativeVal: item.cumulativeRevenueYoy 
            ? parseFloat(item.cumulativeRevenueYoy.replace('%', '').replace('+', '')) 
            : null,
        monthlyYoyVal: item.yoy
            ? parseFloat(item.yoy.replace('%', '').replace('+', ''))
            : null
    }));
  }, [revenueHistory]);

  // Sort Margins: Oldest to Newest
  const sortedMargins = useMemo(() => {
    return [...marginHistory].sort((a, b) => a.quarter.localeCompare(b.quarter));
  }, [marginHistory]);

  // Calculate Trend
  let trendIndicator = null;
  if (sortedRevenue.length >= 2) {
    const startRevenue = sortedRevenue[0].revenue;
    const endRevenue = sortedRevenue[sortedRevenue.length - 1].revenue;
    
    if (startRevenue !== 0) {
      const growthPercent = ((endRevenue - startRevenue) / startRevenue) * 100;
      const isPositive = growthPercent >= 0;
      
      const TrendIcon = isPositive ? TrendingUp : TrendingDown;
      const colorClass = isPositive ? 'text-red-600 bg-red-50 border-red-100' : 'text-green-600 bg-green-50 border-green-100';

      trendIndicator = (
        <div className={`flex items-center gap-1 ml-3 px-2 py-0.5 rounded-full border text-xs font-medium ${colorClass}`}>
           <TrendIcon className="w-3 h-3" />
           <span>{isPositive ? '+' : ''}{growthPercent.toFixed(1)}%</span>
        </div>
      );
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
         <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
           <DollarSign className="w-5 h-5 text-indigo-600" />
           財務表現 (MOPS/TWSE)
         </h3>
         <span className="text-xs text-gray-400 px-2 py-1 bg-gray-50 rounded">經會計師查核/自結數</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Monthly Revenue (Bar) + Monthly YoY (Line) + Cumulative YoY (Line) */}
        <div className="h-[300px]">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
                <h4 className="text-sm font-semibold text-gray-700">月營收 & 年增率分析</h4>
                {trendIndicator}
            </div>
            <div className="text-xs text-gray-400 flex gap-2">
                <span>柱: 十億</span>
                <span>線: %</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <ComposedChart data={sortedRevenue} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                axisLine={false} 
                tickLine={false} 
              />
              {/* Left Axis: Revenue */}
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                axisLine={false} 
                tickLine={false} 
              />
              {/* Right Axis: Percentage (YoY) */}
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10, fill: '#f97316' }} 
                axisLine={false} 
                tickLine={false} 
                unit="%"
              />
              <Tooltip content={<CustomTooltipRevenue />} cursor={{fill: 'transparent'}} />
              <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" />

              {/* Revenue Bars */}
              <Bar yAxisId="left" dataKey="revenue" name="單月營收" radius={[4, 4, 0, 0]} barSize={20}>
                 {sortedRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === sortedRevenue.length - 1 ? '#4f46e5' : '#cbd5e1'} />
                 ))}
              </Bar>

              {/* Monthly YoY Line */}
               <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="monthlyYoyVal" 
                name="單月年增率" 
                stroke="#0d9488" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#0d9488', strokeWidth: 0 }}
              />

              {/* Cumulative YoY Line */}
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cumulativeVal" 
                name="累計營收年增率" 
                stroke="#f97316" 
                strokeWidth={2} 
                strokeDasharray="3 3"
                dot={{ r: 3, fill: '#f97316', strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Profit Margins (Gross / Operating / Pre-tax) */}
        <div className="h-[300px]">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-700">獲利能力 (近8季)</h4>
            <span className="text-xs text-gray-400">單位: %</span>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={sortedMargins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="quarter" 
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                axisLine={false} 
                tickLine={false} 
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                axisLine={false} 
                tickLine={false} 
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltipMargin />} />
              <Legend 
                iconType="circle" 
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                formatter={(value) => {
                    if (value === 'Gross Margin') return '毛利率';
                    if (value === 'Operating Margin') return '營業利益率';
                    if (value === 'Pre-tax Margin') return '稅前純益率';
                    return value;
                }}
              />
              
              {/* Line 1: Gross Margin (毛利率) - Orange/Amber (Highest) */}
              <Line 
                type="monotone" 
                name="Gross Margin" 
                dataKey="grossMargin" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
              />
              
              {/* Line 2: Operating Margin (營業利益率) - Blue (Middle) */}
              <Line 
                type="monotone" 
                name="Operating Margin" 
                dataKey="operatingMargin" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
              />
              
              {/* Line 3: Pre-tax Margin (稅前純益率) - Green (Lowest, usually) */}
              <Line 
                type="monotone" 
                name="Pre-tax Margin" 
                dataKey="preTaxMargin" 
                stroke="#10b981" 
                strokeWidth={2} 
                strokeDasharray="3 3"
                dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default RevenueCard;