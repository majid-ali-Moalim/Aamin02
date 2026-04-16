'use client'

import { Employee } from '@/types'
import { UserCheck, Clock } from 'lucide-react'

export function StaffAvailability({ employees }: { employees: Employee[] }) {
  const onDuty = employees.filter(e => e.shiftStatus === 'ON_DUTY')

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm h-[600px] flex flex-col relative overflow-hidden group">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
       
       <div className="flex items-center justify-between mb-6 relative z-10">
         <h3 className="text-sm font-black text-secondary tracking-widest uppercase">Staff Status</h3>
         <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">{onDuty.length} Active</span>
       </div>
       
       <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {employees.length === 0 && (
             <div className="flex items-center justify-center h-full text-xs font-bold text-gray-400 uppercase tracking-widest">
                No Staff Found
             </div>
          )}
          {employees.map(emp => (
            <div key={emp.id} className="flex items-center gap-4 p-3 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors">
               <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${emp.shiftStatus === 'ON_DUTY' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                  {emp.shiftStatus === 'ON_DUTY' ? <UserCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
               </div>
               <div className="overflow-hidden">
                 <p className="text-[11px] font-black text-secondary uppercase tracking-tight truncate">{emp.firstName} {emp.lastName}</p>
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{emp.employeeRole?.name || 'Team Member'}</p>
               </div>
               <div className="ml-auto">
                 <span className={`w-2 h-2 rounded-full block ${emp.shiftStatus === 'ON_DUTY' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
               </div>
            </div>
          ))}
       </div>
    </div>
  )
}
