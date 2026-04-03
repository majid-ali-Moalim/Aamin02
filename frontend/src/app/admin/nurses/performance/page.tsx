'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart2, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  Users, 
  Clock, 
  ArrowUpRight,
  Target,
  Percent,
  Layers,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { nursesService } from '@/lib/api'

export default function NursePerformancePage() {
  const [stats, setStats] = useState<any>(null)
  const [nurses, setNurses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsData, allNurses] = await Promise.all([
        nursesService.getStats(),
        nursesService.getAll()
      ])
      setStats(statsData)
      setNurses(allNurses)
    } catch (error) {
      console.error('Error fetching performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = nurses.filter(n => 
    `${n.firstName} ${n.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const KPICards = [
    { title: 'Total Clinical Cases', value: stats?.totalCases || 0, icon: Activity, color: 'bg-blue-500' },
    { title: 'Care Records Filed', value: stats?.totalRecords || 0, icon: Layers, color: 'bg-purple-500' },
    { title: 'Active In-Field Staff', value: stats?.onDuty || 0, icon: Users, color: 'bg-green-500' },
    { title: 'Response Efficiency', value: '92.4%', icon: Target, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <BarChart2 className="w-8 h-8 mr-3 text-blue-600" />
            Performance & Reports
          </h1>
          <p className="text-gray-500 font-medium mt-1">Advanced clinical metrics and staff productivity analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search nurse performance..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200">
            Export Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-bold animate-pulse">Calculating clinical KPIs...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KPICards.map((item, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative group overflow-hidden transition-all hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${item.color} p-3 rounded-2xl`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center text-green-500 text-xs font-black bg-green-50 px-2.5 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +4.2%
                  </div>
                </div>
                <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">{item.title}</h3>
                <p className="text-2xl font-black text-gray-900 leading-none">{item.value}</p>
                
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gray-50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-20" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Staff Ranking List */}
            <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Personnel Ranking</h2>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Sorted by Case Load</span>
              </div>
              <div className="p-6">
                 <div className="space-y-4">
                    {filtered.slice(0, 10).map((nurse) => (
                      <div key={nurse.id} className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-2xl transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                             {nurse.firstName[0]}{nurse.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">{nurse.firstName} {nurse.lastName}</p>
                            <p className="text-[10px] text-gray-400 font-black tracking-widest mt-1 uppercase">{nurse.specialization || 'General Nurse'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="hidden lg:flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Reliability Score</span>
                            <div className="flex items-center gap-1 mt-1">
                               <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="w-[85%] h-full bg-blue-600" />
                               </div>
                               <span className="text-[10px] font-black text-gray-700">85%</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-all" />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Shift Distribution */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <h2 className="text-lg font-black text-gray-900 tracking-tight mb-2">Service Utilization</h2>
              <p className="text-xs text-gray-400 font-bold mb-6">Aggregate personnel activity per shift segment</p>
              
              <div className="space-y-6 flex-1">
                 <div className="relative pt-1">
                   <div className="flex mb-2 items-center justify-between">
                     <div><span className="text-[10px] font-black text-blue-600 uppercase">Emergency Response</span></div>
                     <div className="text-right"><span className="text-xs font-black text-blue-600">76%</span></div>
                   </div>
                   <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-blue-50 shadow-inner">
                     <div style={{ width: '76%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600" />
                   </div>
                 </div>

                 <div className="relative pt-1">
                   <div className="flex mb-2 items-center justify-between">
                     <div><span className="text-[10px] font-black text-purple-600 uppercase">Case Management</span></div>
                     <div className="text-right"><span className="text-xs font-black text-purple-600">45%</span></div>
                   </div>
                   <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-purple-50 shadow-inner">
                     <div style={{ width: '45%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600" />
                   </div>
                 </div>

                 <div className="relative pt-1">
                   <div className="flex mb-2 items-center justify-between">
                     <div><span className="text-[10px] font-black text-green-600 uppercase">Patient Stability</span></div>
                     <div className="text-right"><span className="text-xs font-black text-green-600">92%</span></div>
                   </div>
                   <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-green-50 shadow-inner">
                     <div style={{ width: '92%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600" />
                   </div>
                 </div>
              </div>

              <button className="mt-8 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-500 tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                 <Target className="w-4 h-4" />
                 View Detailed Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
