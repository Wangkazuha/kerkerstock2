
import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';

interface CompanyInfoCardProps {
  symbol: string;
}

const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ symbol }) => {
  // Determine the correct MoneyDJ URL for the stock
  const moneydjUrl = `https://www.moneydj.com/Z/ZC/ZCA/ZCA.djhtm?a=${symbol}`;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-lg">
        <Building2 className="w-5 h-5 text-gray-600" />
        公司基本資料
      </div>
      <p className="text-gray-500 text-sm mb-4">
        查看詳細資本額、成立日期、董事長、總經理及主要業務內容。
      </p>
      <a 
        href={moneydjUrl}
        target="_blank"
        rel="noreferrer"
        className="block w-full"
      >
        <div className="bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-lg p-4 flex items-center justify-between group transition-colors">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xs font-bold text-gray-600 border border-gray-100">
                DJ
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 group-hover:text-indigo-700">MoneyDJ 理財網</span>
                <span className="text-xs text-gray-500">個股基本資料頁面</span>
              </div>
           </div>
           <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
        </div>
      </a>
    </div>
  );
};

export default CompanyInfoCard;
