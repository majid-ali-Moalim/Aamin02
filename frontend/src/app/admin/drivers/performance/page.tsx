'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  BarChart2, TrendingUp, Star, Award, 
  Activity, Clock, CheckCircle2, Shield,
  ArrowUpRight, ArrowDownRight, Loader2,
  Truck, User, Navigation, Gauge, Zap
} from 'lucide-react'
import { driversService } from '@/lib/api'
import { Employee } from '@/types'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line,
  AreaChart, Area
} from 'recharts'
import { Button } from '@/components/ui/button'

export default function DriverPerformancePage() {
  const [drivers, setDrivers] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await driversService.getAll()
        setDrivers(data)
      } catch (err) {
        console.error('Failed to fetch performance data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Mocked performance data for tactical analytics
  const tacticalData = [
    { day: 'Mon', speed: 45, response: 8.2 },
    { day: 'Tue', speed: 52, response: 7.5 },
    { day: 'Wed', speed: 48, response: 9.1 },
    { day: 'Thu', speed: 55, response: 6.8 },
    { day: 'Fri', speed: 50, response: 8.4 },
    { day: 'Sat', speed: 42, response: 10.2 },
    { day: 'Sun', speed: 49, response: 7.9 },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Tactical Header */}
      <div className="bg-[#0A1128] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" strokeWidth="0.1" fill="none" className="animate-pulse" />
           </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="bg-emerald-600/20 p-2 rounded-xl text-emerald-400 border border-emerald-500/20">
                    <Zap className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Fleet Efficiency Protocol</span>
              </div>
              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Driver Performance Matrix</h1>
              <p className="text-white/40 text-sm mt-3 font-medium max-w-2xl leading-relaxed">
                 Tactical analytics for field personnel. Monitor response times, fuel efficiency, and mission safety ratings in real-time.
              </p>
           </div>
           
           <div className="flex gap-4 px-4 bg-white/5 rounded-[2rem] border border-white/10 p-2 border-b-4">
              <div className="text-right px-4">
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Avg ETA</p>
                 <p className="text-xl font-black text-white">8.2m</p>
              </div>
              <div className="w-px h-full bg-white/10" />
              <div className="text-right px-4">
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Safety Index</p>
                 <p className="text-xl font-black text-emerald-400">97%</p>
              </div>
           </div>
        </div>
      </div>

      {isLoading ? (
         <div className="p-24 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading Field Intelligence...</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Efficiency Overview */}
            <div className="xl:col-span-2 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                     { label: 'Total KM', value: '14.2k', sub: '+400 today', color: 'blue' },
                     { label: 'Avg Speed', value: '48 km/h', sub: 'Optimal', color: 'emerald' },
                     { label: 'Rapid Response', value: '92%', sub: 'Target 90%', color: 'indigo' },
                     { label: 'Fuel Savings', value: '12%', sub: 'Eco-mode', color: 'orange' }
                  ].map((stat, i) => (
                     <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-secondary mt-1">{stat.value}</h3>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-1 italic">{stat.sub}</p>
                     </div>
                  ))}
               </div>

               {/* Tactical Line Chart */}
               <div className="bg-[#0F172A] p-10 rounded-[2.5rem] shadow-2xl relative">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-lg font-black text-white tracking-tight uppercase italic">Response Time Variance</h3>
                     <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[78%] shadow-[0_0_8px_blue]" />
                     </div>
                  </div>
                  <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={tacticalData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                           <XAxis dataKey="day" hide />
                           <YAxis hide />
                           <Tooltip 
                              contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px', fontWeight: 900 }}
                           />
                           <Line type="monotone" dataKey="response" stroke="#3B82F6" strokeWidth={6} dot={{ r: 6, fill: '#3B82F6', strokeWidth: 4, stroke: '#0F172A' }} activeDot={{ r: 10, shadow: '0 0 10px blue' }} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>

            {/* Right Panel: Top Drivers */}
            <div className="space-y-8">
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
                  <h3 className="text-lg font-black text-secondary tracking-tight mb-8">Mission Champions</h3>
                  <div className="space-y-6">
                     {drivers.slice(0, 6).map((driver, i) => (
                        <div key={i} className="flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-gray-300 text-xs overflow-hidden group-hover:border-emerald-200 transition-all">
                                 {driver.firstName[0]}{driver.lastName[0]}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-secondary uppercase tracking-tight group-hover:text-emerald-600 transition-all">{driver.firstName} {driver.lastName}</p>
                                 <div className="flex items-center gap-2 mt-0.5">
                                    <Clock className="w-3 h-3 text-blue-400" />
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{Math.floor(Math.random() * 5) + 6}m Avg Response</span>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="bg-emerald-50 px-2 py-1 rounded-lg">
                                 <p className="text-[10px] font-black text-emerald-600">{Math.floor(Math.random() * 10) + 90}%</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Fleet Health Indicator */}
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
                  <div className="flex-1">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Fleet Compliance</p>
                     <h4 className="text-2xl font-black text-secondary tracking-tight">99.4%</h4>
                  </div>
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border-4 border-emerald-500 shadow-inner">
                     <Shield className="w-10 h-10 text-emerald-500" />
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}
