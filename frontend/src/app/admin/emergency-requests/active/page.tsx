'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Siren, 
  Truck, 
  MapPin, 
  Clock, 
  RefreshCw,
  Search,
  ArrowRight,
  Shield,
  Activity,
  Building2,
  Navigation,
  CheckCircle2,
  Navigation2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { emergencyRequestsService } from '@/lib/api'
import { EmergencyRequest } from '@/types'
import { formatDistanceToNow } from 'date-fns'

// Shared Components
import StatusBadge from '@/components/features/emergency/StatusBadge'
import PriorityBadge from '@/components/features/emergency/PriorityBadge'
import EmergencyStatsBar from '@/components/features/emergency/EmergencyStatsBar'
import StatusUpdateModal from '@/components/features/emergency/StatusUpdateModal'

export default function ActiveMissionsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const activeStatuses = ['ON_THE_WAY', 'ARRIVED', 'PICKED_UP', 'TRANSPORTING', 'AT_HOSPITAL']

  const fetchRequests = async () => {
    try {
      if (requests.length === 0) setIsLoading(true)
      const data = await emergencyRequestsService.getAll()
      setRequests(data.filter(r => activeStatuses.includes(r.status)))
    } catch (err) {
      console.error('Failed to fetch active missions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 8000)
    return () => clearInterval(interval)
  }, [])

  const stats = {
    total: requests.length,
    active: requests.length,
    pending: 0,
    critical: requests.filter(r => r.priority === 'CRITICAL').length,
  }

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''} ${request.pickupLocation} ${request.ambulance?.ambulanceNumber || ''}`.toLowerCase()
    return searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const openUpdateModal = (request: EmergencyRequest) => {
    setSelectedRequest(request)
    setIsUpdateModalOpen(true)
  }

  const getProgress = (status: string) => {
    const stages = ['ON_THE_WAY', 'ARRIVED', 'PICKED_UP', 'TRANSPORTING', 'AT_HOSPITAL']
    const index = stages.indexOf(status)
    return ((index + 1) / stages.length) * 100
  }

  return (
    <div className="bg-[#0F172A] min-h-screen font-sans">
      <header className="bg-[#1E293B] text-white px-8 py-5 flex items-center justify-between shadow-2xl sticky top-0 z-50 border-b-2 border-indigo-500">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2 border border-indigo-400">
            <Siren className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight italic">Active Missions</h1>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] leading-none">Real-Time Deployment Grid</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchRequests}
            className="bg-transparent border-gray-700 text-white hover:bg-gray-800 rounded-none h-12 uppercase font-black text-xs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            SYNCH GRID
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto space-y-8 text-white">
        <EmergencyStatsBar stats={stats} />

        <div className="bg-[#1E293B] p-4 shadow-lg flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="SEARCH LIVE MISSIONS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-[#0F172A] border border-gray-700 text-white font-black text-sm uppercase tracking-wider focus:outline-none focus:border-indigo-500 rounded-none placeholder:text-gray-700 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading && requests.length === 0 ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-indigo-500 mb-4" />
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Interpreting Satellite Data...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-20 text-center bg-[#1E293B]/50 border-2 border-dashed border-gray-700">
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Sector Clear: No active missions</p>
            </div>
          ) : filteredRequests.map((request) => (
            <div key={request.id} className="bg-[#1E293B]/80 border-2 border-gray-700 shadow-xl overflow-hidden group hover:border-indigo-500 transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Side Tag */}
                <div className="w-2 bg-indigo-500" />
                
                {/* Identity & Status */}
                <div className="p-6 md:w-80 border-r border-gray-700 bg-[#0F172A]/40">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Incident Log</p>
                        <p className="text-xl font-black text-white mt-1">{request.trackingCode}</p>
                      </div>
                      <PriorityBadge priority={request.priority} size="sm" />
                    </div>
                    <StatusBadge status={request.status} />
                    <div className="pt-4 border-t border-gray-800">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Duration</p>
                       <p className="text-lg font-black text-blue-400 font-mono">
                          {Math.floor((Date.now() - new Date(request.createdAt).getTime()) / 60000)}m 
                          <span className="text-[10px] ml-1">ELAPSED</span>
                       </p>
                    </div>
                  </div>
                </div>

                {/* Progress & Intel */}
                <div className="flex-1 p-6 space-y-10">
                  {/* Progress Matrix */}
                  <div className="relative px-4">
                    <div className="h-2 bg-gray-800 w-full absolute top-1/2 -translate-y-1/2 left-0" />
                    <div 
                      className="h-2 bg-indigo-500 absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-1000 origin-left shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                      style={{ width: `${getProgress(request.status)}%` }}
                    />
                    <div className="relative z-10 flex justify-between">
                       {[
                         { id: 'ON_THE_WAY', icon: Navigation2, label: 'Way' },
                         { id: 'ARRIVED', icon: MapPin, label: 'Scene' },
                         { id: 'PICKED_UP', icon: Activity, label: 'Patient' },
                         { id: 'TRANSPORTING', icon: Truck, label: 'Transit' },
                         { id: 'AT_HOSPITAL', icon: Building2, label: 'Hospital' }
                       ].map((step) => {
                         const Icon = step.icon;
                         const isPassed = activeStatuses.indexOf(request.status) >= activeStatuses.indexOf(step.id);
                         const isCurrent = request.status === step.id;
                         
                         return (
                           <div key={step.id} className="flex flex-col items-center">
                              <div className={`w-10 h-10 border-2 flex items-center justify-center transition-all ${
                                isCurrent ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110' : 
                                isPassed ? 'bg-[#1E293B] border-indigo-600 text-indigo-400' : 
                                'bg-[#0F172A] border-gray-800 text-gray-700'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-widest mt-2 ${
                                isCurrent ? 'text-white' : isPassed ? 'text-indigo-400' : 'text-gray-700'
                              }`}>
                                {step.label}
                              </span>
                           </div>
                         );
                       })}
                    </div>
                  </div>

                  {/* Incident Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Incident Location</p>
                      <p className="text-xs font-bold text-gray-300 mt-1 uppercase truncate">{request.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Medical Control</p>
                      <p className="text-xs font-bold text-gray-300 mt-1 uppercase truncate">{request.destination || 'ALLOCATING...'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Unit In-Charge</p>
                      <p className="text-xs font-bold text-indigo-400 mt-1 uppercase">{request.ambulance?.ambulanceNumber || 'V-TBD'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Operator</p>
                      <p className="text-xs font-bold font-mono text-gray-400 mt-1 uppercase">{request.driver?.firstName || 'O-TBD'}</p>
                    </div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="p-6 md:w-48 border-l border-gray-700 bg-gray-900/40 flex items-center justify-center">
                  <Button 
                    onClick={() => openUpdateModal(request)}
                    className="w-full h-16 bg-transparent hover:bg-white hover:text-[#0F172A] text-white font-black uppercase tracking-[0.2em] text-xs rounded-none border-2 border-white transition-all flex flex-col items-center justify-center gap-1 group shadow-[inset_0_-4px_0_rgba(255,255,255,0.1)]"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>UPDATE</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isUpdateModalOpen && selectedRequest && (
        <StatusUpdateModal 
          request={selectedRequest} 
          onClose={() => setIsUpdateModalOpen(false)} 
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
