'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, Phone, MapPin, Clock, User, Truck, AlertCircle, UserPlus, CheckCircle, Loader2, Navigation, Heart, Shield } from 'lucide-react'
import { emergencyRequestsService, patientsService, systemSetupService } from '@/lib/api'
import { EmergencyRequest, EmergencyRequestStatus, Priority, RequestSource, Patient, IncidentCategory, Region, District, Ambulance, Employee } from '@/types'
import { format, formatDistanceToNow } from 'date-fns'

export default function EmergencyRequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Modals state placeholders
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  // Master Data
  const [categories, setCategories] = useState<IncidentCategory[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [districts, setDistricts] = useState<District[]>([])

  // Assignment Master Data
  const [availableAmbulances, setAvailableAmbulances] = useState<Ambulance[]>([])
  const [availableDrivers, setAvailableDrivers] = useState<Employee[]>([])
  const [isFetchingUnits, setIsFetchingUnits] = useState(false)
  const [assignmentParams, setAssignmentParams] = useState({
    ambulanceId: '',
    driverId: '',
  })

  const fetchInitialData = async () => {
    try {
      setIsLoading(true)
      const [requestsResult, patientsResult, categoriesResult, regionsResult, districtsResult] = await Promise.allSettled([
        emergencyRequestsService.getAll(),
        patientsService.getAll(),
        systemSetupService.getIncidentCategories(),
        systemSetupService.getRegions(),
        systemSetupService.getDistricts()
      ])
      
      if (requestsResult.status === 'fulfilled') setRequests(requestsResult.value)
      if (patientsResult.status === 'fulfilled') setPatients(patientsResult.value)
      if (categoriesResult.status === 'fulfilled') setCategories(categoriesResult.value)
      if (regionsResult.status === 'fulfilled') setRegions(regionsResult.value)
      if (districtsResult.status === 'fulfilled') setDistricts(districtsResult.value)
      
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const openAssignModal = async (request: EmergencyRequest) => {
    setSelectedRequest(request)
    setIsAssignModalOpen(true)
    setAssignmentParams({ ambulanceId: '', driverId: '' })
    
    try {
      setIsFetchingUnits(true)
      const [ambulances, drivers] = await Promise.all([
        emergencyRequestsService.getAvailableAmbulances(),
        emergencyRequestsService.getAvailableDrivers()
      ])
      setAvailableAmbulances(ambulances)
      setAvailableDrivers(drivers)
    } catch (err) {
      console.error('Failed to fetch available units:', err)
    } finally {
      setIsFetchingUnits(false)
    }
  }

  const handleAssignUnit = async () => {
    if (!selectedRequest || !assignmentParams.driverId) {
      return alert('Please select a driver')
    }

    const selectedDriver = availableDrivers.find(d => d.id === assignmentParams.driverId)
    if (!selectedDriver?.assignedAmbulanceId) {
      return alert('This driver has no ambulance assigned. Please assign an ambulance to the driver first in Employee Management.')
    }

    try {
      setIsSubmitting(true)
      await emergencyRequestsService.assignAmbulance(
        selectedRequest.id, 
        selectedDriver.assignedAmbulanceId, 
        assignmentParams.driverId
      )
      setIsAssignModalOpen(false)
      const updated = await emergencyRequestsService.getAll()
      setRequests(updated)
    } catch (error: any) {
      alert(`Assignment failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchInitialData()
    const interval = setInterval(() => {
      emergencyRequestsService.getAll().then(setRequests).catch(console.error)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Form State
  const [formData, setFormData] = useState({
    patientId: '', priority: Priority.HIGH, incidentCategoryId: '', requestSource: RequestSource.PHONE_CALL,
    regionId: '', districtId: '',
    pickupLocation: '', destination: '', callerName: '', callerPhone: '', symptoms: '',
    pickupLandmark: '', destinationLandmark: '', patientCondition: '', notes: '', manualDispatchNotes: '',
    newPatient: {
      fullName: '', age: '', gender: '', bloodType: '', phone: '', alternatePhone: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNewPatient, setIsNewPatient] = useState(true)

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isNewPatient && (!formData.newPatient.fullName || !formData.newPatient.phone)) return alert('New Patient limits: Full Name and Phone are mandatory')
    if (!isNewPatient && !formData.patientId) return alert('Existing Patient selection is required')
    if (!formData.pickupLocation) return alert('Pickup Location is required')

    try {
      setIsSubmitting(true)
      const payload = {
         ...formData,
         newPatient: isNewPatient ? formData.newPatient : undefined
      }
      await emergencyRequestsService.create(payload)
      setIsAddModalOpen(false)
      // Reset form
      setFormData({
        patientId: '', priority: Priority.HIGH, incidentCategoryId: '', requestSource: RequestSource.PHONE_CALL,
        regionId: '', districtId: '',
        pickupLocation: '', destination: '', callerName: '', callerPhone: '', symptoms: '',
        pickupLandmark: '', destinationLandmark: '', patientCondition: '', notes: '', manualDispatchNotes: '',
        newPatient: { fullName: '', age: '', gender: '', bloodType: '', phone: '', alternatePhone: '' }
      })
      // Refresh list
      const updated = await emergencyRequestsService.getAll()
      setRequests(updated)
    } catch (error: any) {
      console.error('Dispatch error details:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Unknown dispatch error'
      alert(`Failed to dispatch: ${errorMsg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': return { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: <Clock className="w-4 h-4 text-yellow-600" /> }
      case 'ASSIGNED': return { bg: 'bg-blue-50', text: 'text-blue-700', icon: <User className="w-4 h-4 text-blue-600" /> }
      case 'DISPATCHED': return { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: <Truck className="w-4 h-4 text-indigo-600" /> }
      case 'ON_SCENE': return { bg: 'bg-purple-50', text: 'text-purple-700', icon: <MapPin className="w-4 h-4 text-purple-600" /> }
      case 'TRANSPORTING': return { bg: 'bg-teal-50', text: 'text-teal-700', icon: <Truck className="w-4 h-4 text-teal-600" /> }
      case 'ARRIVED_HOSPITAL': return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <AlertCircle className="w-4 h-4 text-emerald-600" /> }
      case 'COMPLETED': return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <AlertCircle className="w-4 h-4 text-gray-600" /> }
      case 'CANCELLED': return { bg: 'bg-red-50', text: 'text-red-700', icon: <AlertCircle className="w-4 h-4 text-red-600" /> }
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', icon: <Clock className="w-4 h-4 text-gray-600" /> }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800 pointer-events-none'
      case 'CRITICAL': return 'bg-red-100 text-red-800 animate-pulse pointer-events-none'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRequests = requests.filter(request => {
    const searchTarget = `${request.trackingCode} ${request.patient?.fullName || ''} ${request.patient?.phone || ''} ${request.pickupLocation}`.toLowerCase()
    const matchesSearch = searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || request.status === statusFilter
    const matchesPriority = priorityFilter === '' || request.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Stats
  const activeCases = requests.filter(r => ['PENDING', 'ASSIGNED', 'DISPATCHED', 'ON_SCENE', 'TRANSPORTING', 'ARRIVED_HOSPITAL'].includes(r.status)).length
  const completedToday = requests.filter(r => r.status === 'COMPLETED' && new Date(r.createdAt).toDateString() === new Date().toDateString()).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary tracking-tight">Emergency Requests</h1>
            <p className="text-gray-500 mt-1">Live dispatch workflow tracking & active cases</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-200 text-gray-600 font-semibold shadow-sm rounded-xl">
              Export Data
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-bold shadow-md shadow-primary/20 rounded-xl"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Patient Request
            </Button>
          </div>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search requests by code, patient, phone or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-gray-50/50 min-w-[160px] font-medium text-gray-600"
            >
              <option value="">All Statuses</option>
              {Object.keys(EmergencyRequestStatus).map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-gray-50/50 min-w-[160px] font-medium text-gray-600"
            >
              <option value="">All Priorities</option>
              {Object.keys(Priority).map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <Button 
              variant="outline" 
              className="h-[50px] w-[50px] p-0 rounded-2xl border-gray-100 text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Data Table matching reference image */}
      <div className="bg-white rounded-[2rem] shadow-[-10px_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Request Details</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Priority</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Location</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Assigned Team</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Time</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading requests...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium tracking-wide">
                    No emergency requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const statusConf = getStatusConfig(request.status)
                  return (
                    <tr key={request.id} className="hover:bg-[#f6f8fb] transition-colors group">
                      
                      {/* REQUEST DETAILS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-secondary">{request.trackingCode}</span>
                          <span className="text-sm font-medium text-gray-600 mt-0.5">{request.patient?.fullName || 'Unknown Patient'}</span>
                          <div className="flex items-center text-xs text-gray-400 mt-1 font-medium">
                            <Phone className="w-3 h-3 mr-1.5" />
                            {request.callerPhone || request.patient?.phone || 'No phone'}
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl border border-white/50 shadow-sm ${statusConf.bg}`}>
                            {statusConf.icon}
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${statusConf.bg} ${statusConf.text}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>

                      {/* PRIORITY */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-white shadow-sm ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm font-medium text-gray-700">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            <span className="truncate max-w-[200px]">{request.pickupLocation}</span>
                          </div>
                          <div className="text-xs font-semibold text-gray-400 mt-1 pl-5 truncate max-w-[200px]">
                            To: {request.destination || 'Not Specified'}
                          </div>
                        </div>
                      </td>

                      {/* ASSIGNED TEAM */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!request.ambulance && !request.driver && !request.dispatcher ? (
                          <span className="text-sm font-medium text-gray-400">Not Assigned</span>
                        ) : (
                          <div className="flex flex-col space-y-1">
                            {request.ambulance && (
                              <div className="flex items-center text-xs font-semibold text-gray-600">
                                <Truck className="w-3 h-3 mr-1.5 text-indigo-400" />
                                {request.ambulance.ambulanceNumber}
                              </div>
                            )}
                            {request.driver && (
                              <div className="flex items-center text-xs font-medium text-gray-500">
                                <User className="w-3 h-3 mr-1.5 text-gray-400" />
                                {request.driver.firstName} {request.driver.lastName}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* TIME */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700">
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </span>
                          <span className="text-xs font-medium text-gray-400 mt-1">
                            Request: {format(new Date(request.createdAt), 'hh:mm a')}
                          </span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm hover:text-primary hover:border-primary/30" onClick={() => { setSelectedRequest(request); setShowDetails(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {request.status === 'PENDING' && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg shadow-sm bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                              onClick={() => openAssignModal(request)}
                              title="Assign Unit"
                            >
                              <Truck className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm hover:text-amber-600 hover:border-amber-200">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm hover:text-red-600 hover:border-red-200">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced High-Fidelity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm flex justify-center items-center z-[100] transition-all duration-500 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#EAF1F8] w-full max-w-[800px] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col my-auto border border-white/40">
            
            {/* Header */}
            <div className="h-20 bg-gradient-to-r from-[#599AE1] to-[#ABCFF5] relative flex items-center px-6 gap-4 border-b border-white/40 shadow-sm">
              <div className="absolute top-0 right-0 bottom-0 opacity-20 w-1/3 overflow-hidden pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <path d="M0 50 L20 50 L30 20 L40 80 L50 10 L60 90 L70 40 L80 50 L100 50" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <Truck className="w-12 h-12 text-white drop-shadow-md" />
              <h2 className="text-2xl font-bold text-white drop-shadow-sm z-10">Add Emergency Request</h2>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto w-full space-y-5">
               <form id="dispatchForm" onSubmit={handleCreateRequest} className="space-y-5">
                 
                 {/* 1. Patient Information */}
                 <div className="bg-white rounded border border-[#C5D7E8] shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#599AE1] to-[#ABCFF5] h-10 flex items-center justify-between pr-2 border-b border-[#C5D7E8]">
                      <div className="flex items-center h-full">
                        <div className="bg-[#E63946] text-white px-3 flex items-center justify-center h-full mr-3 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                          <User className="w-4 h-4 font-bold" />
                        </div>
                        <span className="text-[13px] font-bold text-white drop-shadow-sm uppercase tracking-wide">Patient Information</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setIsNewPatient(!isNewPatient)}
                        className="bg-[#1E60D1] hover:bg-[#154bb0] text-white text-xs px-3 py-1.5 rounded shadow-sm font-semibold flex items-center transition-colors border border-blue-400/50"
                      >
                         {isNewPatient ? <><Search className="w-3.5 h-3.5 mr-1.5" /> Search Existing Patient</> : <><UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add New Patient</>}
                      </button>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] space-y-4">
                      
                      {isNewPatient ? (
                        <>
                          <div className="grid grid-cols-[110px_1fr] items-center gap-2 relative">
                            <label className="text-xs font-bold text-[#4B5E76]">Full Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                               <User className="w-4 h-4 text-gray-300 absolute left-2.5 top-2.5" />
                               <input type="text" placeholder="Enter patient full name" required value={formData.newPatient.fullName} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, fullName: e.target.value}})} className="w-full pl-9 p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                              <label className="text-xs font-bold text-[#4B5E76]">Age <span className="text-red-500">*</span></label>
                              <div className="flex border border-[#D1D5DB] rounded bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#599AE1] overflow-hidden">
                                <input type="number" placeholder="e.g., 35" required value={formData.newPatient.age} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, age: e.target.value}})} className="w-full p-2 text-sm outline-none" />
                                <span className="bg-[#E4ECF7] text-gray-500 text-xs font-semibold px-3 flex items-center border-l border-[#D1D5DB]">Years</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-bold text-[#4B5E76] w-[60px]">Gender <span className="text-red-500">*</span></label>
                              <select required value={formData.newPatient.gender} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, gender: e.target.value}})} className="w-full p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner">
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-bold text-[#4B5E76] whitespace-nowrap">Blood Type</label>
                              <div className="relative w-full">
                                <select value={formData.newPatient.bloodType} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, bloodType: e.target.value}})} className="w-full pl-7 p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner appearance-none">
                                  <option value="">Select blood type</option>
                                  <option value="O_POSITIVE">O+</option>
                                  <option value="O_NEGATIVE">O-</option>
                                  <option value="A_POSITIVE">A+</option>
                                  <option value="B_POSITIVE">B+</option>
                                </select>
                                <span className="absolute left-2.5 top-2.5 text-red-500"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.5c-3.6 0-7.5-2.6-7.5-7.7 0-3.3 3.9-8.4 6.7-11.8.4-.5 1.1-.5 1.5 0 2.8 3.4 6.8 8.5 6.8 11.8 0 5.1-3.9 7.7-7.5 7.7z"/></svg></span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                               <label className="text-xs font-bold text-[#4B5E76]">Phone Number <span className="text-red-500">*</span></label>
                               <div className="flex border border-[#D1D5DB] rounded bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#599AE1] overflow-hidden">
                                 <span className="bg-[#E4ECF7] text-[#1E60D1] text-xs font-bold px-3 flex items-center border-r border-[#D1D5DB]">🇸🇴 +252</span>
                                 <input type="text" placeholder="61 234 5678" required value={formData.newPatient.phone} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, phone: e.target.value}})} className="w-full p-2 text-sm outline-none" />
                               </div>
                             </div>
                             <div className="flex items-center gap-2">
                               <label className="text-xs font-bold text-[#4B5E76] w-[110px]">Alternate Phone</label>
                               <div className="relative w-full">
                                 <Phone className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                                 <input type="text" placeholder="Optional alternate number" value={formData.newPatient.alternatePhone} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, alternatePhone: e.target.value}})} className="w-full pl-9 p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner" />
                               </div>
                             </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                            <label className="text-xs font-bold text-[#4B5E76]">Find Patient <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <Search className="w-4 h-4 text-[#599AE1] absolute left-3 top-2.5" />
                              <select 
                                required={!isNewPatient}
                                value={formData.patientId}
                                onChange={e => setFormData({...formData, patientId: e.target.value})}
                                className="w-full pl-9 p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none transition-all shadow-inner"
                              >
                                <option value="">-- Choose Registered Patient --</option>
                                {patients.map(p => (
                                  <option key={p.id} value={p.id}>{p.fullName} ({p.patientCode}) - {p.phone}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {(() => {
                            const selectedExistingPatient = patients.find(p => p.id === formData.patientId);
                            if (!selectedExistingPatient) return null;
                            return (
                              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg space-y-3 pointer-events-none fade-in">
                                 <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                                   <span className="text-[11px] font-bold text-[#599AE1] uppercase tracking-wider">Active File:</span>
                                   <input disabled type="text" value={`${selectedExistingPatient.fullName} (${selectedExistingPatient.patientCode})`} className="w-full p-2 text-sm bg-white border border-blue-200/60 rounded text-slate-700 font-bold outline-none" />
                                 </div>
                                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                   <div className="flex items-center gap-2">
                                     <span className="text-[11px] font-bold text-[#599AE1] uppercase tracking-wider">Age:</span>
                                     <input disabled type="text" value={selectedExistingPatient.age ? `${selectedExistingPatient.age} Yrs` : 'N/A'} className="w-full p-2 text-sm bg-white border border-blue-200/60 rounded text-slate-700 outline-none" />
                                   </div>
                                   <div className="flex items-center gap-2">
                                     <span className="text-[11px] font-bold text-[#599AE1] uppercase tracking-wider">Gender:</span>
                                     <input disabled type="text" value={selectedExistingPatient.gender || 'N/A'} className="w-full p-2 text-sm bg-white border border-blue-200/60 rounded text-slate-700 outline-none" />
                                   </div>
                                   <div className="flex items-center gap-2 col-span-2">
                                     <span className="text-[11px] font-bold text-[#599AE1] uppercase tracking-wider">Phone:</span>
                                     <input disabled type="text" value={selectedExistingPatient.phone} className="w-full p-2 text-sm bg-white border border-blue-200/60 rounded text-slate-700 font-medium outline-none" />
                                   </div>
                                 </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                    </div>
                 </div>

                 {/* 2. Emergency Details */}
                 <div className="bg-white rounded border border-[#C5D7E8] shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#599AE1] to-[#ABCFF5] h-10 flex items-center border-b border-[#C5D7E8]">
                      <div className="bg-[#E63946] text-white px-3 flex items-center justify-center h-full mr-3 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                        <AlertCircle className="w-4 h-4 font-bold" />
                      </div>
                      <span className="text-[13px] font-bold text-white drop-shadow-sm uppercase tracking-wide">Emergency Details</span>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-gray-200 border-dashed">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4B5E76]">Request Source <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-green-600 absolute left-2.5 top-2.5" />
                            <select value={formData.requestSource} onChange={e => setFormData({...formData, requestSource: e.target.value as RequestSource})} className="w-full pl-9 p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner">
                              {Object.keys(RequestSource).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4B5E76]">Incident Category <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Plus className="w-4 h-4 text-red-500 absolute left-2.5 top-2.5" />
                            <select required value={formData.incidentCategoryId} onChange={e => setFormData({...formData, incidentCategoryId: e.target.value})} className="w-full pl-9 p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner">
                              <option value="">Select Category</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4B5E76]">Priority Level <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded border border-[#D1D5DB]">
                             <button type="button" onClick={() => setFormData({...formData, priority: Priority.HIGH})} className={`flex-1 py-1 text-xs font-bold rounded flex justify-center items-center ${formData.priority === Priority.HIGH ? 'bg-white border border-[#E63946] text-[#E63946] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><AlertCircle className="w-3 h-3 mr-1"/> HIGH</button>
                             <button type="button" onClick={() => setFormData({...formData, priority: Priority.MEDIUM})} className={`flex-1 py-1 text-xs font-bold rounded flex justify-center items-center ${formData.priority === Priority.MEDIUM ? 'bg-white border border-amber-500 text-amber-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Clock className="w-3 h-3 mr-1"/> MEDIUM</button>
                             <button type="button" onClick={() => setFormData({...formData, priority: Priority.LOW})} className={`flex-1 py-1 text-xs font-bold rounded flex justify-center items-center ${formData.priority === Priority.LOW ? 'bg-white border border-green-500 text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Truck className="w-3 h-3 mr-1"/> LOW</button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-200 border-dashed">
                        <div className="space-y-1.5 p-3 rounded bg-red-50/50 border border-red-100/50 relative">
                          <div className="absolute top-[-8px] left-3 bg-white px-1"><span className="text-[10px] font-bold text-[#E63946] flex items-center"><User className="w-3 h-3 mr-1" /> Caller Name</span></div>
                          <div className="relative mt-2">
                             <User className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                             <input type="text" placeholder="Name of person requesting (if different)" value={formData.callerName} onChange={e => setFormData({...formData, callerName: e.target.value})} className="w-full pl-9 p-2 text-sm bg-white border border-red-200/60 rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner" />
                          </div>
                        </div>
                        <div className="space-y-1.5 p-3 rounded bg-red-50/50 border border-red-100/50 relative">
                          <div className="absolute top-[-8px] left-3 bg-white px-1"><span className="text-[10px] font-bold text-[#E63946] flex items-center"><Phone className="w-3 h-3 mr-1" /> Caller Phone</span></div>
                          <div className="flex border border-red-200/60 rounded bg-white shadow-inner mt-2 overflow-hidden">
                             <span className="bg-[#F8FAFC] text-gray-500 text-xs font-bold px-3 flex items-center border-r border-[#D1D5DB]"><Phone className="w-3 h-3 mr-1" /> +252</span>
                             <input type="text" placeholder="61 234 5678" value={formData.callerPhone} onChange={e => setFormData({...formData, callerPhone: e.target.value})} className="w-full p-2 text-sm outline-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#E63946] flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Patient Condition *</label>
                        <textarea rows={2} placeholder="Describe the current condition or emergency... Example: Chest pain, difficulty breathing, accident victim, etc." required value={formData.patientCondition} onChange={e => setFormData({...formData, patientCondition: e.target.value})} className="w-full p-3 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#E63946] outline-none shadow-inner resize-none" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4B5E76] flex items-center"><Plus className="w-3 h-3 mr-1" /> Symptoms</label>
                          <textarea rows={2} placeholder="List key symptoms... Example: Sharp pain, bleeding, unconscious" value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} className="w-full p-2 text-sm bg-white border border-[#D1D5DB] rounded outline-none shadow-inner resize-none text-gray-600" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4B5E76] flex items-center"><Edit className="w-3 h-3 mr-1" /> Additional Notes</label>
                          <textarea rows={2} placeholder="Any additional information... Example: Allergies, medications, instructions" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2 text-sm bg-white border border-[#D1D5DB] rounded outline-none shadow-inner resize-none text-gray-600" />
                        </div>
                      </div>

                    </div>
                 </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Pickup */}
                    <div className="bg-white rounded border border-[#C5D7E8] shadow-sm overflow-hidden">
                       <div className="bg-gradient-to-r from-[#599AE1] to-[#ABCFF5] h-9 flex items-center">
                         <div className="bg-[#E63946] text-white px-3 flex items-center justify-center h-full mr-3 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                           <MapPin className="w-4 h-4 font-bold" />
                         </div>
                         <span className="text-sm font-semibold text-white drop-shadow-sm">Pickup Details</span>
                       </div>
                       <div className="p-4 bg-[#F8FAFC] space-y-3">
                         <div className="grid grid-cols-1 gap-3 mb-2">
                            <select required value={formData.regionId} onChange={e => setFormData({...formData, regionId: e.target.value, districtId: ''})} className="w-full p-2 text-xs bg-white border border-[#D1D5DB] rounded font-bold outline-none shadow-inner">
                              <option value="">-- Select Region --</option>
                              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            <select required disabled={!formData.regionId} value={formData.districtId} onChange={e => setFormData({...formData, districtId: e.target.value})} className="w-full p-2 text-xs bg-white border border-[#D1D5DB] rounded font-bold outline-none shadow-inner disabled:opacity-50">
                              <option value="">-- Select District --</option>
                              {districts.filter(d => d.regionId === formData.regionId).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                         </div>
                         <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                           <label className="text-xs font-bold text-[#4B5E76]">Address:</label>
                           <input type="text" required placeholder="Enter pickup address" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner" />
                         </div>
                         <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                           <label className="text-xs font-bold text-[#4B5E76]">Landmark:</label>
                           <input type="text" placeholder="Enter landmark" value={formData.pickupLandmark} onChange={e => setFormData({...formData, pickupLandmark: e.target.value})} className="w-full p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner" />
                         </div>
                       </div>
                    </div>

                    {/* Destination */}
                    <div className="bg-white rounded border border-[#C5D7E8] shadow-sm overflow-hidden">
                       <div className="bg-gradient-to-r from-[#599AE1] to-[#ABCFF5] h-9 flex items-center">
                         <div className="bg-[#E63946] text-white px-3 flex items-center justify-center h-full mr-3 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                           <MapPin className="w-4 h-4 font-bold" />
                         </div>
                         <span className="text-sm font-semibold text-white drop-shadow-sm">Destination Details</span>
                       </div>
                       <div className="p-4 bg-[#F8FAFC] space-y-3">
                         <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                           <label className="text-xs font-bold text-[#4B5E76]">Target Location:</label>
                           <input type="text" placeholder="Enter target location" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner" />
                         </div>
                         <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                           <label className="text-xs font-bold text-[#4B5E76]">Dest. Landmark:</label>
                           <input type="text" placeholder="Enter landmark" value={formData.destinationLandmark} onChange={e => setFormData({...formData, destinationLandmark: e.target.value})} className="w-full p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner" />
                         </div>
                       </div>
                    </div>
                  </div>

                 {/* 4. Dispatch & Response */}
                 <div className="bg-white rounded border border-[#C5D7E8] shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#599AE1] to-[#ABCFF5] h-9 flex items-center">
                      <div className="bg-[#E63946] text-white px-3 flex items-center justify-center h-full mr-3 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                        <Plus className="w-4 h-4 font-bold" />
                      </div>
                      <span className="text-sm font-semibold text-white drop-shadow-sm">Dispatch & Response</span>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] space-y-3">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                          <label className="text-xs font-bold text-[#4B5E76]">Tracking Code:</label>
                          <input disabled type="text" placeholder="Auto-generated" className="w-full p-2 text-sm bg-gray-100/80 border border-[#D1D5DB] rounded text-gray-400 outline-none shadow-inner" />
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                          <label className="text-xs font-bold text-[#4B5E76]">Dispatcher:</label>
                          <div className="w-full p-2 flex justify-between items-center text-sm bg-gray-100/80 text-gray-500 border border-[#D1D5DB] rounded shadow-inner">
                            <div className="flex items-center"><User className="w-4 h-4 mr-2" /> Staff Name</div>
                            <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-[120px_1fr] items-start gap-2">
                        <label className="text-xs font-bold text-[#4B5E76] pt-2">Dispatcher Notes:</label>
                        <textarea 
                          rows={2}
                          placeholder="Enter any manual dispatch notes"
                          value={formData.manualDispatchNotes}
                          onChange={e => setFormData({...formData, manualDispatchNotes: e.target.value})}
                          className="w-full p-2 text-sm bg-white border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#599AE1] outline-none shadow-inner resize-none" 
                        />
                      </div>

                    </div>
                 </div>

               </form>
            </div>

            <div className="p-5 flex justify-center gap-6 bg-gradient-to-b from-white to-[#F0F4F8] border-t border-gray-200">
              <Button type="button" onClick={() => setIsAddModalOpen(false)} className="w-48 h-12 rounded shadow-[0_4px_10px_rgba(0,0,0,0.1)] bg-gradient-to-b from-[#7F8B9C] to-[#506079] hover:from-[#6B7787] hover:to-[#414E64] text-white font-bold text-sm tracking-wide border border-[#404D5F]">
                Cancel
              </Button>
              <Button type="submit" form="dispatchForm" disabled={isSubmitting} className="w-48 h-12 rounded shadow-[0_4px_10px_rgba(230,57,70,0.3)] bg-gradient-to-b from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white font-bold text-sm tracking-wide border border-[#B91C1C]">
                {isSubmitting ? 'Processing...' : 'Create Request >'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced High-Fidelity Assign Unit Modal */}
      {isAssignModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md flex justify-center items-center z-[110] transition-all duration-500 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[850px] rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col my-auto border border-white/20">
            
            {/* Modal Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-[#1E293B] tracking-tight uppercase">Assign Unit</h2>
                <div className="flex items-center mt-1 space-x-2">
                   <span className="text-sm font-bold text-gray-400">Patient</span>
                   <span className="text-sm font-bold text-[#1E60D1]">{selectedRequest.trackingCode}</span>
                </div>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
            
            <div className="px-8 pb-8 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
               
               {/* 1. Recommended Unit Overview */}
               <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest px-1">Recommended Unit</h3>
                  <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-blue-50 relative overflow-hidden group">
                     <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="bg-blue-600 p-2 rounded-xl text-white">
                                 <Truck className="w-5 h-5" />
                              </div>
                              <h4 className="text-xl font-black text-[#1E293B] uppercase tracking-tighter">
                                {availableDrivers[0]?.assignedAmbulance?.ambulanceNumber || 'Calculating...'}
                              </h4>
                           </div>
                           
                           <div className="flex items-center gap-6">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Driver</p>
                                 <p className="font-black text-[#1E293B]">{availableDrivers[0] ? `${availableDrivers[0].firstName} ${availableDrivers[0].lastName}` : 'No driver available'}</p>
                              </div>
                              <div className="flex gap-2">
                                 <span className="bg-red-50 text-red-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100">{selectedRequest.priority}</span>
                                 <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">{selectedRequest.status}</span>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-8 text-xs font-bold pt-2">
                              <div className="space-y-2">
                                 <p className="text-gray-400">Pickup Location: <span className="text-gray-900">{selectedRequest.pickupLocation}</span></p>
                                 <p className="text-gray-400">Pickup Landmark: <span className="text-gray-900">{selectedRequest.pickupLandmark || 'N/A'}</span></p>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-gray-400">Fuel Level: <span className="text-emerald-600">85%</span></p>
                                 <p className="text-gray-400">Status: <span className="text-emerald-600">Available</span></p>
                              </div>
                           </div>
                        </div>
                        <div className="relative w-48 h-32 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-4">
                           <Truck className="w-24 h-24 text-blue-100 absolute -bottom-4 -right-4 rotate-12" />
                           <img src="/ambulance_placeholder.png" alt="Ambulance" className="w-full h-full object-contain relative z-10" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* 2. Selection Grid: Drivers and Crew */}
               <div className="grid lg:grid-cols-2 gap-8">
                  
                  {/* Primary Driver Selection */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest px-1">Available Driver</h3>
                     <div className="bg-white border border-gray-100 rounded-2xl p-2 flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-gray-400 px-3">Select a driver</span>
                        <Filter className="w-4 h-4 text-gray-300 mr-2" />
                     </div>
                     <div className="grid grid-cols-1 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {isFetchingUnits ? (
                          <div className="h-32 flex items-center justify-center italic text-gray-400">Locating drivers...</div>
                        ) : availableDrivers.map(driver => (
                          <div 
                            key={driver.id} 
                            onClick={() => setAssignmentParams({...assignmentParams, driverId: driver.id})}
                            className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative group ${
                               assignmentParams.driverId === driver.id 
                               ? 'bg-blue-50/50 border-blue-500 shadow-lg shadow-blue-100' 
                               : 'bg-[#F8FAFC] border-transparent hover:border-gray-200'
                            }`}
                          >
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shadow-sm">
                                   {driver.user?.id ? (
                                     <User className="w-6 h-6" />
                                   ) : (
                                     <User className="w-6 h-6" />
                                   )}
                                </div>
                                <div className="flex-1">
                                   <h4 className="text-base font-black text-[#1E293B]">{driver.firstName} {driver.lastName}</h4>
                                   <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 mt-0.5">
                                      <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-blue-500" /> {driver.phone || '664654566'}</div>
                                      <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                      <div className="flex items-center gap-1"><Navigation className="w-3 h-3 text-red-500" /> Hodan District</div>
                                   </div>
                                </div>
                                {assignmentParams.driverId === driver.id && (
                                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                     <CheckCircle className="w-4 h-4 text-white" />
                                  </div>
                                )}
                             </div>
                             <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                   <span className="text-[10px] font-bold text-emerald-600">Active • Hodan Center</span>
                                </div>
                                <span className={driver.assignedAmbulanceId ? 'text-[10px] font-bold text-blue-600' : 'text-[10px] font-bold text-amber-500'}>
                                  {driver.assignedAmbulance ? `Unit ${driver.assignedAmbulance.ambulanceNumber}` : 'Unassigned'}
                                </span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Optional Crew Selection */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest px-1">Optional Crew <span className="text-gray-300 font-bold lowercase">(optional)</span></h3>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 rounded-3xl border-2 border-transparent bg-[#F8FAFC]">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300">
                                 <User className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-sm font-black text-[#1E293B]">Paramedic Farhan Nur</h4>
                                 <p className="text-[10px] font-bold text-gray-400 mt-0.5">+252 61 784 8739</p>
                              </div>
                              <div className="flex items-center gap-2">
                                 <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-xl text-[10px] font-black">+ ADD</span>
                              </div>
                           </div>
                        </div>
                        <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center opacity-40">
                           <UserPlus className="w-8 h-8 text-gray-300 mb-2" />
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No extra crew selected</p>
                        </div>
                     </div>
                  </div>
                  
               </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <Button onClick={() => setIsAssignModalOpen(false)} variant="outline" className="px-10 py-6 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-400 hover:text-gray-600 border-gray-200">
                Cancel
              </Button>
              <Button 
                onClick={handleAssignUnit}
                disabled={isSubmitting || !assignmentParams.driverId}
                className="px-10 py-6 rounded-2xl bg-[#1E60D1] hover:bg-[#154bb0] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                ) : 'Assign & Dispatch'}
              </Button>
            </div>
            
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </div>
  )
}
