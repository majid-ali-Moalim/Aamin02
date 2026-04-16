'use client'

import { Ambulance, AmbulanceStatus } from '@/types'
import { Truck, CheckCircle2, AlertTriangle, Hammer } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'

function DroppableAmbulance({ ambulance, calculateReadiness }: { ambulance: Ambulance, calculateReadiness: (a: Ambulance) => number }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `amb-${ambulance.id}`,
    data: { ambulance }
  });

  const readiness = calculateReadiness(ambulance)
  
  let statusColor = 'bg-blue-50 text-blue-600'
  let Icon = Truck
  if (ambulance.status === AmbulanceStatus.AVAILABLE) { statusColor = 'bg-emerald-50 text-emerald-600'; Icon = CheckCircle2 }
  else if (ambulance.status === AmbulanceStatus.ON_DUTY) { statusColor = 'bg-red-50 text-red-600'; Icon = AlertTriangle }
  else if (ambulance.status === AmbulanceStatus.MAINTENANCE) { statusColor = 'bg-amber-50 text-amber-600'; Icon = Hammer }

  return (
    <div 
      ref={setNodeRef}
      className={`bg-white p-5 rounded-[2rem] border-2 transition-all ${isOver ? 'border-blue-500 scale-[1.02] shadow-2xl shadow-blue-500/20' : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl shadow-sm ${statusColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ID</p>
          <p className="text-sm font-black text-secondary">{ambulance.ambulanceNumber}</p>
        </div>
      </div>
      
      <div className="text-[11px] font-bold text-gray-500 mb-4 bg-gray-50 inline-block px-3 py-1.5 rounded-lg border border-gray-100">
        {ambulance.plateNumber} • {ambulance.equipmentLevel?.name || 'Standard'}
      </div>

      {/* Readiness Bar */}
      <div className="space-y-2 mt-2">
         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
           <span>Readiness Score</span>
           <span className={readiness > 80 ? 'text-emerald-500' : readiness > 50 ? 'text-amber-500' : 'text-red-500'}>{readiness}%</span>
         </div>
         <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
           <div className={`h-full rounded-full transition-all duration-1000 ${readiness > 80 ? 'bg-emerald-500' : readiness > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${readiness}%` }} />
         </div>
      </div>
      
      {isOver && (
        <div className="mt-4 p-2 bg-blue-500 text-white text-center rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-500/40">
          <Truck className="w-3 h-3 animate-bounce" /> Drop to Dispatch
        </div>
      )}
    </div>
  )
}

export function LiveDispatchBoard({ ambulances }: { ambulances: Ambulance[] }) {
  const calculateReadiness = (amb: Ambulance) => {
    let score = 0;
    if (amb.status === AmbulanceStatus.AVAILABLE) score += 40;
    if (amb.status !== AmbulanceStatus.MAINTENANCE && amb.status !== AmbulanceStatus.UNAVAILABLE) score += 20;
    if (amb.equipmentLevel?.name === 'Advanced') score += 25;
    else if (amb.equipmentLevel?.name === 'Standard') score += 15;
    // Assuming driver proxy
    score += 15;
    return Math.min(score, 100);
  }

  // Group by status
  const available = ambulances.filter(a => a.status === AmbulanceStatus.AVAILABLE)
  const busy = ambulances.filter(a => a.status === AmbulanceStatus.ON_DUTY)

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm h-[600px] flex flex-col relative overflow-hidden group">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
       
       <div className="flex items-center justify-between mb-6 relative z-10">
         <h3 className="text-sm font-black text-secondary tracking-widest uppercase">Dispatch Board</h3>
         <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">Drop Here</div>
       </div>
       
       <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 pb-4">
          <div>
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                 <CheckCircle2 className="w-3 h-3" /> Available
               </h4>
               <span className="text-[9px] font-black text-gray-400">{available.length} Total</span>
            </div>
            {available.length === 0 ? (
               <div className="p-6 border-2 border-dashed border-red-100 rounded-3xl bg-red-50 flex items-center justify-center">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest">No Units Available</p>
               </div>
            ) : (
               <div className="flex flex-col gap-4">
                  {available.map(amb => <DroppableAmbulance key={amb.id} ambulance={amb} calculateReadiness={calculateReadiness} />)}
               </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                 <AlertTriangle className="w-3 h-3" /> Active
               </h4>
               <span className="text-[9px] font-black text-gray-400">{busy.length} Busy</span>
            </div>
            <div className="flex flex-col gap-4 opacity-75 grayscale-[50%] hover:grayscale-0 hover:opacity-100 transition-all">
               {busy.map(amb => <DroppableAmbulance key={amb.id} ambulance={amb} calculateReadiness={calculateReadiness} />)}
            </div>
          </div>
       </div>
    </div>
  )
}
