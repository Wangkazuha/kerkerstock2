

import React from 'react';
import { FinMindCombinedData } from '../types';
import { Users } from 'lucide-react';

interface InstitutionalCardProps {
  data: FinMindCombinedData[];
  loading?: boolean;
}

const InstitutionalCard: React.FC<InstitutionalCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-64 flex items-center justify-center">
        <div className="text-gray-400 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            載入法人詳細數據...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  const fmt = (num: number) => new Intl.NumberFormat('zh-TW').format(num);
  
  const getColor = (val: number) => {
    if (val > 0) return 'text-red-600';
    if (val < 0) return 'text-green-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
      {/* Table Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            三大法人每日詳細數據
          </h3>
          <p className="text-xs text-gray-500 mt-1">追蹤外資、投信與自營商的籌碼動向 (單位: 張)</p>
        </div>
        <div className="flex gap-2 text-xs">
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 買超</span>
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 賣超</span>
        </div>
      </div>

      <div className="overflow-x-auto mb-2">
        <table className="w-full text-sm text-right whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <th className="px-3 py-3 text-left font-semibold">日期</th>
              <th className="px-3 py-3 font-semibold">外資</th>
              <th className="px-3 py-3 font-semibold">投信</th>
              <th className="px-3 py-3 font-semibold">自營商</th>
              <th className="px-3 py-3 font-semibold">融資餘額</th>
              <th className="px-3 py-3 font-semibold">融券餘額</th>
              <th className="px-3 py-3 font-semibold">收盤價</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-3 py-3 text-left text-gray-900 font-medium">{row.date}</td>
                <td className={`px-3 py-3 ${getColor(row.foreignBuy)} font-medium`}>{fmt(Math.floor(row.foreignBuy / 1000))}</td>
                <td className={`px-3 py-3 ${getColor(row.investmentTrustBuy)}`}>{fmt(Math.floor(row.investmentTrustBuy / 1000))}</td>
                <td className={`px-3 py-3 ${getColor(row.dealerBuy)}`}>{fmt(Math.floor(row.dealerBuy / 1000))}</td>
                <td className="px-3 py-3 text-gray-700">{fmt(row.marginBalance)}</td>
                <td className="px-3 py-3 text-gray-700">{fmt(row.shortBalance)}</td>
                <td className="px-3 py-3 text-indigo-700 font-bold">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstitutionalCard;