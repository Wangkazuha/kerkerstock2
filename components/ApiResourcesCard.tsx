
import React from 'react';
import { ExternalLink, Database, FileText, ArrowRight } from 'lucide-react';

interface ResourceItem {
  name: string;
  description: string;
  url: string;
}

interface ApiResourcesCardProps {
  title: string;
  icon?: React.ReactNode;
  resources: ResourceItem[];
}

const ApiResourcesCard: React.FC<ApiResourcesCardProps> = ({ title, icon, resources }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          {icon || <Database className="w-5 h-5 text-indigo-600" />}
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          台灣證券交易所 (TWSE) 官方 OpenAPI 文件與原始數據
        </p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {resources.map((item, index) => (
          <a 
            key={index}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block p-4 hover:bg-indigo-50/50 transition-colors group"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 group-hover:text-indigo-700 flex items-center gap-2">
                   {item.name}
                   <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </div>
                <div className="text-xs text-gray-500 mt-1 pr-4 leading-relaxed">
                  {item.description}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ApiResourcesCard;
