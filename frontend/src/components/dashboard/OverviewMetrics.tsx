'use client'

import { Activity, Truck, Users, CheckCircle, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'
import { ReactNode } from 'react'

interface DashboardStats {
  activeEmergencies: number
  availableAmbulances: number
  totalUsers: number
  totalDrivers: number
  totalPatients: number
  completedCases: number
  pendingRequests: number
  referralCount: number
}

interface OverviewMetricsProps {
  stats: DashboardStats | null
  chartData: any[]
  priorityData: any[]
  isRefreshing: boolean
  onRefresh: () => void
  activeTab: 'dispatch' | 'analytics'
  onTabChange: (tab: 'dispatch' | 'analytics') => void
  dispatchContent?: ReactNode
}

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F59E0B',
  MEDIUM: '#3B82F6',
  LOW: '#10B981'
}

export function OverviewMetrics({ stats, chartData, priorityData, isRefreshing, onRefresh, activeTab, onTabChange, dispatchContent }: OverviewMetricsProps) {
  return (
    <div className="space-y-6">
      
      {/* 1. Sleek Tactical Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#E32929] text-white p-6 shadow-xl border-b-[8px] border-[#1E293B]">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 bg-white flex items-center justify-center border-4 border-[#1E293B]">
              <Activity className="w-8 h-8 text-[#E32929]" />
           </div>
           <div>
              <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">Mission Control</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-[#1E293B] bg-white px-2 py-0.5 uppercase tracking-widest border border-white">
                   <span className="w-2 h-2 bg-[#E32929] rounded-full animate-pulse" /> Live Sync Active
                </span>
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                  {format(new Date(), 'MMM dd • HH:mm:ss')}
                </span>
              </div>
           </div>
        </div>

        {/* Tab Controls to Reduce Overload */}
        <div className="flex bg-[#1E293B] p-2 border-2 border-[#1E293B]">
           <button 
             onClick={() => onTabChange('dispatch')}
             className={`px-8 py-3 text-sm font-black uppercase tracking-widest transition-all ${
               activeTab === 'dispatch' ? 'bg-white text-[#1E293B] shadow-inner' : 'text-gray-400 hover:text-white'
             }`}
           >
             Live Operations
           </button>
           <button 
             onClick={() => onTabChange('analytics')}
             className={`px-8 py-3 text-sm font-black uppercase tracking-widest transition-all ${
               activeTab === 'analytics' ? 'bg-white text-[#1E293B] shadow-inner' : 'text-gray-400 hover:text-white'
             }`}
           >
             Telemetry
           </button>
        </div>

        <button 
           onClick={onRefresh}
           className={`p-4 border-2 transition-all flex items-center gap-2 font-black uppercase tracking-widest text-xs ${isRefreshing ? 'bg-[#1E293B] border-black text-white shadow-inner' : 'bg-[#1E293B] border-white text-white hover:bg-black hover:border-gray-500 shadow-xl'}`}
         >
           <Zap className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-yellow-400' : 'text-white'}`} />
           <span>Refresh</span>
        </button>
      </div>

      {/* 2. Top Minimal KPI Cards - Industrial style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Missions', value: stats?.activeEmergencies || 0, icon: Activity, borderColor: 'border-red-500', iconColor: 'text-red-500' },
          { label: 'Available Units', value: stats?.availableAmbulances || 0, icon: Truck, borderColor: 'border-blue-500', iconColor: 'text-blue-500' },
          { label: 'Staff Online', value: stats?.totalUsers || 0, icon: Users, borderColor: 'border-indigo-500', iconColor: 'text-indigo-500' },
          { label: 'Outcomes Logged', value: stats?.completedCases || 0, icon: CheckCircle, borderColor: 'border-emerald-500', iconColor: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white border-b-4 border-r-2 border-l-2 border-t-2 ${stat.borderColor} shadow-sm flex flex-col`}>
             <div className="bg-[#1E293B] px-4 py-2 flex items-center justify-between">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{stat.label}</p>
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
             </div>
             <div className="px-6 py-8 flex items-center justify-center bg-[#F8FAFC]">
                <h3 className="text-5xl font-black text-[#1E293B] tracking-tighter">{stat.value}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* 3. Conditional Content Rendering */}
      {activeTab === 'dispatch' ? (
         // Dispatch View Layer
         <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pt-2">
            {dispatchContent}
         </div>
      ) : (
         // Analytics View Layer - Dense Charts
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
           {/* Main Telemetry Chart */}
           <div className="xl:col-span-2 bg-[#1E293B] border-4 border-gray-400 p-8 text-white shadow-xl relative overflow-hidden">
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 relative z-10 border-b-2 border-gray-600 pb-2">Volume Telemetry matrix</h3>
              <div className="h-72 w-full relative z-10 bg-[#0F172A] border border-gray-700 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#94A3B8" fontSize={10} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #475569', borderRadius: '0', fontSize: '12px', color: '#fff', textTransform:'uppercase', fontWeight:'bold' }} />
                    <Area type="step" dataKey="missions" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorMissions)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Priority Mix Chart */}
           <div className="bg-white border-4 border-[#1E293B] p-8 shadow-sm flex flex-col items-center justify-center">
              <h3 className="text-lg font-black text-[#1E293B] uppercase tracking-widest mb-6 w-full border-b-2 border-gray-200 pb-2">Strategic Defcon Mix</h3>
              <div className="h-64 w-full bg-[#F8FAFC] border border-gray-200 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#3B82F6'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ border:'2px solid #1E293B', borderRadius:'0', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
           </div>
         </div>
      )}
    </div>
  )
}
