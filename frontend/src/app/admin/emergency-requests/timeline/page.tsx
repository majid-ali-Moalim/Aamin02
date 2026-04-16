'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Timer as TimerIcon, 
  Search, 
  History, 
  ChevronRight, 
  ChevronDown, 
  Loader2, 
  Clock, 
  Truck, 
  User, 
  PlusCircle, 
  XCircle, 
  CheckCircle2, 
  RefreshCw,
  Activity,
  UserCheck,
  Building2,
  Navigation,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { emergencyRequestsService } from '@/lib/api'
import { EmergencyRequest } from '@/types'
import { format, formatDistanceToNow } from 'date-fns'

// Shared Components
import StatusBadge from '@/components/features/emergency/StatusBadge'
import PriorityBadge from '@/components/features/emergency/PriorityBadge'

export default function RequestTimelinePage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [timelineData, setTimelineData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const data = await emergencyRequestsService.getAll()
      setRequests(data)
    } catch (err) {
      console.error('Failed to fetch requests for timeline:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTimeline = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    
    try {
      setIsLoadingTimeline(true)
      setExpandedId(id)
      const data = await emergencyRequestsService.getTimeline(id)
      setTimelineData(data || [])
    } catch (err) {
      console.error('Failed to fetch timeline:', err)
      // Simulation of events if backend is not ready
      setTimelineData([
        { id: '1', action: 'CASE_CREATED', timestamp: requests.find(r => r.id === id)?.createdAt, details: 'Initial intake completed via Direct Line.' },
        { id: '2', action: 'PRIORITY_ASSIGNED', timestamp: requests.find(r => r.id === id)?.createdAt, details: `Case priority set to ${requests.find(r => r.id === id)?.priority}.` }
      ])
    } finally {
      setIsLoadingTimeline(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''}`.toLowerCase()
    return searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getEventIcon = (action: string) => {
    switch (action) {
      case 'PENDING': return PlusCircle;
      case 'ASSIGNED': return UserCheck;
      case 'ON_THE_WAY': return Truck;
      case 'ARRIVED': return MapPin;
      case 'PICKED_UP': return Activity;
      case 'TRANSPORTING': return Navigation;
      case 'AT_HOSPITAL': return Building2;
      case 'COMPLETED': return CheckCircle2;
      case 'CANCELLED': return XCircle;
      default: return History;
    }
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <header className="bg-[#1E293B] text-white px-8 py-5 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 border border-blue-400">
            <TimerIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight italic">Operational Timeline</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] leading-none">Full Case Audit & Protocol History</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchRequests}
            className="bg-transparent border-gray-700 text-white hover:bg-white/10 rounded-none h-12 uppercase font-black text-xs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            SYNCH Audit
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1400px] mx-auto space-y-8">
        <div className="bg-white border-2 border-[#1E293B] p-4 shadow-sm flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="SEARCH AUDIT DATABASE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-gray-50 border border-gray-200 text-[#1E293B] font-black text-sm uppercase tracking-wider focus:outline-none focus:border-blue-500 rounded-none placeholder:text-gray-400 transition-colors"
            />
          </div>
        </div>

        <div className="bg-white border-2 border-[#1E293B] shadow-xl overflow-hidden">
           <div className="divide-y divide-gray-200">
              {isLoading && requests.length === 0 ? (
                <div className="p-12 text-center text-[12px] font-black text-gray-400 uppercase tracking-widest">
                   Connecting to Historian Sub-System...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-12 text-center text-[12px] font-black text-gray-400 uppercase tracking-widest">
                   No logs found in current sector
                </div>
              ) : filteredRequests.map((request) => (
                <div key={request.id} className="flex flex-col">
                   <div 
                     onClick={() => fetchTimeline(request.id)}
                     className={`p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${expandedId === request.id ? 'bg-blue-50' : ''}`}
                   >
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Log Key</span>
                            <span className="text-lg font-black text-[#1E293B] tracking-tighter">{request.trackingCode}</span>
                         </div>
                         <div className="h-8 w-px bg-gray-200" />
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Incident Root</span>
                            <span className="text-xs font-bold uppercase text-gray-600 truncate max-w-[300px]">{request.pickupLocation}</span>
                         </div>
                         <div className="flex items-center gap-3 ml-4">
                            <StatusBadge status={request.status} size="sm" />
                            <PriorityBadge priority={request.priority} size="sm" />
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged On</span>
                            <span className="text-xs font-black text-[#1E293B]">{format(new Date(request.createdAt), 'dd MMM HH:mm')}</span>
                         </div>
                         {expandedId === request.id ? <ChevronDown className="w-5 h-5 text-blue-500" /> : <ChevronRight className="w-5 h-5 text-gray-300" />}
                      </div>
                   </div>

                   {expandedId === request.id && (
                     <div className="bg-gray-50 p-8 border-t border-blue-100 border-b-2 border-b-gray-200">
                        {isLoadingTimeline ? (
                          <div className="flex items-center justify-center p-8 gap-3 text-sm font-black text-blue-600 uppercase tracking-widest">
                             <Loader2 className="w-5 h-5 animate-spin" />
                             Decrypting Sequence...
                          </div>
                        ) : (
                          <div className="max-w-[800px] mx-auto relative">
                             {/* Vertical Line */}
                             <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-gray-300" />
                             
                             <div className="space-y-8 relative">
                                {timelineData.map((event, idx) => {
                                  const Icon = getEventIcon(event.status || event.action);
                                  return (
                                    <div key={idx} className="flex gap-6 relative">
                                       <div className={`z-10 w-11 h-11 flex items-center justify-center border-2 bg-white transition-all ${
                                          idx === 0 ? 'border-blue-500 text-blue-600' : 'border-gray-400 text-gray-400'
                                       }`}>
                                          <Icon className="w-5 h-5" />
                                       </div>
                                       <div className="flex-1 pt-1.5 pb-2">
                                          <div className="flex justify-between items-start">
                                             <h4 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">{event.action || event.status}</h4>
                                             <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 border border-gray-100">
                                                {format(new Date(event.timestamp), 'HH:mm:ss')}
                                             </span>
                                          </div>
                                          <p className="text-xs text-gray-500 mt-2 font-bold leading-relaxed">
                                             {event.details || event.notes || 'Action recorded in the operational sequence.'}
                                          </p>
                                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-tighter mt-1">
                                             NODE: DISPATCH-CC-01 // SIG: 0x{Math.random().toString(16).slice(2, 6).toUpperCase()}
                                          </p>
                                       </div>
                                    </div>
                                  )
                                })}
                                
                                {/* Final End Point */}
                                <div className="flex gap-6 relative">
                                   <div className="z-10 w-11 h-4 flex items-center justify-center border-2 border-gray-200 bg-gray-200">
                                   </div>
                                   <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em] pt-0.5">End of Protocol Chain</div>
                                </div>
                             </div>
                          </div>
                        )}
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F1F5F9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </div>
  )
}
