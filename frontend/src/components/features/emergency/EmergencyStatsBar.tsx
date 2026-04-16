import React from 'react';
import { 
  FileText, 
  Activity as ActivityIcon, 
  AlertCircle, 
  Clock 
} from 'lucide-react';

interface EmergencyStatsBarProps {
  stats: {
    total: number;
    active: number;
    pending: number;
    critical: number;
  };
}

const EmergencyStatsBar: React.FC<EmergencyStatsBarProps> = ({ stats }) => {
  return (
    <div className="bg-white border-2 border-[#1E293B] flex shadow-xl overflow-hidden mb-8">
      <div className="bg-[#1E293B] text-white px-8 py-4 flex flex-col justify-center min-w-[200px]">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Global Metrics</span>
        <span className="text-2xl font-black uppercase italic tracking-tighter">Live Status</span>
      </div>
      
      <div className="flex-1 grid grid-cols-4 divide-x-2 divide-gray-200">
        <div className="px-8 py-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Logs</p>
            <p className="text-3xl font-black text-[#1E293B]">{stats.total}</p>
          </div>
          <FileText className="w-8 h-8 text-gray-300" />
        </div>
        <div className="px-8 py-6 flex items-center justify-between bg-white hover:bg-blue-50 transition-colors">
          <div>
            <p className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-1">Active Cases</p>
            <p className="text-3xl font-black text-blue-600">{stats.active}</p>
          </div>
          <ActivityIcon className="w-8 h-8 text-blue-300" />
        </div>
        <div className="px-8 py-6 flex items-center justify-between bg-white hover:bg-red-50 transition-colors">
          <div>
            <p className="text-[11px] font-black text-red-900 uppercase tracking-widest mb-1">Critical Priority</p>
            <p className="text-3xl font-black text-red-600">{stats.critical}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-red-300" />
        </div>
        <div className="px-8 py-6 flex items-center justify-between bg-white hover:bg-orange-50 transition-colors">
          <div>
            <p className="text-[11px] font-black text-orange-900 uppercase tracking-widest mb-1">Pending Assign</p>
            <p className="text-3xl font-black text-orange-600">{stats.pending}</p>
          </div>
          <Clock className="w-8 h-8 text-orange-300" />
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatsBar;
