'use client'

import { useState, useEffect } from 'react'
import { 
  Shuffle, Search, Filter, Truck, User, 
  MapPin, CheckCircle2, AlertCircle, Loader2,
  Building2, ArrowRight, Shield, Activity
} from 'lucide-react'
import { ambulancesService, driversService, systemSetupService } from '@/lib/api'
import { Ambulance, Employee, Station } from '@/types'
import { Button } from '@/components/ui/button'

export default function FleetAssignmentsPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([])
  const [drivers, setDrivers] = useState<Employee[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [amb, drv, stn] = await Promise.all([
        ambulancesService.getAll(),
        driversService.getAll(),
        systemSetupService.getStations()
      ])
      setAmbulances(amb)
      setDrivers(drv)
      setStations(stn)
    } catch (err) {
      console.error('Failed to fetch assignment data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = async (ambulanceId: string, driverId: string | null) => {
    try {
      setIsSubmitting(true)
      await ambulancesService.assignDriver(ambulanceId, driverId || '')
      fetchData()
    } catch (err) {
      console.error('Failed to update assignment:', err)
      alert('Failed to update assignment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredAmbulances = ambulances.filter(amb => 
    amb.ambulanceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amb.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
           <Shuffle className="w-96 h-96 absolute -top-20 -right-20 text-white rotate-12" />
        </div>
        
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600/20 p-2 rounded-xl text-blue-400 border border-blue-500/20">
                 <Shield className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Operational Logistics</span>
           </div>
           <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Fleet Resource Allocation</h1>
           <p className="text-white/40 text-sm mt-3 font-medium max-w-2xl leading-relaxed">
              Manage the strategic pairing of medical transit units with operational personnel. Ensure optimal crew-to-vehicle ratios and station coverage.
           </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
         <div className="flex-1 relative group w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
               type="text" 
               placeholder="Search by Unit ID or Plate Number..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 h-14 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-700 transition-all focus:bg-white"
            />
         </div>
         <Button variant="outline" className="h-14 rounded-2xl px-6 bg-white border-gray-100 font-black uppercase text-[10px] tracking-widest text-gray-400">
            <Filter className="w-5 h-5 mr-3" />
            Advanced Matrix
         </Button>
      </div>

      {isLoading ? (
         <div className="p-20 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Fleet Data...</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAmbulances.map((amb) => {
               const currentDriver = drivers.find(d => d.assignedAmbulanceId === amb.id)
               return (
                  <div key={amb.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                     {/* Unit Badge */}
                     <div className="absolute top-6 right-6">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest ${
                           amb.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                           amb.status === 'ON_DUTY' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400'
                        }`}>
                           {amb.status}
                        </span>
                     </div>

                     <div className="p-8">
                        <div className="flex items-center gap-5 mb-8">
                           <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                              <Truck className="w-8 h-8 text-gray-300 group-hover:text-blue-500 transition-colors" />
                           </div>
                           <div>
                              <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase">{amb.ambulanceNumber}</h3>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{amb.plateNumber}</p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           {/* Station Assignment */}
                           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent group-hover:border-gray-100 transition-all">
                              <div className="flex items-center gap-3">
                                 <Building2 className="w-4 h-4 text-blue-400" />
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Station</span>
                              </div>
                              <span className="text-xs font-black text-secondary uppercase tracking-tight">{amb.station?.name || 'Main Hub'}</span>
                           </div>

                           {/* Personnel Linkage */}
                           <div className="space-y-3">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Personnel</p>
                              {currentDriver ? (
                                 <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-2xl bg-white border border-blue-100 flex items-center justify-center font-black text-blue-500 text-xs shadow-sm">
                                          {currentDriver.firstName[0]}{currentDriver.lastName[0]}
                                       </div>
                                       <div>
                                          <p className="text-xs font-black text-secondary uppercase tracking-tight">{currentDriver.firstName} {currentDriver.lastName}</p>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase">{currentDriver.employeeCode}</p>
                                       </div>
                                    </div>
                                    <Button 
                                       variant="ghost" 
                                       size="icon" 
                                       onClick={() => handleAssign(amb.id, null)}
                                       className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                       <Shuffle className="w-4 h-4" />
                                    </Button>
                                 </div>
                              ) : (
                                 <div className="p-5 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 opacity-60">
                                    <User className="w-5 h-5 text-gray-300" />
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Personnel Unassigned</p>
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Assignment Control */}
                        {!currentDriver && (
                           <div className="mt-8">
                              <select 
                                 onChange={(e) => handleAssign(amb.id, e.target.value)}
                                 className="w-full h-12 bg-[#0F172A] text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none cursor-pointer"
                              >
                                 <option value="">Quick Assign Driver...</option>
                                 {drivers.filter(d => !d.assignedAmbulanceId).map(d => (
                                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                                 ))}
                              </select>
                           </div>
                        )}
                        
                        <div className="mt-6 flex items-center justify-between text-[9px] font-black text-gray-300 uppercase tracking-widest px-1">
                           <div className="flex items-center gap-2">
                              <Activity className="w-3 h-3" /> System Linked
                           </div>
                           <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Operational
                           </div>
                        </div>
                     </div>
                  </div>
               )
            })}
         </div>
      )}
    </div>
  )
}
