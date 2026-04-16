'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Trash2, 
  Truck, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { emergencyRequestsService } from '@/lib/api'
import { EmergencyRequest, EmergencyRequestStatus, Priority } from '@/types'
import { formatDistanceToNow } from 'date-fns'

// Shared Components
import StatusBadge from '@/components/features/emergency/StatusBadge'
import PriorityBadge from '@/components/features/emergency/PriorityBadge'
import EmergencyStatsBar from '@/components/features/emergency/EmergencyStatsBar'
import AssignModal from '@/components/features/emergency/AssignModal'
import StatusUpdateModal from '@/components/features/emergency/StatusUpdateModal'
import CancelModal from '@/components/features/emergency/CancelModal'

export default function EmergencyRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [activeModal, setActiveModal] = useState<'assign' | 'status' | 'cancel' | null>(null)

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const data = await emergencyRequestsService.getAll()
      setRequests(data)
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(async () => {
      const data = await emergencyRequestsService.getAll()
      setRequests(data)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const stats = {
    total: requests.length,
    active: requests.filter(r => !['COMPLETED', 'CANCELLED', 'FAILED'].includes(r.status)).length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    critical: requests.filter(r => r.priority === 'CRITICAL').length,
  }

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''} ${request.patient?.phone || ''} ${request.pickupLocation}`.toLowerCase()
    const matchesSearch = searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || request.status === statusFilter
    const matchesPriority = priorityFilter === '' || request.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const openModal = (request: EmergencyRequest, type: 'assign' | 'status' | 'cancel') => {
    setSelectedRequest(request)
    setActiveModal(type)
  }

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      {/* Tactical Header */}
      <header className="bg-[#E32929] text-white px-8 py-5 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-none">
            <Truck className="w-8 h-8 text-[#E32929]" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight italic">Emergency Case Log</h1>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-[0.3em] leading-none">Global Mission Control</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Button 
            variant="outline" 
            onClick={fetchRequests}
            className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-none h-12 uppercase font-black text-xs"
           >
             <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
             Refresh
           </Button>
           <Button
            className="h-12 px-8 bg-[#1E293B] hover:bg-[#0F172A] text-white font-black uppercase tracking-widest rounded-none shadow-xl border border-[#0F172A] flex items-center gap-2"
            onClick={() => router.push('/admin/emergency-requests/new')}
           >
             <Plus className="w-5 h-5 text-red-500" />
             New Case Intake
           </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* Dynamic Stats Bar */}
        <EmergencyStatsBar stats={stats} />

        {/* Tactical Search & Filter Panel */}
        <div className="bg-[#1E293B] border-2 border-[#1E293B] p-4 shadow-lg flex flex-wrap gap-4 rounded-none">
           <div className="relative flex-1 min-w-[300px]">
             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input
               type="text"
               placeholder="SEARCH TRACKING CODE, PATIENT OR LOCATION..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 h-12 bg-[#0F172A] border border-gray-700 text-white font-black text-sm uppercase tracking-wider focus:outline-none focus:border-blue-500 rounded-none placeholder:text-gray-600 transition-colors"
             />
           </div>
           
           <select
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="h-12 px-6 bg-white border border-gray-300 text-[#1E293B] font-black text-[11px] uppercase tracking-widest focus:outline-none rounded-none cursor-pointer"
           >
             <option value="">-- ALL STATUSES --</option>
             {Object.keys(EmergencyRequestStatus).map(status => (
               <option key={status} value={status}>{status.replace('_', ' ')}</option>
             ))}
           </select>
           
           <select
             value={priorityFilter}
             onChange={(e) => setPriorityFilter(e.target.value)}
             className="h-12 px-6 bg-white border border-gray-300 text-[#1E293B] font-black text-[11px] uppercase tracking-widest focus:outline-none rounded-none cursor-pointer"
           >
             <option value="">-- ALL PRIORITIES --</option>
             {Object.keys(Priority).map(priority => (
               <option key={priority} value={priority}>{priority}</option>
             ))}
           </select>

           <Button className="h-12 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-none border border-gray-600 font-black">
              <Filter className="w-5 h-5" />
           </Button>
        </div>

        {/* Unified Request Grid */}
        <div className="bg-white border-2 border-[#1E293B] shadow-2xl overflow-hidden rounded-none">
           <div className="overflow-x-auto">
             <table className="min-w-full">
                <thead className="bg-[#E2E8F0] border-b-2 border-[#1E293B]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-[#1E293B] uppercase tracking-widest border-r border-gray-300">Case Intel</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-[#1E293B] uppercase tracking-widest border-r border-gray-300 text-center">Protocol State</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-[#1E293B] uppercase tracking-widest border-r border-gray-300">Location Data</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-[#1E293B] uppercase tracking-widest border-r border-gray-300 whitespace-nowrap">Time Delta</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-[#1E293B] uppercase tracking-widest whitespace-nowrap text-center">Protocol Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                   {isLoading && requests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Synching with network...</p>
                      </td>
                    </tr>
                   ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-xs font-black text-gray-400 uppercase tracking-[0.3em]">No incidents detected in current matrix</td>
                    </tr>
                   ) : (
                    filteredRequests.map((request, idx) => (
                      <tr key={request.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/50 transition-colors group`}>
                        <td className="px-6 py-5 border-r border-gray-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-[#1E293B]">{request.trackingCode}</span>
                              <PriorityBadge priority={request.priority} size="sm" />
                            </div>
                            <p className="text-[11px] font-bold text-gray-600 uppercase italic">{request.patient?.fullName || 'IDENTITY UNKNOWN'}</p>
                            <p className="text-[10px] font-black text-blue-500 font-mono tracking-tighter">{request.patient?.phone || 'COMMS OFFLINE'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 border-r border-gray-100 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <StatusBadge status={request.status} />
                            {request.ambulance && (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-black uppercase tracking-tight">
                                <Truck className="w-3 h-3" />
                                {request.ambulance.ambulanceNumber}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 border-r border-gray-100 max-w-xs">
                          <div className="space-y-2">
                            <div className="flex items-start gap-1.5 bg-gray-100 px-2.5 py-1.5 border border-gray-200 text-gray-800 text-[10px] font-bold uppercase leading-tight">
                              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              {request.pickupLocation}
                            </div>
                            <div className="flex items-center gap-1.5 px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest overflow-hidden">
                              <ChevronRight className="w-3 h-3 shrink-0" />
                              <span className="truncate">Dest: {request.destination || 'TBD'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 border-r border-gray-100 whitespace-nowrap">
                          <div className="flex flex-col">
                             <div className="flex items-center gap-1.5 text-xs font-black text-gray-800">
                               <Clock className="w-3.5 h-3.5 text-gray-400" />
                               {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                             </div>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">LOGGED {new Date(request.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {request.status === 'PENDING' ? (
                              <button 
                                onClick={() => openModal(request, 'assign')}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 shadow-md border-b-2 border-blue-900 active:translate-y-0.5 transition-all"
                                title="Primary Dispatch"
                              >
                                <Truck className="w-5 h-5" />
                              </button>
                            ) : !['COMPLETED', 'CANCELLED', 'FAILED'].includes(request.status) ? (
                              <button 
                                onClick={() => openModal(request, 'status')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 shadow-md border-b-2 border-emerald-900 active:translate-y-0.5 transition-all flex items-center gap-1"
                                title="Advance Status"
                              >
                                <ArrowRight className="w-5 h-5" />
                                <span className="text-[10px] font-black px-1">NEXT</span>
                              </button>
                            ) : null}

                            <button className="bg-gray-200 hover:bg-gray-300 text-[#1E293B] p-2.5 border-b-2 border-gray-400 active:translate-y-0.5 transition-all">
                              <Eye className="w-5 h-5" />
                            </button>

                            {!['COMPLETED', 'CANCELLED', 'FAILED'].includes(request.status) && (
                              <button 
                                onClick={() => openModal(request, 'cancel')}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 border-b-2 border-red-200 active:translate-y-0.5 transition-all"
                                title="Abort Protocol"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                   )}
                </tbody>
             </table>
           </div>
        </div>
      </main>

      {/* Modals Integration */}
      {activeModal === 'assign' && selectedRequest && (
        <AssignModal 
          request={selectedRequest} 
          onClose={() => setActiveModal(null)} 
          onSuccess={fetchRequests} 
        />
      )}
      {activeModal === 'status' && selectedRequest && (
        <StatusUpdateModal 
          request={selectedRequest} 
          onClose={() => setActiveModal(null)} 
          onSuccess={fetchRequests} 
        />
      )}
      {activeModal === 'cancel' && selectedRequest && (
        <CancelModal 
          request={selectedRequest} 
          onClose={() => setActiveModal(null)} 
          onSuccess={fetchRequests} 
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F1F5F9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94A3B8;
          border-radius: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  )
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
