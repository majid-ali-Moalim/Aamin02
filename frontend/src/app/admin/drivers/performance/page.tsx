'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  BarChart2, TrendingUp, Award, User, Clock, CheckCircle2, 
  MapPin, Loader2, Download, Filter, MessageCircle, Star
} from 'lucide-react'
import { driversService } from '@/lib/api'

export default function PerformancePage() {
  const [performance, setPerformance] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const data = await driversService.getPerformance()
      setPerformance(data)
    } catch (err) {
      console.error('Failed to fetch performance data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Performance & Reports</h1>
          <p className="text-gray-500 mt-1">Driver efficiency metrics and utilization analysis</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl font-bold h-11 bg-white shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" className="rounded-xl font-bold h-11 bg-white shadow-sm" onClick={fetchData}>
              <TrendingUp className={`w-4 h-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
              Update Stats
            </Button>
        </div>
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                 <Award className="w-5 h-5 text-yellow-500" />
                 Top Driver Rankings
               </h3>
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Monthly Cycle</span>
            </div>
            
            <div className="space-y-6">
               {isLoading ? (
                 <div className="p-20 text-center">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto mb-4" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Calculating Metrics...</p>
                 </div>
               ) : (
                 performance.map((d, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 rounded-3xl bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-md transition-all">
                       <div className="text-2xl font-black text-gray-200 w-8 text-center">{i + 1}</div>
                       <div className="w-12 h-12 rounded-[1.25rem] bg-white shadow-sm border border-gray-50 flex items-center justify-center font-bold text-gray-300 text-sm">
                          {d.name?.[0]}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-black text-gray-900 uppercase">{d.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                             <div className="flex items-center text-[10px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">
                                <CheckCircle2 className="w-3 h-3 text-success mr-1" />
                                {d.totalMissions} Missions
                             </div>
                             <div className="flex items-center text-[10px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">
                                <Clock className="w-3 h-3 text-blue-500 mr-1" />
                                {d.avgResponseTime}m Avg
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-black text-gray-900">{(5 - i * 0.2).toFixed(1)}</span>
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         <div className="bg-[#1b4382] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/20 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center">
                 <svg viewBox="0 0 100 100" className="w-[400px] h-full text-white fill-none stroke-current stroke-[0.2]">
                    <circle cx="50" cy="50" r="40" />
                    <circle cx="50" cy="50" r="30" />
                    <circle cx="50" cy="50" r="20" />
                  </svg>
            </div>
            <div className="relative z-10">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-8 flex items-center gap-2">
                 <TrendingUp className="w-4 h-4" />
                 Monthly Summary
               </h3>
               <div className="space-y-8">
                  <div>
                     <p className="text-4xl font-black tracking-tighter leading-none mb-1">84%</p>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">DRIVE UTILIZATION</p>
                  </div>
                  <div>
                     <p className="text-4xl font-black tracking-tighter leading-none mb-1">12.4m</p>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">AVG. RESPONSE TIME</p>
                  </div>
                  <div>
                     <p className="text-4xl font-black tracking-tighter leading-none mb-1">2,840</p>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">TOTAL MISSIONS COMPLETED</p>
                  </div>
               </div>
            </div>
            <Button className="w-full h-14 mt-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 font-bold uppercase tracking-widest text-[10px] relative z-10">
               View Full Annual Analytics
            </Button>
         </div>
      </div>

      {/* Detailed Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { title: 'Mission Reliability', value: '98.2%', trend: '+2.4%', color: 'success' },
           { title: 'Fuel Efficiency', value: '14.5L/100km', trend: '-0.8%', color: 'blue' },
           { title: 'Shift Compliance', value: '94%', trend: '+5.1%', color: 'purple' },
           { title: 'Response Variance', value: '+1.2m', trend: '-0.3%', color: 'warning' },
         ].map((card, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{card.title}</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">{card.value}</span>
                  <span className={`text-[10px] font-bold ${card.color === 'success' ? 'text-success' : 'text-blue-500'}`}>{card.trend}</span>
               </div>
               <div className="w-full h-1 bg-gray-50 rounded-full mt-4 overflow-hidden">
                  <div className={`h-full bg-${card.color === 'success' ? 'green-500' : card.color === 'blue' ? 'blue-500' : 'orange-500'} w-2/3 rounded-full`} />
               </div>
            </div>
         ))}
      </div>
    </div>
  )
}
