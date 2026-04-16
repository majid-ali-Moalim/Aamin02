'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  AlertOctagon, 
  Truck, 
  MapPin, 
  Clock, 
  RefreshCw,
  Search,
  ArrowRight,
  Shield,
  Phone,
  Timer,
  AlertTriangle
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
import StatusUpdateModal from '@/components/features/emergency/StatusUpdateModal'

export default function CriticalCasesPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [activeModal, setActiveModal] = useState<'assign' | 'status' | null>(null)

  const fetchRequests = async () => {
    try {
      if (requests.length === 0) setIsLoading(true)
      const data = await emergencyRequestsService.getAll()
      // Filter for CRITICAL priority and not completed/cancelled
      setRequests(data.filter(r => 
        r.priority === 'CRITICAL' && 
        !['COMPLETED', 'CANCELLED', 'FAILED'].includes(r.status)
      ))
    } catch (err) {
      console.error('Failed to fetch critical requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 5000) // Fast refresh for critical monitor
    return () => clearInterval(interval)
  }, [])

  const stats = {
    total: requests.length,
    active: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    critical: requests.length,
  }

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''} ${request.pickupLocation}`.toLowerCase()
    return searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
  }).sort((a, b) => {
    // PENDING first, then by age
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return (
    <div className="bg-[#450a0a] min-h-screen text-white">
      <header className="bg-red-600 px-8 py-5 flex items-center justify-between shadow-2xl sticky top-0 z-50 border-b-4 border-red-800 animate-[pulse_4s_infinite]">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2">
            <AlertOctagon className="w-8 h-8 text-red-600 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight italic">Critical Monitor</h1>
            <p className="text-[10px] font-bold text-red-100 uppercase tracking-[0.3em] leading-none">Priority 1 Response Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-red-200 uppercase tracking-widest">Global Status</span>
              <span className="text-sm font-black text-white">CONDITION RED</span>
           </div>
           <Button 
            variant="outline" 
            onClick={fetchRequests}
            className="bg-transparent border-red-400 text-white hover:bg-white/10 rounded-none h-12 uppercase font-black text-xs"
           >
             <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
             Scan Grid
           </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Urgent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-red-900/50 border-2 border-red-500 p-6 backdrop-blur-md">
              <p className="text-[10px] font-black text-red-300 uppercase tracking-widest mb-1">Active Crit-1</p>
              <p className="text-4xl font-black text-white">{stats.total}</p>
           </div>
           <div className="bg-red-900/50 border-2 border-red-500 p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-red-500/20 rotate-45" />
              <p className="text-[10px] font-black text-red-300 uppercase tracking-widest mb-1">Unassigned</p>
              <p className="text-4xl font-black text-white">{stats.pending}</p>
           </div>
           <div className="md:col-span-2 bg-[#1E293B] border-2 border-gray-700 p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">System Advisory</p>
                <p className="text-sm font-black text-white uppercase italic">Immediate intervention required for all pending Crit-1 logs</p>
              </div>
              <Shield className="w-10 h-10 text-gray-600" />
           </div>
        </div>

        <div className="bg-black/20 p-4 border border-red-900/50 flex gap-4">
          <Search className="w-5 h-5 text-red-500 mt-3 ml-2" />
          <input
            type="text"
            placeholder="FILTER PRIORITY ARCHIVE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-white font-black text-lg uppercase tracking-wider focus:outline-none placeholder:text-red-950 h-12"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading && requests.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-red-500 mb-4" />
              <p className="text-xs font-black text-red-300 uppercase tracking-[0.3em]">Synching with responders...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-red-900/50 bg-red-950/20">
              <p className="text-xs font-black text-red-800 uppercase tracking-[0.3em]">No critical cases detected in current sector</p>
            </div>
          ) : filteredRequests.map((request) => (
            <div key={request.id} className="relative bg-red-950/40 border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)] overflow-hidden group">
               {/* Pulse Animation Background */}
               {request.status === 'PENDING' && (
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
               )}
               
               <div className="p-8 space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black tracking-tighter text-white">{request.trackingCode}</span>
                        <span className="bg-white text-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">Crit-1 log</span>
                      </div>
                      <p className="text-[12px] font-black text-red-300 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        Awaiting Response: {formatDistanceToNow(new Date(request.createdAt))}
                      </p>
                    </div>
                    <StatusBadge status={request.status} size="lg" />
                  </div>

                  <div className="bg-black/20 p-5 border border-red-900/30 space-y-4">
                     <div>
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1 text-right">Location Data</p>
                        <div className="flex items-start gap-3 justify-end">
                           <p className="text-right font-black text-white text-lg leading-tight uppercase max-w-[300px]">{request.pickupLocation}</p>
                           <MapPin className="w-6 h-6 text-red-500 mt-1" />
                        </div>
                     </div>
                     <div className="pt-4 border-t border-red-900/30 flex justify-between items-end">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-red-800 uppercase tracking-widest">Subject Ident</p>
                           <p className="font-black text-white uppercase">{request.patient?.fullName || 'UNKNOWN'}</p>
                        </div>
                        <div className="text-right">
                           {request.ambulance ? (
                              <div className="bg-blue-600 px-3 py-1 font-black text-[10px] uppercase tracking-widest border border-blue-400">
                                 Unit: {request.ambulance.ambulanceNumber}
                              </div>
                           ) : (
                              <div className="bg-red-600 px-3 py-1 font-black text-[10px] uppercase tracking-widest border border-red-400 animate-bounce">
                                 NO UNIT ASSIGNED
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    {request.status === 'PENDING' ? (
                      <Button 
                        onClick={() => { setSelectedRequest(request); setActiveModal('assign'); }}
                        className="flex-1 h-14 bg-white hover:bg-red-50 text-red-600 rounded-none font-black uppercase tracking-[0.2em] text-xs border-b-4 border-gray-200 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3"
                      >
                         <Truck className="w-5 h-5" />
                         Emergency Dispatch
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => { setSelectedRequest(request); setActiveModal('status'); }}
                        className="flex-1 h-14 bg-transparent hover:bg-white/10 text-white rounded-none font-black uppercase tracking-[0.2em] text-xs border-2 border-white active:translate-y-1 transition-all flex items-center justify-center gap-3"
                      >
                         Update Protocol
                         <ArrowRight className="w-5 h-5" />
                      </Button>
                    )}
                    <Button 
                      onClick={() => router.push(`/admin/emergency-requests?search=${request.trackingCode}`)}
                      className="w-14 h-14 bg-red-900/40 hover:bg-red-800/40 text-white rounded-none border border-red-700 flex items-center justify-center"
                    >
                       <Shield className="w-5 h-5" />
                    </Button>
                  </div>
               </div>

               {/* Decorative Side Stripes */}
               <div className="absolute right-0 top-0 bottom-0 w-1 flex flex-col gap-1">
                  <div className="flex-1 bg-red-500" />
                  <div className="flex-1 bg-white/20" />
                  <div className="flex-1 bg-red-500" />
               </div>
            </div>
          ))}
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: #450a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ef4444; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fca5a5; }
      `}</style>
    </div>
  )
}
