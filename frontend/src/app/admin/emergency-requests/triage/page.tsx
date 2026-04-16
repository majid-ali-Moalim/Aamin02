'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  Search, 
  MapPin, 
  User, 
  Truck, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  ChevronRight,
  ArrowRight,
  Phone,
  Timer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { emergencyRequestsService } from '@/lib/api'
import { EmergencyRequest } from '@/types'
import { formatDistanceToNow } from 'date-fns'

// Shared Components
import StatusBadge from '@/components/features/emergency/StatusBadge'
import PriorityBadge from '@/components/features/emergency/PriorityBadge'
import AssignModal from '@/components/features/emergency/AssignModal'

export default function TriageQueuePage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const fetchRequests = async () => {
    try {
      if (requests.length === 0) setIsLoading(true)
      const data = await emergencyRequestsService.getAll()
      const unassigned = data.filter(r => r.status === 'PENDING')
      setRequests(unassigned)
      
      // Auto-select first if none selected
      if (unassigned.length > 0 && !selectedRequest) {
        setSelectedRequest(unassigned[0])
      } else if (selectedRequest) {
        // Update selected request data if it still exists in the list
        const updated = unassigned.find(r => r.id === selectedRequest.id)
        if (updated) setSelectedRequest(updated)
        else setSelectedRequest(unassigned[0] || null)
      }
    } catch (err) {
      console.error('Failed to fetch triage queue:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''} ${request.pickupLocation}`.toLowerCase()
    return searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
  }).sort((a, b) => {
    const priorityWeight: Record<string, number> = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 }
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[a.priority] - priorityWeight[b.priority]
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return (
    <div className="bg-[#0F172A] min-h-screen flex flex-col overflow-hidden h-screen text-white">
      {/* Tactical Header */}
      <header className="bg-[#1E293B] border-b-2 border-[#EF4444] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-[#EF4444] p-2 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest italic leading-none">Triage Command Center</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Live Unassigned Response Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs font-black">
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 border border-gray-700">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
             <span>CRITICAL: {requests.filter(r => r.priority === 'CRITICAL').length}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 border border-gray-700">
             <span className="w-2 h-2 bg-blue-500 rounded-full" />
             <span>PENDING: {requests.length}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchRequests}
            className="h-8 rounded-none border-gray-600 bg-transparent text-white hover:bg-gray-700"
          >
            <RefreshCw className={`w-3 h-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            SYNCH
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Priority Queue Sidebar */}
        <aside className="w-[450px] border-r-2 border-gray-800 bg-[#0F172A] flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-800 bg-[#1E293B]/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="FILTER QUEUE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 h-10 bg-[#0F172A] border border-gray-700 font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading && requests.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-black text-[10px] uppercase tracking-widest">Awaiting Uplink...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-black text-[10px] uppercase tracking-widest">Queue Status: Nominal (Empty)</div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 border-b border-gray-800 cursor-pointer transition-all relative ${
                    selectedRequest?.id === request.id ? 'bg-blue-900/40 border-l-4 border-l-blue-500' : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-black text-gray-300">{request.trackingCode}</span>
                    <PriorityBadge priority={request.priority} size="sm" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase truncate">{request.patient?.fullName || 'UNKNOWN SUBJECT'}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span className="truncate">{request.pickupLocation}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                       <Clock className="w-3 h-3" />
                       {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </div>
                    {selectedRequest?.id === request.id && (
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Right Side: Detailed Intelligence Panel */}
        <main className="flex-1 bg-white text-[#1E293B] overflow-y-auto custom-scrollbar flex flex-col">
          {selectedRequest ? (
            <>
              {/* Detailed Header */}
              <div className="p-10 border-b-2 border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={selectedRequest.status} size="lg" />
                      <PriorityBadge priority={selectedRequest.priority} size="lg" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{selectedRequest.trackingCode}</h2>
                      <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        Awaiting Response: {formatDistanceToNow(new Date(selectedRequest.createdAt))}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-blue-50 border-2 border-blue-200 p-4 shadow-sm">
                       <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Response Clock</p>
                       <p className="text-2xl font-black text-blue-900 font-mono">
                          {Math.floor((Date.now() - new Date(selectedRequest.createdAt).getTime()) / 60000)}m
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Matrix */}
              <div className="flex-1 p-10 grid grid-cols-2 gap-10 bg-gray-50/50">
                 {/* Left Column: Intelligence */}
                 <div className="space-y-10">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500" />
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject Intelligence</h3>
                      </div>
                      <div className="bg-white border-2 border-gray-200 p-6 space-y-4 shadow-sm">
                         <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                               <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                               <p className="text-2xl font-black uppercase bg-[#1E293B] text-white px-3 py-1 inline-block">{selectedRequest.patient?.fullName || 'UNKNOWN'}</p>
                               <div className="flex items-center gap-4 mt-2">
                                  <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-500" /> {selectedRequest.patient?.phone || 'N/A'}</p>
                                  <p className="text-xs font-bold text-gray-500">GENDER: {selectedRequest.patient?.gender || 'N/A'}</p>
                               </div>
                            </div>
                         </div>
                         <div className="pt-4 border-t border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Complain / Condition</p>
                            <p className="text-sm font-bold text-gray-700 italic leading-relaxed">
                               "{selectedRequest.complaint || 'No specific complaint logged'}"
                            </p>
                         </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500" />
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Deployment Matrix</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white border-2 border-gray-200 p-6 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup Point</p>
                            <p className="text-sm font-black text-[#1E293B] uppercase">{selectedRequest.pickupLocation}</p>
                            <p className="text-[9px] font-bold text-blue-500 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> VERIFIED REGION</p>
                         </div>
                         <div className="bg-white border-2 border-gray-200 p-6 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Destination</p>
                            <p className="text-sm font-black text-[#1E293B] uppercase">{selectedRequest.destination || 'AWAITING DISPATCH'}</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest italic">PROTOCOL: NEAREST FACILITY</p>
                         </div>
                      </div>
                    </section>
                 </div>

                 {/* Right Column: Tactical Actions */}
                 <div className="space-y-10">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500" />
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Protocol Execution</h3>
                      </div>
                      <div className="bg-[#1E293B] p-8 border-4 border-gray-800 shadow-2xl relative overflow-hidden group">
                         <Truck className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                         <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Assignment Status</p>
                               <p className="text-2xl font-black text-white italic uppercase tracking-tighter">Unit Required Immediately</p>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed max-w-[300px]">
                               Access the units database to assign an available vehicle and tactical responder team to this incident.
                            </p>
                            <Button 
                              onClick={() => setIsAssignModalOpen(true)}
                              className="w-full h-16 bg-[#EF4444] hover:bg-white hover:text-[#EF4444] text-white rounded-none font-black uppercase tracking-[0.3em] text-sm border-b-8 border-red-900 active:translate-y-2 active:border-b-0 transition-all flex items-center justify-center gap-3 shadow-2xl"
                            >
                               <Truck className="w-6 h-6" />
                               Execute Dispatch
                            </Button>
                         </div>
                      </div>
                    </section>

                    <section className="bg-white border-2 border-gray-200 p-6 space-y-4 shadow-sm">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metadata Audit</p>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">SECURE LINK</span>
                       </div>
                       <div className="grid grid-cols-2 gap-y-4 text-[11px] font-bold">
                          <div className="text-gray-400 uppercase">Input Source</div>
                          <div className="text-right text-[#1E293B] uppercase">{selectedRequest.requestSource || 'DIRECT LINE'}</div>
                          <div className="text-gray-400 uppercase">Operator Code</div>
                          <div className="text-right text-[#1E293B] uppercase">DISPATCH-01</div>
                          <div className="text-gray-400 uppercase">System Key</div>
                          <div className="text-right text-gray-400 font-mono text-[9px]">{selectedRequest.id.substring(0, 16).toUpperCase()}...</div>
                       </div>
                    </section>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-20 text-center">
               <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-none border-4 border-gray-200 animate-pulse">
                  <Shield className="w-12 h-12 text-gray-300" />
               </div>
               <div className="space-y-2">
                 <h2 className="text-3xl font-black text-gray-300 uppercase italic">Command Standby</h2>
                 <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] max-w-xs">Select a request from the response matrix to begin protocol execution.</p>
               </div>
            </div>
          )}
        </main>
      </div>

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
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  )
}
