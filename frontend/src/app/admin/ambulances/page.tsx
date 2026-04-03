'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Search, Filter, Plus, Eye, Edit, Trash2, Truck, MapPin, 
  User, AlertCircle, Settings, Wrench, X, Loader2, Calendar, Gauge, Droplet, Activity
} from 'lucide-react'
import { ambulancesService, employeesService, systemSetupService } from '@/lib/api'
import { AmbulanceStatus, Employee, Ambulance, Region, District, Station, EquipmentLevel, EmployeeRole } from '@/types'

export default function AmbulancesPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [drivers, setDrivers] = useState<Employee[]>([])

  // Selection Options
  const [availableRegions, setAvailableRegions] = useState<Region[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([])
  const [availableStations, setAvailableStations] = useState<Station[]>([])
  const [availableEquipmentLevels, setAvailableEquipmentLevels] = useState<EquipmentLevel[]>([])
  
  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedAmbulanceToAssign, setSelectedAmbulanceToAssign] = useState<Ambulance | null>(null)
  const [availableDrivers, setAvailableDrivers] = useState<Employee[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newAmbulance, setNewAmbulance] = useState({
    ambulanceNumber: '',
    plateNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleType: 'Advanced Life Support',
    regionId: '',
    districtId: '',
    stationId: '',
    assignedDriverId: '',
    status: 'AVAILABLE' as AmbulanceStatus,
    equipmentLevelId: '',
    fuelLevel: 85,
    mileage: 120000,
    lastMaintenance: '2026-03-01',
    nextMaintenance: '2026-06-01',
    notes: 'Ready for emergency dispatch',
    crewCount: 2,
    isActive: true
  })

  const fetchAmbulances = async () => {
    try {
      setLoading(true)
      const data = await ambulancesService.getAll()
      setAmbulances(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching ambulances:', err)
      setError('Failed to load ambulances. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMasterData = async () => {
    try {
      const [regions, districts, stations, equipment] = await Promise.all([
        systemSetupService.getRegions(),
        systemSetupService.getDistricts(),
        systemSetupService.getStations(),
        systemSetupService.getEquipmentLevels()
      ])
      setAvailableRegions(regions)
      setAvailableDistricts(districts)
      setAvailableStations(stations)
      setAvailableEquipmentLevels(equipment)
    } catch (err) {
      console.error('Error fetching master data:', err)
    }
  }

  const fetchDrivers = async () => {
    try {
      const roles = await systemSetupService.getRoles()
      const driverRole = roles.find((r: EmployeeRole) => r.name.toUpperCase().includes('DRIVER'))
      if (driverRole) {
        const data = await employeesService.getAll(driverRole.id)
        setDrivers(data)
      }
    } catch (err) {
      console.error('Error fetching drivers:', err)
    }
  }

  useEffect(() => {
    fetchInitialDataGlobal()
    const interval = setInterval(() => {
      ambulancesService.getAll().then(setAmbulances).catch(console.error)
    }, 10000) // 10s for "Live" feel
    return () => clearInterval(interval)
  }, [])

  const fetchInitialDataGlobal = () => {
    fetchAmbulances()
    fetchMasterData()
    fetchDrivers()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-success/10 text-success'
      case 'ON_DUTY': return 'bg-info/10 text-info'
      case 'MAINTENANCE': return 'bg-warning/10 text-warning'
      case 'UNAVAILABLE': return 'bg-destructive/10 text-destructive'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <Truck className="w-4 h-4" />
      case 'ON_DUTY': return <MapPin className="w-4 h-4" />
      case 'MAINTENANCE': return <Wrench className="w-4 h-4" />
      case 'UNAVAILABLE': return <AlertCircle className="w-4 h-4" />
      default: return <Truck className="w-4 h-4" />
    }
  }

  const filteredAmbulances = ambulances.filter(ambulance => {
    const matchesSearch = searchTerm === '' || 
      ambulance.ambulanceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || ambulance.status === statusFilter
    // Note: 'type' is not in the Prisma schema yet, so skipping type filter for now or using a placeholder
    
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance)
    setShowDetails(true)
  }

  const handleAddAmbulance = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      
      const ambulanceData = {
        ambulanceNumber: newAmbulance.ambulanceNumber,
        plateNumber: newAmbulance.plateNumber,
        status: newAmbulance.status,
        regionId: newAmbulance.regionId,
        districtId: newAmbulance.districtId,
        stationId: newAmbulance.stationId,
        vehicleBrand: newAmbulance.vehicleBrand,
        vehicleModel: newAmbulance.vehicleModel,
        vehicleType: newAmbulance.vehicleType,
        equipmentLevelId: newAmbulance.equipmentLevelId,
        crewCount: Number(newAmbulance.crewCount),
        isActive: newAmbulance.isActive,
        fuelLevel: Number(newAmbulance.fuelLevel),
        mileage: Number(newAmbulance.mileage),
        lastMaintenance: newAmbulance.lastMaintenance ? new Date(newAmbulance.lastMaintenance).toISOString() : null,
        nextMaintenance: newAmbulance.nextMaintenance ? new Date(newAmbulance.nextMaintenance).toISOString() : null,
        notes: newAmbulance.notes
      }

      const createdAmbulance = await ambulancesService.create(ambulanceData)
      
      if (newAmbulance.assignedDriverId) {
        await ambulancesService.assignDriver(createdAmbulance.id, newAmbulance.assignedDriverId)
      }

      setIsAddModalOpen(false)
      setNewAmbulance({
        ambulanceNumber: '',
        plateNumber: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleType: 'Advanced Life Support',
        regionId: '',
        districtId: '',
        stationId: '',
        assignedDriverId: '',
        status: 'AVAILABLE' as AmbulanceStatus,
        equipmentLevelId: '',
        fuelLevel: 85,
        mileage: 120000,
        lastMaintenance: '2026-03-01',
        nextMaintenance: '2026-06-01',
        notes: 'Ready for emergency dispatch',
        crewCount: 2,
        isActive: true
      })
      fetchAmbulances()
    } catch (err: any) {
      console.error('Error adding ambulance:', err)
      const message = err.response?.data?.message || err.message || 'Failed to add ambulance'
      alert(`Error: ${message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await ambulancesService.updateStatus(id, status)
      fetchAmbulances()
    } catch (err: any) {
      console.error('Error updating status:', err)
      alert('Failed to update status')
    }
  }

  const openAssignModal = (ambulance: Ambulance) => {
    setSelectedAmbulanceToAssign(ambulance);
    // Filter drivers that don't have assignedAmbulanceId
    const unassignedDrivers = drivers.filter(d => !d.assignedAmbulanceId);
    setAvailableDrivers(unassignedDrivers);
    setIsAssignModalOpen(true);
  };

  const handleAssignDriver = async (driverId: string) => {
    if (!selectedAmbulanceToAssign) return;
    try {
      setIsSubmitting(true);
      await ambulancesService.assignDriver(selectedAmbulanceToAssign.id, driverId);
      setIsAssignModalOpen(false);
      fetchAmbulances(); // Refresh list
    } catch (err: any) {
      console.error('Error assigning driver:', err);
      alert('Failed to assign driver');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAmbulance = async (id: string) => {
    if (confirm('Are you sure you want to delete this ambulance?')) {
      try {
        await ambulancesService.delete(id)
        fetchAmbulances()
      } catch (err: any) {
        console.error('Error deleting ambulance:', err)
        alert('Failed to delete ambulance')
      }
    }
  }

  const stats = {
    total: ambulances.length,
    available: ambulances.filter(a => a.status === 'AVAILABLE').length,
    onDuty: ambulances.filter(a => a.status === 'ON_DUTY').length,
    maintenance: ambulances.filter(a => a.status === 'MAINTENANCE').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tight">AMBULANCE MANAGEMENT</h1>
            <p className="text-muted-foreground mt-1 font-medium tracking-wide text-sm flex items-center">
              <Activity className="w-4 h-4 mr-2 text-primary" />
              Dynamic fleet tracking and deployment system
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={fetchAmbulances}>
              Refresh
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl px-6 py-6 font-black tracking-widest text-xs"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              ADD NEW AMBULANCE
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center">
          <AlertCircle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Fleet</p>
                  <p className="text-3xl font-black text-secondary mt-1">{stats.total}</p>
                </div>
                <div className="bg-info/10 p-3 rounded-2xl">
                  <Truck className="w-6 h-6 text-info" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available</p>
                  <p className="text-3xl font-black text-success mt-1">{stats.available}</p>
                </div>
                <div className="bg-success/10 p-3 rounded-2xl">
                  <Truck className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">On Duty</p>
                  <p className="text-3xl font-black text-info mt-1">{stats.onDuty}</p>
                </div>
                <div className="bg-info/10 p-3 rounded-2xl">
                  <MapPin className="w-6 h-6 text-info" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Maintenance</p>
                  <p className="text-3xl font-black text-warning mt-1">{stats.maintenance}</p>
                </div>
                <div className="bg-warning/10 p-3 rounded-2xl">
                  <Wrench className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-border/50">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-secondary/40 uppercase tracking-widest">Operational Filters</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by ID, plate number, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">All Status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_DUTY">On Duty</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-gray-900">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ambulance Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAmbulances.map((ambulance) => (
                    <tr key={ambulance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ambulance.ambulanceNumber}</div>
                          <div className="text-sm text-gray-500">{ambulance.plateNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${getStatusColor(ambulance.status)}`}>
                            {getStatusIcon(ambulance.status)}
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ambulance.status)}`}>
                            {ambulance.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          {ambulance.station?.name || ambulance.location || 'Unknown Station'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ambulance.employees && ambulance.employees.length > 0 ? (
                          <span>{ambulance.employees[0].user?.username} (Driver)</span>
                        ) : (
                          <span className="text-gray-400">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(ambulance)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {ambulance.employees?.length === 0 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                              onClick={() => openAssignModal(ambulance)}
                              title="Assign Driver"
                            >
                              <User className="w-4 h-4 mr-1" />
                              <Plus className="w-2 h-2" />
                            </Button>
                          )}
                          <select 
                            onChange={(e) => handleUpdateStatus(ambulance.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-1 py-1"
                            value={ambulance.status}
                          >
                            <option value="AVAILABLE">Available</option>
                            <option value="ON_DUTY">On Duty</option>
                            <option value="MAINTENANCE">Maintenance</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                          </select>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAmbulance(ambulance.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAmbulances.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        No ambulances found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add Ambulance Modal - High Fidelity Redesign */}
      {/* ... (existing add modal) ... */}

      {/* Assign Driver Modal */}
      {isAssignModalOpen && selectedAmbulanceToAssign && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md flex justify-center items-center z-[110] transition-all duration-500 p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col border border-white/20">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#1E293B] tracking-tight uppercase">Link Driver</h2>
                  <p className="text-xs font-bold text-gray-400 mt-1">Vehicle: {selectedAmbulanceToAssign.ambulanceNumber}</p>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Available Drivers</p>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
                  {availableDrivers.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-2xl">
                      No unassigned drivers found
                    </div>
                  ) : (
                    availableDrivers.map(driver => (
                      <button
                        key={driver.id}
                        onClick={() => handleAssignDriver(driver.id)}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-secondary uppercase tracking-tight">{driver.firstName} {driver.lastName}</p>
                            <p className="text-[10px] font-bold text-gray-400">ID: {driver.id.substring(0, 8)}</p>
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Button 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-2xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[1.5rem] max-w-lg w-full shadow-[0_20px_50px_rgba(29,53,87,0.3)] overflow-hidden my-auto border-2 border-white">
            
            {/* Modal Header with Heartbeat Effect */}
            <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 relative overflow-hidden border-b border-blue-100 flex items-center">
              {/* Heartbeat Pulse SVG Background */}
              <div className="absolute inset-x-0 bottom-0 opacity-10 pointer-events-none">
                <svg viewBox="0 0 1000 100" className="w-full h-12 text-primary stroke-current fill-none stroke-[2]">
                  <path d="M0 50 L200 50 L210 40 L220 60 L230 10 L240 90 L250 50 L450 50 L460 40 L470 60 L480 10 L490 90 L500 50 L700 50 L710 40 L720 60 L730 10 L740 90 L750 50 L1000 50" />
                </svg>
              </div>
              
              <div className="bg-white p-2 rounded-xl shadow-lg mr-4 border border-blue-50 relative z-10">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-secondary relative z-10">
                Add New Ambulance
              </h2>
              
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="ml-auto text-secondary/30 hover:text-primary transition-colors relative z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddAmbulance} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-white">
              
              {/* Row 1: Identification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-secondary flex-shrink-0">Ambulance No:</span>
                  <input
                    required
                    type="text"
                    placeholder="AMB-001"
                    className="flex-grow px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-bold placeholder:text-secondary/20 transition-all text-secondary"
                    value={newAmbulance.ambulanceNumber}
                    onChange={(e) => setNewAmbulance({...newAmbulance, ambulanceNumber: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-secondary flex-shrink-0">Plate Number:</span>
                  <input
                    required
                    type="text"
                    placeholder="SO-12345"
                    className="flex-grow px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-bold placeholder:text-secondary/20 transition-all text-secondary"
                    value={newAmbulance.plateNumber}
                    onChange={(e) => setNewAmbulance({...newAmbulance, plateNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-0.5 rounded-lg flex items-center shadow-sm">
                  <div className="bg-white p-0.5 rounded-md">
                    <div className="bg-primary p-0.5 rounded-sm">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="ml-2 text-[10px] font-black text-white uppercase tracking-widest italic">Vehicle Information</span>
                </div>

                <div className="space-y-3 px-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Vehicle Details:</span>
                    <div className="flex-grow grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Brand (e.g. Toyota)"
                        className="px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold placeholder:text-secondary/20 text-secondary"
                        value={newAmbulance.vehicleBrand}
                        onChange={(e) => setNewAmbulance({...newAmbulance, vehicleBrand: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Model (e.g. Hiace)"
                        className="px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold placeholder:text-secondary/20 text-secondary"
                        value={newAmbulance.vehicleModel}
                        onChange={(e) => setNewAmbulance({...newAmbulance, vehicleModel: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Vehicle Model:</span>
                    <select
                      className="flex-grow px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat text-secondary"
                      value={newAmbulance.vehicleType}
                      onChange={(e) => setNewAmbulance({...newAmbulance, vehicleType: e.target.value})}
                    >
                      {['Basic', 'Intermediate', 'Advanced Life Support', 'Critical Care', 'Patient Transport'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Assignment & Location */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-0.5 rounded-lg flex items-center shadow-sm">
                  <div className="bg-white p-0.5 rounded-md">
                    <div className="bg-primary p-0.5 rounded-sm">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="ml-2 text-[10px] font-black text-white uppercase tracking-widest italic">Assignment & Location</span>
                </div>

                <div className="space-y-3 px-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Region:</span>
                    <select
                      required
                      className="flex-grow px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat text-secondary"
                      value={newAmbulance.regionId}
                      onChange={(e) => setNewAmbulance({...newAmbulance, regionId: e.target.value, districtId: ''})}
                    >
                      <option value="">Select region</option>
                      {availableRegions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">District:</span>
                    <select
                      required
                      disabled={!newAmbulance.regionId}
                      className="flex-grow px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat text-secondary"
                      value={newAmbulance.districtId}
                      onChange={(e) => setNewAmbulance({...newAmbulance, districtId: e.target.value})}
                    >
                      <option value="">Select district</option>
                      {availableDistricts.filter(d => d.regionId === newAmbulance.regionId).map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Station:</span>
                    <select
                      required
                      className="flex-grow px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat text-secondary"
                      value={newAmbulance.stationId}
                      onChange={(e) => setNewAmbulance({...newAmbulance, stationId: e.target.value})}
                    >
                      <option value="">Select station</option>
                      {availableStations.map(station => (
                        <option key={station.id} value={station.id}>{station.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Assigned Driver:</span>
                    <select
                      className="flex-grow px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat text-secondary"
                      value={newAmbulance.assignedDriverId}
                      onChange={(e) => setNewAmbulance({...newAmbulance, assignedDriverId: e.target.value})}
                    >
                      <option value="">Select driver</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.user?.username}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Status & Condition */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-0.5 rounded-lg flex items-center shadow-sm">
                  <div className="bg-white p-0.5 rounded-md">
                    <div className="bg-primary p-0.5 rounded-sm">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="ml-2 text-[10px] font-black text-white uppercase tracking-widest italic">Status & Condition</span>
                </div>

                <div className="space-y-3 px-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Status:</span>
                    <select
                      className="flex-grow px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat text-secondary"
                      value={newAmbulance.status}
                      onChange={(e) => setNewAmbulance({...newAmbulance, status: e.target.value as AmbulanceStatus})}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Equipment Level:</span>
                    <select
                      required
                      className="flex-grow px-3 py-1.5 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat text-secondary"
                      value={newAmbulance.equipmentLevelId}
                      onChange={(e) => setNewAmbulance({...newAmbulance, equipmentLevelId: e.target.value})}
                    >
                      <option value="">Select level</option>
                      {availableEquipmentLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Fuel Level:</span>
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-1.5 flex items-center justify-between w-40 relative overflow-hidden group">
                      <div className="flex items-center space-x-1.5 relative z-10">
                        <Droplet className="w-4 h-4 text-secondary" />
                        <div className="flex items-center text-success font-black text-xs">
                          <Plus className="w-2.5 h-2.5 rotate-45 mr-0.5" />
                          <span>{newAmbulance.fuelLevel} %</span>
                        </div>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={newAmbulance.fuelLevel}
                        onChange={(e) => setNewAmbulance({...newAmbulance, fuelLevel: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-secondary w-28">Mileage:</span>
                    <div className="flex-grow flex items-center bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-1.5">
                      <input
                        type="text"
                        placeholder="120000"
                        className="flex-grow bg-transparent border-none outline-none text-secondary font-bold text-xs"
                        value={newAmbulance.mileage}
                        onChange={(e) => setNewAmbulance({...newAmbulance, mileage: Number(e.target.value)})}
                      />
                      <span className="text-secondary/40 font-bold ml-1 text-[10px]">km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Notes */}
              <div className="space-y-3 px-1">
                <span className="text-xs font-bold text-secondary">Notes:</span>
                <textarea
                  rows={3}
                  placeholder="Ready for emergency dispatch"
                  className="w-full px-4 py-3 bg-white border border-blue-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-secondary font-medium transition-all shadow-sm text-xs"
                  value={newAmbulance.notes}
                  onChange={(e) => setNewAmbulance({...newAmbulance, notes: e.target.value})}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-4 px-1 pb-2">
                <button 
                  type="button" 
                  className="flex-1 py-4 bg-gradient-to-b from-slate-400 to-slate-500 text-white font-black rounded-xl shadow-md hover:-translate-y-0.5 transition-all text-[10px] uppercase tracking-widest"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[1.5] py-4 bg-gradient-to-b from-primary to-destructive text-white font-black rounded-xl shadow-md hover:-translate-y-0.5 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      <span>Create Ambulance</span>
                      <X className="w-4 h-4 rotate-[135deg]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal (Modified for real data) */}
      {showDetails && selectedAmbulance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ambulance Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase font-semibold">Ambulance Number</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAmbulance.ambulanceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-semibold">Plate Number</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAmbulance.plateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-semibold">Current Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedAmbulance.status)}`}>
                    {selectedAmbulance.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase font-semibold">Last Known Location</p>
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    {selectedAmbulance.district?.name}, {selectedAmbulance.station?.name}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-semibold">Vehicle Specs</p>
                  <p className="text-gray-900">{selectedAmbulance.vehicleBrand} {selectedAmbulance.vehicleModel} ({selectedAmbulance.vehicleType})</p>
                  <p className="text-xs text-secondary/60 mt-1 font-bold">Equipment: {selectedAmbulance.equipmentLevel?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-semibold">Technical Stats</p>
                  <div className="space-y-1 mt-1 text-sm">
                    <div className="flex items-center">
                      <Droplet className="w-3.5 h-3.5 mr-2 text-blue-500" />
                      <span>Fuel: {selectedAmbulance.fuelLevel}%</span>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="w-3.5 h-3.5 mr-2 text-gray-500" />
                      <span>Mileage: {selectedAmbulance.mileage?.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-yellow-500" />
                      <span>Next Maintenance: {selectedAmbulance.nextMaintenance ? new Date(selectedAmbulance.nextMaintenance).toLocaleDateString() : 'TBD'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedAmbulance.employees && selectedAmbulance.employees.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Assigned Personnel</h3>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-4">
                    <User className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedAmbulance.employees[0].user?.username}</p>
                    <p className="text-sm text-gray-500 font-bold">{selectedAmbulance.employees[0].employeeRole?.name || 'DRIVER'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setShowDetails(false)} className="bg-gray-900 text-white px-8">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
