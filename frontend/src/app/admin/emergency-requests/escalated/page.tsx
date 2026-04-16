'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Search,
  Truck,
  ArrowRight,
  Shield,
  LifeBuoy
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

export default function EscalatedCasesPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const fetchRequests = async () => {
    try {
      if (requests.length === 0) setIsLoading(true)
      const data = await emergencyRequestsService.getAll()
      // Filter for PENDING and waiting > 10 minutes OR specifically flagged (simulation)
      setRequests(data.filter(r => {
        const waitTimeMin = Math.floor((Date.now() - new Date(r.createdAt).getTime()) / 60000)
        return r.status === 'PENDING' && waitTimeMin >= 10
      }))
    } catch (err) {
      console.error('Failed to fetch escalated requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 10000)
    return () => clearInterval(interval)
  }, [])

  const stats = {
    total: requests.length,
    active: requests.length,
    pending: requests.length,
    critical: requests.filter(r => r.priority === 'CRITICAL').length,
  }

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''} ${request.pickupLocation}`.toLowerCase()
    return searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
  }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return (
    <div className="bg-[#1e1b4b] min-h-screen text-white">
      <header className="bg-orange-600 px-8 py-5 flex items-center justify-between shadow-2xl sticky top-0 z-50 border-b-4 border-orange-800">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight italic">Escalation Desk</h1>
            <p className="text-[10px] font-bold text-orange-100 uppercase tracking-[0.3em] leading-none">High-Latency Protocol Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Button 
            variant="outline" 
            onClick={fetchRequests}
            className="bg-transparent border-orange-400 text-white hover:bg-white/10 rounded-none h-12 uppercase font-black text-xs"
           >
             <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
             Scan Matrix
           </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto space-y-8">
        <EmergencyStatsBar stats={stats} />

        <div className="bg-orange-950/20 p-8 border-2 border-orange-500/30 flex flex-col md:flex-row items-center gap-6 shadow-xl">
           <div className="bg-orange-600 p-4 rounded-none border-2 border-orange-400">
              <LifeBuoy className="w-10 h-10 text-white animate-spin-slow" />
           </div>
           <div className="flex-1 space-y-1">
              <h2 className="text-2xl font-black uppercase italic">Protocol Attention Required</h2>
              <p className="text-sm font-bold text-orange-200">The following incidents have exceeded the 10-minute unassigned threshold. Immediate resource allocation is mandatory.</p>
           </div>
        </div>

        <div className="bg-white/5 p-4 border border-white/10">
          <input
            type="text"
            placeholder="SEARCH ESCALATION RECORDS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none text-white font-black text-lg uppercase tracking-wider focus:outline-none placeholder:text-gray-600 h-12 px-2"
          />
        </div>

        <div className="space-y-6">
          {isLoading && requests.length === 0 ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-orange-500 mb-4" />
              <p className="text-xs font-black text-orange-300 uppercase tracking-[0.3em]">Synching with network...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-gray-700 bg-white/5">
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Nominal State: No escalated cases detected</p>
            </div>
          ) : filteredRequests.map((request) => {
            const waitTimeMin = Math.floor((Date.now() - new Date(request.createdAt).getTime()) / 60000)
            
            return (
              <div key={request.id} className="bg-[#1E293B] border-2 border-orange-500/50 flex flex-col md:flex-row overflow-hidden hover:border-orange-500 transition-all">
                <div className="bg-orange-600 p-8 flex flex-col items-center justify-center min-w-[200px] gap-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-orange-100 leading-none">LATENCY</p>
                   <p className="text-4xl font-black text-white">{waitTimeMin}m</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-orange-200 bg-orange-800 px-2 py-1">OVER LIMIT</p>
                </div>
                
                <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Incident Detail</p>
                        <p className="text-xl font-black uppercase leading-tight">{request.trackingCode}</p>
                        <div className="mt-2">
                           <PriorityBadge priority={request.priority} size="sm" />
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Subject</p>
                        <p className="text-xs font-bold uppercase">{request.patient?.fullName || 'UNKNOWN'}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location Matrix</p>
                        <div className="flex items-start gap-2 text-white">
                           <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                           <p className="text-sm font-bold uppercase leading-tight">{request.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <p className="text-[11px] font-bold text-orange-400 italic">"Escalated due to lack of available units in sector."</p>
                      </div>
                   </div>

                   <div className="flex flex-col justify-center gap-4">
                      <Button 
                        onClick={() => { setSelectedRequest(request); setIsAssignModalOpen(true); }}
                        className="h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-none font-black uppercase tracking-widest text-xs border-b-4 border-orange-900 active:translate-y-1 transition-all flex items-center justify-center gap-3 shadow-xl"
                      >
                         <Truck className="w-5 h-5" />
                         FORCE ASSIGN
                      </Button>
                      <Button className="h-12 bg-transparent hover:bg-white/10 text-gray-400 rounded-none border border-gray-700 text-xs font-black uppercase">
                         View Audit
                      </Button>
                   </div>
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
