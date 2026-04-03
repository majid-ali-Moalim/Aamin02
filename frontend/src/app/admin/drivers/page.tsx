'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, Search, Filter, Plus, Eye, Edit, MoreHorizontal, 
  MapPin, Phone, Truck, Calendar, Activity, Shield, 
  CheckCircle2, AlertCircle, Clock, Loader2, Download
} from 'lucide-react'
import { driversService, systemSetupService, ambulancesService } from '@/lib/api'
import { Employee, Station, Ambulance } from '@/types'
import { format } from 'date-fns'

export default function DriversDashboard() {
  const [drivers, setDrivers] = useState<Employee[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stations, setStations] = useState<Station[]>([])
  const [ambulances, setAmbulances] = useState<Ambulance[]>([])
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [stationFilter, setStationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [shiftFilter, setShiftFilter] = useState('')

  useEffect(() => {
    fetchData()
    fetchMasterData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [driversData, statsData] = await Promise.all([
        driversService.getAll(),
        driversService.getStats()
      ])
      setDrivers(driversData)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to fetch drivers data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMasterData = async () => {
    try {
      const [stationsData, ambulancesData] = await Promise.all([
        systemSetupService.getStations(),
        ambulancesService.getAll()
      ])
      setStations(stationsData)
      setAmbulances(ambulancesData)
    } catch (err) {
      console.error('Failed to fetch master data:', err)
    }
  }

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      const nameMatch = `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        driver.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        driver.phone?.includes(searchTerm)
      
      const stationMatch = !stationFilter || driver.stationId === stationFilter
      const statusMatch = !statusFilter || driver.status === statusFilter
      const shiftMatch = !shiftFilter || driver.shiftStatus === shiftFilter

      return nameMatch && stationMatch && statusMatch && shiftMatch
    })
  }, [drivers, searchTerm, stationFilter, statusFilter, shiftFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-success/10 text-success border-success/20'
      case 'ON_DUTY': return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'ON_BREAK': return 'bg-warning/10 text-warning border-warning/20'
      case 'UNAVAILABLE': return 'bg-destructive/10 text-destructive border-destructive/20'
      default: return 'bg-gray-100 text-gray-500 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Drivers</h1>
          <p className="text-gray-500 mt-1">Manage driver operations, assignments, shifts, and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold h-11 px-5 shadow-sm bg-white">
            <Download className="w-4 h-4 mr-2" />
            Import Drivers
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-900/20 font-black h-11 px-6">
            <Plus className="w-5 h-5 mr-2" />
            Add New Driver
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Drivers', value: stats?.total || 0, icon: Users, color: 'blue' },
          { label: 'Available', value: stats?.available || 0, icon: CheckCircle2, color: 'green' },
          { label: 'On Duty', value: stats?.onDuty || 0, icon: Activity, color: 'orange' },
          { label: 'On Break', value: stats?.onBreak || 0, icon: Clock, color: 'purple' },
          { label: 'Unavailable', value: stats?.unavailable || 0, icon: AlertCircle, color: 'red' },
          { label: 'License Expiring', value: stats?.expiringLicenses || 0, icon: Shield, color: 'cyan' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl bg-${stat.color}-50`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <span className="text-2xl font-black text-gray-900 leading-none">{stat.value}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              {stat.label === 'License Expiring' && stat.value > 0 && (
                <p className="text-[8px] text-red-500 font-bold mt-1">Within 30 days</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, phone, code, or license..."
              className="w-full pl-12 pr-6 h-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 focus:bg-white transition-all font-medium text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              className="h-12 bg-gray-50 border-none rounded-2xl px-6 font-bold text-gray-700 focus:ring-2 focus:ring-red-500/10 min-w-[160px]"
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
            >
              <option value="">All Stations</option>
              {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select 
              className="h-12 bg-gray-50 border-none rounded-2xl px-6 font-bold text-gray-700 focus:ring-2 focus:ring-red-500/10 min-w-[140px]"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
            >
              <option value="">All Shifts</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_DUTY">On Duty</option>
              <option value="ON_BREAK">On Break</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
            <Button variant="outline" className="h-12 rounded-2xl px-6 font-bold bg-white">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Syncing Driver Data...</p>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="p-20 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">No Drivers Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or add a new driver to the system.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Code/Phone</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Station/Assignment</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Status</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">License</th>
                  <th className="py-4 px-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDrivers.map(driver => (
                  <tr key={driver.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 shadow-inner overflow-hidden shrink-0">
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
                          <div className="font-bold text-gray-900 leading-tight">{driver.firstName} {driver.lastName}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{driver.employeeRole?.name || 'Driver'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs font-bold text-gray-700">{driver.employeeCode || 'N/A'}</div>
                      <div className="flex items-center text-[10px] text-gray-400 mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {driver.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-xs font-bold text-gray-700">
                        <MapPin className="w-3 h-3 mr-1 text-red-500" />
                        {driver.station?.name || 'Unassigned'}
                      </div>
                      <div className="flex items-center text-[10px] text-gray-400 mt-1">
                        <Truck className="w-3 h-3 mr-1" />
                        {driver.assignedAmbulance?.ambulanceNumber || 'No Ambulance'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border ${getStatusColor(driver.shiftStatus || '')}`}>
                        {driver.shiftStatus?.replace('_', ' ') || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`text-xs font-bold ${driver.licenseStatus === 'EXPIRED' ? 'text-destructive' : 'text-success'}`}>
                        {driver.licenseStatus || 'VALID'}
                      </div>
                      {driver.licenseExpiryDate && (
                        <div className="text-[10px] text-gray-400 mt-1">
                          Exp: {format(new Date(driver.licenseExpiryDate), 'MM/yyyy')}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Live Activity Board Placeholder */}
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center justify-between">
              Live Activity Board
              <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full lowercase font-medium">Real-time</span>
            </h3>
            <div className="space-y-4">
              {filteredDrivers.slice(0, 4).map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-red-500 rounded-full" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{d.firstName} {d.lastName}</p>
                      <p className="text-[10px] text-gray-400">Assigned to mission #AAM-105{i}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-gray-300">09:4{i} AM</span>
                </div>
              ))}
            </div>
         </div>

         {/* Alerts & Reminders */}
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Alerts & Reminders</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm text-orange-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs font-black text-orange-700">License Expiring Soon</p>
                   <p className="text-[10px] text-orange-600/70 mt-0.5">5 drivers' licenses expire within 30 days. Action required.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm text-red-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs font-black text-red-700">Unassigned Ambulances</p>
                   <p className="text-[10px] text-red-600/70 mt-0.5">2 ambulances currently have no driver assigned.</p>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  )
}
