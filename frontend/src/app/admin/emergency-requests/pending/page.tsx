'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Clock, 
  Truck, 
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { emergencyRequestsService } from '@/lib/api'
import { EmergencyRequest } from '@/types'
import { formatDistanceToNow } from 'date-fns'

// Shared Components
import StatusBadge from '@/components/features/emergency/StatusBadge'
import PriorityBadge from '@/components/features/emergency/PriorityBadge'
import EmergencyStatsBar from '@/components/features/emergency/EmergencyStatsBar'
import AssignModal from '@/components/features/emergency/AssignModal'

export default function PendingRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const data = await emergencyRequestsService.getAll()
      // Filter for PENDING only
      setRequests(data.filter(r => r.status === 'PENDING'))
    } catch (err) {
      console.error('Failed to fetch pending requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(async () => {
      const data = await emergencyRequestsService.getAll()
      setRequests(data.filter(r => r.status === 'PENDING'))
    }, 5000) // Faster refresh for pending queue
    return () => clearInterval(interval)
  }, [])

  const stats = {
    total: requests.length,
    active: requests.length, // All pending are technically active
    pending: requests.length,
    critical: requests.filter(r => r.priority === 'CRITICAL').length,
  }

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''} ${request.pickupLocation}`.toLowerCase()
    return searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
  }).sort((a, b) => {
    // Sort by Priority (CRITICAL first)
    const priorityWeight: Record<string, number> = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 }
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[a.priority] - priorityWeight[b.priority]
    }
    // Then by creation time (Oldest first for queue)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  const openAssignModal = (request: EmergencyRequest) => {
    setSelectedRequest(request)
    setIsAssignModalOpen(true)
  }

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <header className="bg-[#B45309] text-white px-8 py-5 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2">
            <Clock className="w-8 h-8 text-[#B45309]" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight italic">Pending Queue</h1>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-[0.3em] leading-none">Awaiting Unit Assignment</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchRequests}
            className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-none h-12 uppercase font-black text-xs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto space-y-8">
        <EmergencyStatsBar stats={stats} />

        <div className="bg-[#1E293B] p-4 shadow-lg flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="SEARCH QUEUE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-[#0F172A] border border-gray-700 text-white font-black text-sm uppercase tracking-wider focus:outline-none focus:border-blue-500 rounded-none placeholder:text-gray-600 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && requests.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Scanning Network...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-gray-300">
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Queue Empty: No pending requests</p>
            </div>
          ) : filteredRequests.map((request) => {
            const waitTimeMin = Math.floor((Date.now() - new Date(request.createdAt).getTime()) / 60000)
            const isDelayed = waitTimeMin > 10
            const isWarning = waitTimeMin > 5

            return (
              <div key={request.id} className={`bg-white border-2 ${isDelayed ? 'border-red-500 shadow-red-100' : isWarning ? 'border-orange-500' : 'border-[#1E293B]'} shadow-xl flex flex-col overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
                <div className={`${isDelayed ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-[#1E293B]'} p-4 text-white flex justify-between items-center`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Tracking Code</span>
                    <span className="text-lg font-black">{request.trackingCode}</span>
                  </div>
                  <PriorityBadge priority={request.priority} size="sm" />
                </div>

                <div className="p-6 flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Incident Location</p>
                      <p className="text-sm font-black text-[#1E293B] uppercase leading-tight line-clamp-2">{request.pickupLocation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wait Time</p>
                      <p className={`text-xl font-black ${isDelayed ? 'text-red-600 animate-pulse' : isWarning ? 'text-orange-600' : 'text-blue-600'}`}>
                        {waitTimeMin}m
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 border border-gray-100 rounded-none">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patient Info</p>
                    <p className="text-xs font-bold text-gray-700 uppercase">{request.patient?.fullName || 'UNKNOWN'}</p>
                    <p className="text-[10px] font-black text-blue-500 font-mono mt-1">{request.patient?.phone || 'NO PHONE'}</p>
                  </div>

                  {request.notes && (
                    <div className="border-l-2 border-gray-200 pl-3 py-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dispatcher Notes</p>
                      <p className="text-[11px] text-gray-600 font-bold italic line-clamp-2">{request.notes}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <Button 
                    onClick={() => openAssignModal(request)}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-none border-b-4 border-blue-900 active:translate-y-1 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Truck className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Assign Now
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {isAssignModalOpen && selectedRequest && (
        <AssignModal 
          request={selectedRequest} 
          onClose={() => setIsAssignModalOpen(false)} 
          onSuccess={fetchRequests} 
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F1F5F9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #94A3B8; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  )
}
