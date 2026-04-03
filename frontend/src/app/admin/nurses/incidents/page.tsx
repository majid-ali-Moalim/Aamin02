'use client'

import React, { useState, useEffect } from 'react'
import { 
  AlertCircle, 
  Search, 
  Flag, 
  MessageSquare, 
  ShieldAlert, 
  ChevronRight,
  Clock,
  User,
  Filter,
  ArrowUpRight,
  Loader2,
  Calendar
} from 'lucide-react'
import { nursesService } from '@/lib/api'

export default function NurseIncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      const data = await nursesService.getIncidentReports()
      setIncidents(data)
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = incidents.filter(i => 
    i.emergencyRequest?.trackingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.nurse?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.nurse?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-600 text-white'
      case 'HIGH': return 'bg-orange-500 text-white'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700'
      case 'LOW': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <AlertCircle className="w-8 h-8 mr-3 text-orange-600" />
            Incident / Case Reports
          </h1>
          <p className="text-gray-500 font-medium mt-1">Medical dispatch safety monitoring and clinical incident archive</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search case, nurse or category..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200">
            <ShieldAlert className="w-4 h-4" />
            New Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mb-4" />
          <p className="text-gray-500 font-bold animate-pulse">Scanning incident database...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* ID & Category */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner ${getPriorityColor(item.priority)}`}>
                    <Flag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-none">
                      #{item.emergencyRequest?.trackingCode || 'TRK-0000'}
                    </h3>
                    <div className="flex items-center mt-2 gap-2">
                       <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.category || 'CLINICAL'}</span>
                       <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase flex items-center">
                         <Calendar className="w-3 h-3 mr-1" />
                         {new Date(item.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Description Snippet */}
                <div className="flex-1 lg:max-w-md border-l border-gray-100 pl-6">
                   <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                     "{item.description || 'Medical equipment malfunction observed onsite. Oxygen regulator failed to maintain constant pressure. Backup unit deployed successfully.'}"
                   </p>
                </div>

                {/* Status & Staff */}
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Review Status</span>
                    <span className="text-sm font-black text-orange-600">{item.status || 'INVESTIGATING'}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                     <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-black text-orange-600 text-[10px]">
                        {item.nurse?.firstName[0]}{item.nurse?.lastName[0]}
                     </div>
                     <p className="text-xs font-black text-gray-700">{item.nurse?.firstName} {item.nurse?.lastName}</p>
                  </div>

                  <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-orange-600 hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
              <ShieldAlert className="w-16 h-16 text-gray-100 mb-4" />
              <p className="text-gray-400 font-bold tracking-tight">System clear: No incidents reported in this cycle</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
