'use client'

import { EmergencyRequest } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { Activity, Clock } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'

function DraggableEmergencyCard({ req }: { req: EmergencyRequest }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `req-${req.id}`,
    data: { request: req }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const PRIORITY_COLORS: Record<string, string> = {
    CRITICAL: 'bg-red-600',
    HIGH: 'bg-amber-500',
    MEDIUM: 'bg-blue-500',
    LOW: 'bg-emerald-500'
  }

  const waitMinutes = Math.floor((new Date().getTime() - new Date(req.createdAt).getTime()) / 60000)
  const isDelayed = waitMinutes > 5

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`bg-white p-4 rounded-2xl border ${isDelayed ? 'border-red-300 shadow-red-100 shadow-lg animate-pulse' : 'border-gray-100'} hover:shadow-xl transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 z-50 shadow-2xl scale-105' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl text-white ${PRIORITY_COLORS[req.priority] || 'bg-gray-500'}`}>
          <Activity className="w-4 h-4" />
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">CODE</p>
          <p className="text-xs font-black text-secondary">{req.trackingCode}</p>
        </div>
      </div>
      <h4 className="font-black text-secondary text-sm uppercase tracking-tight mb-2 truncate">
        {req.patient?.fullName || 'EMERGENCY CASE'}
      </h4>
      <div className="text-xs font-semibold text-gray-500 mb-3 line-clamp-1">{req.pickupLocation || 'Unknown Location'}</div>
      
      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-widest rounded-md px-2 py-1 flex items-center gap-1 ${isDelayed ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
          <Clock className="w-3 h-3" /> {waitMinutes}m wait
        </span>
        <span className={`text-[10px] font-black uppercase ${PRIORITY_COLORS[req.priority].replace('bg-', 'text-')}`}>
          {req.priority}
        </span>
      </div>
    </div>
  )
}

export function EmergencyQueue({ requests }: { requests: EmergencyRequest[] }) {
  const pendingRequests = requests.filter(r => r.status === 'PENDING').sort((a,b) => {
    const priorityWeight: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
    return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
  })

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm h-[600px] flex flex-col relative overflow-hidden group">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
       
       <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-sm font-black text-secondary tracking-widest uppercase">Emergency Queue</h3>
          <span className="bg-red-600 text-white shadow-lg shadow-red-500/30 text-[10px] font-black px-2 py-0.5 rounded flex items-center justify-center">{pendingRequests.length}</span>
       </div>
       
       <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4 pt-2 -mx-1 custom-scrollbar">
          {pendingRequests.length === 0 ? (
            <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Pending Tasks</p>
            </div>
          ) : (
            pendingRequests.map(req => <DraggableEmergencyCard key={req.id} req={req} />)
          )}
       </div>
    </div>
  )
}
