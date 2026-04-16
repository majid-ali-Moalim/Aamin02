'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Ban, 
  AlertTriangle, 
  RefreshCw,
  Search,
  Eye,
  Activity,
  ShieldAlert,
  Frown,
  Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { emergencyRequestsService } from '@/lib/api'
import { EmergencyRequest } from '@/types'
import { formatDistanceToNow } from 'date-fns'

// Shared Components
import StatusBadge from '@/components/features/emergency/StatusBadge'
import PriorityBadge from '@/components/features/emergency/PriorityBadge'
import EmergencyStatsBar from '@/components/features/emergency/EmergencyStatsBar'

export default function FailedRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchRequests = async () => {
    try {
      if (requests.length === 0) setIsLoading(true)
      const data = await emergencyRequestsService.getAll()
      // Filter for FAILED only
      setRequests(data.filter(r => r.status === 'FAILED'))
    } catch (err) {
      console.error('Failed to fetch failed requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const stats = {
    total: requests.length,
    active: 0,
    pending: 0,
    critical: requests.filter(r => r.priority === 'CRITICAL').length,
  }

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''} ${request.pickupLocation}`.toLowerCase()
    return searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="bg-[#0F172A] min-h-screen text-white">
      <header className="bg-rose-900 px-8 py-5 flex items-center justify-between shadow-2xl sticky top-0 z-50 border-b-4 border-rose-950">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2">
            <Ban className="w-8 h-8 text-rose-900" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight italic text-rose-100">Failure Register</h1>
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em] leading-none">Rejected / Resource Deficit Logs</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchRequests}
            className="bg-transparent border-rose-800 text-rose-100 hover:bg-rose-950 rounded-none h-12 uppercase font-black text-xs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            SYNCH FAILURES
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="bg-rose-950/30 border-2 border-rose-500/50 p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8">
           <div className="w-20 h-20 bg-rose-500/20 border-4 border-rose-500 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-10 h-10 text-rose-500" />
           </div>
           <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-rose-100 italic">Critical Resource Deficit Detected</h2>
              <p className="text-sm font-bold text-rose-300 leading-relaxed uppercase opacity-70">
                Incidents listed below were terminated automatically or manually due to complete exhaustion of available fleet units or certified personnel in the sector.
              </p>
           </div>
        </div>

        <div className="bg-black/40 p-4 border border-rose-500/20 flex gap-4">
          <Search className="w-5 h-5 text-rose-500 mt-3" />
          <input
            type="text"
            placeholder="SEARCH FAILURE SIGNATURES..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-white font-black text-lg uppercase tracking-wider focus:outline-none placeholder:text-rose-950 h-12"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {isLoading && requests.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                 <RefreshCw className="w-10 h-10 animate-spin mx-auto text-rose-500 mb-4" />
                 <p className="text-xs font-black text-rose-400 uppercase tracking-[0.3em]">Accessing System Vaults...</p>
              </div>
           ) : filteredRequests.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 bg-white/5">
                 <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Sector Stable: No failures detected in current matrix</p>
              </div>
           ) : (
              filteredRequests.map((request) => (
                 <div key={request.id} className="bg-[#1E293B] border-2 border-rose-900 overflow-hidden group hover:border-rose-500 transition-all shadow-xl">
                    <div className="bg-rose-950/50 p-6 border-b-2 border-rose-900 flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Failed Sequence</p>
                          <span className="text-xl font-black text-white">{request.trackingCode}</span>
                       </div>
                       <PriorityBadge priority={request.priority} size="sm" />
                    </div>

                    <div className="p-8 space-y-6">
                       <div className="space-y-4">
                          <div className="flex items-start gap-4 text-xs font-bold uppercase text-gray-400">
                             <Radio className="w-4 h-4 text-rose-500 shrink-0" />
                             <p>{request.pickupLocation}</p>
                          </div>
                          <div className="bg-black/30 p-4 border border-rose-900/30">
                             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Failure signature</p>
                             <p className="text-sm font-bold text-rose-100 italic">
                                "{request.notes || 'INSUFFICIENT RESOURCES: ALL ASSETS DEPLOYED'}"
                             </p>
                          </div>
                       </div>

                       <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                             <Activity className="w-3.5 h-3.5" />
                             Prot. Age: {formatDistanceToNow(new Date(request.createdAt))}
                          </div>
                          <Button 
                            variant="ghost" 
                            className="bg-rose-500 h-10 px-6 text-white rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-rose-400 border-b-2 border-rose-800"
                            onClick={() => router.push(`/admin/emergency-requests/timeline/${request.id}`)}
                          >
                             Review Log
                          </Button>
                       </div>
                    </div>
                    {/* Decorative bottom bar */}
                    <div className="h-1 bg-gradient-to-r from-rose-900 via-rose-500 to-rose-900" />
                 </div>
              ))
           )}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #9f1239; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}</style>
    </div>
  )
}
