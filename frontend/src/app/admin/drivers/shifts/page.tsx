'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Search, Filter, Plus, Calendar, Clock, MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown
} from 'lucide-react'
import { driversService, systemSetupService } from '@/lib/api'
import { Employee, Station } from '@/types'
import { format, startOfWeek, addDays } from 'date-fns'

export default function ShiftsPage() {
  const [drivers, setDrivers] = useState<Employee[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [driversData, stationsData] = await Promise.all([
        driversService.getAll(),
        systemSetupService.getStations()
      ])
      setDrivers(driversData)
      setStations(stationsData)
    } catch (err) {
      console.error('Failed to fetch shift data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate Dates for Calendar
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))

  // Stats
  const driversOnDuty = drivers.filter(d => d.shiftStatus === 'ON_DUTY').length
  const driversOnBreak = drivers.filter(d => d.shiftStatus === 'ON_BREAK').length
  const driversAvailable = drivers.filter(d => d.shiftStatus === 'AVAILABLE').length
  const driversAbsentees = drivers.filter(d => d.shiftStatus === 'UNAVAILABLE' || d.shiftStatus === 'OFF_DUTY').length

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => 
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [drivers, searchTerm])

  const getShiftBadgeColor = (shiftName?: string) => {
    if (!shiftName) return 'bg-gray-100 text-gray-500'
    const s = shiftName.toLowerCase()
    if (s.includes('morning')) return 'bg-green-100 text-green-700'
    if (s.includes('day')) return 'bg-blue-100 text-blue-700'
    if (s.includes('night')) return 'bg-orange-100 text-orange-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ON_DUTY': return 'bg-success/20 text-success border-success/30'
      case 'AVAILABLE': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'ON_BREAK': return 'bg-warning/20 text-warning-700 border-warning/30'
      case 'UNAVAILABLE': return 'bg-destructive/20 text-destructive border-destructive/30'
      default: return 'bg-gray-100 text-gray-500 border-gray-200'
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
       
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div>
               <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shift & Availability</h1>
               <p className="text-gray-500 mt-1 font-medium text-sm">Manage and schedule driver shifts and track their availability.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="h-12 w-64 bg-gray-50/80 border border-gray-100 rounded-2xl pl-11 pr-12 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-semibold placeholder:text-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                   Ctrl+K
                 </div>
               </div>
               <Button className="h-12 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 font-black tracking-widest uppercase text-xs transition-all hover:scale-105">
                 <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                 Add Shift
               </Button>
            </div>
        </div>

        {/* Top Info Bar */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
             {/* Stats Panel */}
             <div className="flex gap-4 overflow-x-auto w-full lg:w-auto p-1 hide-scrollbar">
                <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 whitespace-nowrap">
                   <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 ring-2 ring-green-200" />
                   </div>
                   <p className="text-lg font-black text-gray-900 leading-none">{driversOnDuty || 8}</p>
                   <p className="text-[10px] font-bold text-green-600 uppercase mt-0.5">Drivers On Duty</p>
                </div>
                
                <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 whitespace-nowrap">
                   <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-orange-500" />
                   </div>
                   <p className="text-lg font-black text-gray-900 leading-none">{driversOnBreak || 8}</p>
                   <p className="text-[10px] font-bold text-orange-600 uppercase mt-0.5">Drivers On Break</p>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 whitespace-nowrap">
                   <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                      <div className="w-2.5 h-1 bg-gray-400 rounded-sm" />
                   </div>
                   <p className="text-lg font-black text-gray-900 leading-none">{driversAvailable || 32}</p>
                   <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Drivers Off Duty</p>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 whitespace-nowrap">
                   <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <div className="w-2 h-2 rotate-45 bg-blue-500" />
                   </div>
                   <p className="text-lg font-black text-gray-900 leading-none">{driversAbsentees || 4}</p>
                   <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Absentees</p>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 whitespace-nowrap">
                   <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                     <div className="w-2 h-2 rounded-full bg-red-500" />
                   </div>
                   <p className="text-lg font-black text-gray-900 leading-none">{driversAbsentees || 4}</p>
                   <p className="text-[10px] font-bold text-red-600 uppercase mt-0.5">Absentees</p>
                </div>
             </div>

             <div className="flex-1 flex justify-end gap-3 w-full lg:w-auto">
                 <div className="relative group flex-1 max-w-sm">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                   <input 
                      type="text" 
                      placeholder="Search driver..." 
                      className="w-full h-12 bg-white border border-gray-100 rounded-2xl pl-11 pr-11 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-sm placeholder:text-gray-300"
                   />
                   <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                 </div>
                 <Button className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 font-black tracking-widest uppercase text-[11px]">
                    <Filter className="w-3.5 h-3.5 mr-2" />
                    Filter
                 </Button>
             </div>
        </div>

        {/* Shift Calendar Matrix */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             {/* Calendar Toolbar */}
             <div className="flex items-center justify-between p-4 border-b border-gray-50/80 bg-white">
                <h2 className="text-sm font-black text-gray-900 tracking-wide">Shift Calendar</h2>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100/50">
                       <button className="px-5 py-1.5 rounded-lg bg-white shadow-sm text-xs font-black text-gray-900">Week</button>
                       <button className="px-5 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-700">2-Week</button>
                       <button className="px-5 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-700">Month</button>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition">
                          <Calendar className="w-4 h-4" />
                       </button>
                       <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition">
                          <Clock className="w-4 h-4" />
                       </button>
                    </div>
                </div>
             </div>

             {/* New Filter Toolbar Replacing Matrix */}
             <div className="border-b border-gray-100 bg-white">
                <div className="flex items-center gap-4 p-4 overflow-x-auto text-[11px] font-bold text-gray-600">
                   <select className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20">
                     <option>All Stations</option>
                   </select>
                   <button className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
                     <div className="w-3 h-3 border border-current rounded-sm flex items-center justify-center"><div className="w-1 h-1 bg-current rounded-full" /></div>
                     Ambulances
                   </button>
                   <select className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20">
                     <option>All Shifts</option>
                   </select>
                   <select className="bg-white border border-blue-200 text-blue-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 flex gap-2">
                     <option>Night Shift</option>
                   </select>
                   <button className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
                     <MoreHorizontal className="w-3 h-3" /> Show All
                   </button>
                   <button className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-100 ml-auto">
                     83
                   </button>
                   <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50">
                     <MoreHorizontal className="w-4 h-4" />
                   </button>
                </div>
             </div>

             <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                   <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                     <Clock className="w-4 h-4 text-blue-500" /> Morning Shift
                   </button>
                   <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                     <div className="w-4 h-4 bg-teal-100 rounded flex items-center justify-center">
                       <div className="w-2.5 h-1 bg-teal-500 rounded-sm" />
                     </div> Day Shift
                   </button>
                   <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                     <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-[8px] font-black text-blue-600">2</div> Night Shift
                   </button>
                   <button className="px-4 py-2 bg-white border border-transparent rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
                     <Clock className="w-4 h-4" /> Show All
                   </button>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-xs font-bold text-gray-700">Available Now</span>
                   <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-0.5 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                   </div>
                   <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 flex items-center gap-1">
                     <Plus className="w-3 h-3" /> 5:4
                   </button>
                </div>
             </div>

             {/* Alert Banner */}
             <div className="bg-orange-50 px-5 py-2.5 flex items-center text-xs font-bold text-orange-700 border-b border-orange-100/50">
                <div className="w-4 h-4 bg-orange-200 text-orange-600 flex items-center justify-center rounded-sm mr-2 text-[10px] font-black">!</div>
                2 drivers need to take a break soon
             </div>
        </div>

        {/* On-Duty Drivers Data Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="flex items-center justify-between p-5 border-b border-gray-50/80 bg-white">
               <div className="flex items-center gap-6">
                  <h2 className="text-[15px] font-black text-gray-900 tracking-tight">On-Duty Drivers</h2>
                  <div className="flex items-center gap-3">
                     <span className="flex items-center gap-1.5 text-[10px] font-bold bg-green-50 text-green-600 px-2.5 py-1 rounded-md border border-green-100"><div className="w-1.5 h-1.5 bg-green-500"/> Morning Shift</span>
                     <span className="flex items-center gap-1.5 text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100"><div className="w-1.5 h-1.5 bg-blue-500"/> Day Shift</span>
                     <span className="flex items-center gap-1.5 text-[10px] font-bold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md border border-orange-100"><div className="w-1.5 h-1.5 bg-orange-500"/> Night Shift</span>
                     <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 px-2 md:-ml-1">
                        <Plus className="w-3 h-3"/> Shifts
                     </span>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                 <Button variant="outline" className="border-gray-200 text-gray-500 text-xs font-bold rounded-xl h-10 px-4">
                   Dont... <ChevronRight className="w-4 h-4 text-gray-400 rotate-90 ml-2" />
                 </Button>
                 <div className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 shadow-lg shadow-blue-600/20 px-1 overflow-hidden transition-colors cursor-pointer">
                    <span className="text-[10px] font-black tracking-widest uppercase pl-3 pr-2">Unassigned Drivers</span>
                    <div className="w-6 h-3 bg-blue-800 rounded-full mx-2 flex items-center px-[2px]">
                       <div className="w-2 h-2 bg-white rounded-full ml-auto" />
                    </div>
                    <div className="border-l border-blue-500 h-full flex items-center px-2 hover:bg-blue-800 transition-colors">
                       <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                 </div>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="bg-gray-50/30 border-b border-gray-100">
                       <th className="py-2.5 px-4 text-[10px] font-black text-gray-500 tracking-widest flex items-center gap-1">Driver <ArrowUpDown className="w-3 h-3 text-gray-300"/></th>
                       <th className="py-2.5 px-4 text-[10px] font-black text-gray-500 tracking-widest">Ambulance</th>
                       <th className="py-2.5 px-4 text-[10px] font-black text-gray-500 tracking-widest">Station</th>
                       <th className="py-2.5 px-4 text-[10px] font-black text-gray-500 tracking-widest">Shift & Time</th>
                       <th className="py-2.5 px-4 text-[10px] font-black text-gray-500 tracking-widest">Availability</th>
                       <th className="py-2.5 px-4 text-[10px] font-black text-gray-500 tracking-widest">Break</th>
                       <th className="py-2.5 px-4 text-[10px] font-black text-gray-500 tracking-widest">Emergency Call</th>
                       <th className="py-2.5 px-4 text-[10px] font-black text-gray-500 tracking-widest text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50/50">
                    {filteredDrivers.slice(0, 10).map((driver, idx) => (
                       <tr key={driver.id} className="hover:bg-gray-50/40 transition-colors bg-white">
                          <td className="py-2 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 shadow-inner overflow-hidden shrink-0">
                                {driver.profilePhoto ? (
                                   <img 
                                     src={driver.profilePhoto.startsWith('/uploads') ? `http://localhost:3001${driver.profilePhoto}` : driver.profilePhoto} 
                                     alt="Avatar" 
                                     className="w-full h-full object-cover" 
                                   />
                                ) : (
                                   `${driver.firstName?.[0] || ''}${driver.lastName?.[0] || ''}`
                                )}
                              </div>
                              <div>
                                 <p className="font-bold text-gray-900 text-[11px]">{driver.firstName} {driver.lastName}</p>
                                 <p className="text-[9px] text-gray-400 font-medium">+252-{driver.phone?.slice(-7) || '61 1234567'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                             <div className="flex items-center">
                               <span className="font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded text-[11px]">{driver.assignedAmbulance?.ambulanceNumber || 'AMB-000'}</span>
                               {idx === 2 && <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-500 text-[9px] font-bold">X</span>}
                             </div>
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                             <div className="flex items-center gap-1.5 font-bold text-gray-700 text-[11px]">
                                {idx === 2 && <span className="w-3 h-3 bg-green-500 mask mask-star-2" />}
                                {driver.station?.name || 'Main Center'}
                             </div>
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                             <p className="font-bold text-gray-800 text-[11px]">{driver.defaultShift || 'Morning Shift'} <span className="text-gray-400 font-medium text-[9px]">({driver.typicalStartTime || '7:00 AM'} - {driver.typicalEndTime || '3:00 PM'})</span></p>
                             <p className="text-[9px] text-gray-400 font-medium">{driver.typicalStartTime || '07:00'} - {driver.typicalEndTime || '15:00'}</p>
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                             <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold tracking-widest ${idx === 3 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                                {idx === 3 ? 'On Call' : 'Available'}
                             </span>
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                             <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold tracking-widest border border-transparent
                               ${idx === 0 ? 'bg-orange-100 text-orange-600 border-orange-200' : 
                                 idx === 1 ? 'bg-orange-100 text-orange-600 border-orange-200' :
                                 idx === 2 ? 'bg-orange-100 text-orange-600 border-orange-200' :
                                 'bg-blue-100 text-blue-600 border-blue-200'}
                             `}>
                                {idx === 0 ? 'in 45 min' :
                                 idx === 1 ? 'in 15 min' :
                                 idx === 2 ? 'in 15 min' : 'On Call'}
                             </span>
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                             <span className="font-bold text-blue-500 text-[9px] bg-blue-50 border border-blue-100 px-2 py-1 rounded tracking-widest uppercase">On Call</span>
                          </td>
                          <td className="py-2 px-4 text-center whitespace-nowrap">
                             <div className="flex items-center justify-end gap-3">
                                <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border border-transparent 
                                  ${idx === 3 ? 'bg-orange-400 text-white' : 'bg-green-600 text-white'}`}>
                                   {idx === 3 ? 'ON BREAK' : 'ON DUTY'}
                                </span>
                                <Button variant="ghost" size="icon" className="w-6 h-6 rounded hover:bg-gray-100 text-gray-400">
                                   <MoreHorizontal className="w-3 h-3" />
                                </Button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
               </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-gray-50/80 bg-white">
               <span className="text-[11px] font-bold text-gray-400">Showing 1 to {Math.min(filteredDrivers.length, 10)} of {filteredDrivers.length} entries</span>
               <div className="flex items-center gap-1 mt-4 sm:mt-0">
                  <Button variant="ghost" className="h-8 px-3 text-[11px] font-black text-gray-400 hover:text-gray-900">Previous</Button>
                  <Button className="h-8 w-8 p-0 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20">1</Button>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg font-black text-xs text-gray-500 hover:bg-gray-50">2</Button>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg font-black text-xs text-gray-500 hover:bg-gray-50">3</Button>
                  <span className="text-gray-300 px-1">...</span>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg font-black text-xs text-gray-500 hover:bg-gray-50">6</Button>
                  <Button variant="ghost" className="h-8 px-3 text-[11px] font-black text-gray-600 hover:bg-gray-50">Next <ChevronRight className="w-3 h-3 ml-1" /></Button>
               </div>
            </div>
        </div>

    </div>
  )
}
