import React from 'react';

interface FinancialMetricProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
}

const FinancialMetric: React.FC<FinancialMetricProps> = ({ label, value, subtext, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {icon && <div className="text-indigo-500 bg-indigo-50 p-1.5 rounded-lg">{icon}</div>}
      </div>
      <div>
        <div className="text-xl font-bold text-gray-900">{value}</div>
        {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
      </div>
    </div>
  );
};

export default FinancialMetric;