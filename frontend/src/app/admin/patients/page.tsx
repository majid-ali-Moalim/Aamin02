'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, User, Phone, Shield, Activity, Clock, AlertCircle, X, Loader2, Mail, MapPin, Search as SearchIcon, FileText, Lock, PlusCircle, AlertTriangle, Syringe, FileWarning, HelpCircle } from 'lucide-react'
import { patientsService, systemSetupService } from '@/lib/api'
import { Patient, Gender, BloodType, Region, District } from '@/types'
import { format } from 'date-fns'

export default function PatientsDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  
  // Master Data
  const [availableRegions, setAvailableRegions] = useState<Region[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([])
  
  // Specific Filters
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>('')

  const [newPatient, setNewPatient] = useState({
    fullName: '',
    age: '',
    gender: Gender.MALE,
    phone: '',
    email: '',
    regionId: '',
    districtId: '',
    address: '',
    bloodType: BloodType.O_POSITIVE,
    conditions: '',
    allergies: '',
    insuranceProvider: ''
  })

  // Close modal reset
  const resetForm = () => {
    setNewPatient({
      fullName: '',
      age: '',
      gender: Gender.MALE,
      phone: '',
      email: '',
      regionId: '',
      districtId: '',
      address: '',
      bloodType: BloodType.O_POSITIVE,
      conditions: '',
      allergies: '',
      insuranceProvider: ''
    })
  }

  useEffect(() => {
    fetchPatients()
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      const [regions, districts] = await Promise.all([
        systemSetupService.getRegions(),
        systemSetupService.getDistricts()
      ])
      setAvailableRegions(regions)
      setAvailableDistricts(districts)
    } catch (err) {
      console.error('Failed to fetch master data:', err)
    }
  }

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      const data = await patientsService.getAll()
      setPatients(data)
    } catch (err) {
      console.error('Failed to fetch patients:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      
      const payload = {
        ...newPatient,
        age: parseInt(newPatient.age as string) || null,
      }
      
      await patientsService.create(payload)
      setIsAddModalOpen(false)
      resetForm()
      fetchPatients()
    } catch (err) {
      console.error('Failed to add patient:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const searchMatch = 
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      
      const genderMatch = !genderFilter || patient.gender === genderFilter
      const bloodTypeMatch = !bloodTypeFilter || patient.bloodType === bloodTypeFilter

      return searchMatch && genderMatch && bloodTypeMatch
    })
  }, [patients, searchTerm, genderFilter, bloodTypeFilter])

  const stats = useMemo(() => {
    return {
      total: patients.length,
      highRisk: patients.filter(p => p.conditions || p.allergies).length,
      recent: patients.filter(p => {
        const d = new Date(p.createdAt)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - d.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7
      }).length,
      totalEmergencies: patients.reduce((acc, p) => acc + (p.totalEmergencies || 0), 0)
    }
  }, [patients])

  const handleDeletePatient = async (id: string, name: string) => {
    if(confirm(`Are you sure you want to permanently delete patient ${name}?`)) {
      try {
        await patientsService.delete(id)
        fetchPatients()
      } catch(err) {
        console.error('Error deleting patient:', err)
      }
    }
  }

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowDetails(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Register</h1>
          <p className="text-gray-500 mt-1">Manage all patient records and medical histories</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold h-11 px-6 shadow-sm">
            Export Records
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all font-black h-11 px-6"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            NEW PATIENT
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Patients</p>
              <p className="text-3xl font-black text-secondary mt-1 tracking-tighter">{stats.total}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">High Risk</p>
              <p className="text-3xl font-black text-destructive mt-1 tracking-tighter">{stats.highRisk}</p>
              <p className="text-[10px] text-destructive mt-2 font-bold bg-destructive/10 inline-block px-2 py-0.5 rounded-full">HAS CONDITIONS</p>
            </div>
            <div className="bg-destructive/10 p-4 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">New (7 Days)</p>
              <p className="text-3xl font-black text-success mt-1 tracking-tighter">{stats.recent}</p>
            </div>
            <div className="bg-success/10 p-4 rounded-2xl">
              <PlusCircle className="w-8 h-8 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total EMT Calls</p>
              <p className="text-3xl font-black text-warning mt-1 tracking-tighter">{stats.totalEmergencies}</p>
            </div>
            <div className="bg-warning/10 p-4 rounded-2xl">
              <Activity className="w-8 h-8 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              className="w-full pl-12 pr-6 h-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium text-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="h-12 bg-gray-50 border-none rounded-2xl px-6 font-bold text-secondary focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_1.5rem_center] bg-no-repeat min-w-[140px]"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <select 
              className="h-12 bg-gray-50 border-none rounded-2xl px-6 font-bold text-secondary focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_1.5rem_center] bg-no-repeat min-w-[140px]"
              value={bloodTypeFilter}
              onChange={(e) => setBloodTypeFilter(e.target.value)}
            >
              <option value="">All Blood Types</option>
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Patient Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-secondary/40 font-black uppercase tracking-widest text-xs">Loading Patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-20 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-secondary mb-2">No Patients Found</h3>
              <p className="text-secondary/50 max-w-md mx-auto">Try adjusting your filters or use the 'New Patient' button to add a record.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Info</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Emergency History</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Service</th>
                  <th className="py-4 px-6 text-[10px] text-right font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6 align-top">
                      <div className="font-bold text-secondary">{patient.fullName}</div>
                      <div className="text-xs text-primary font-bold mt-1">{patient.patientCode}</div>
                      <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                        {patient.gender || '?'}, {patient.age ? `${patient.age} yrs` : 'Age N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top max-w-[200px]">
                      <div className="flex items-center text-xs text-secondary/70 mb-1">
                        <Phone className="w-3 h-3 mr-2 text-gray-400" />
                        <span className="truncate">{patient.phone}</span>
                      </div>
                      <div className="flex items-center text-xs text-secondary/70 mb-1">
                        <Mail className="w-3 h-3 mr-2 text-gray-400" />
                        <span className="truncate">{patient.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-start text-xs text-secondary/70">
                        <MapPin className="w-3 h-3 mr-2 text-gray-400 mt-0.5 shrink-0" />
                        <span className="truncate">
                          {patient.region?.name ? `${patient.district?.name}, ${patient.region?.name}` : patient.address}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top max-w-[200px]">
                      <div className="mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                          Blood: {patient.bloodType?.replace('_', ' ') || 'UNKNOWN'}
                        </span>
                      </div>
                      {patient.conditions && (
                        <div className="text-[10px] text-gray-500 mb-1 line-clamp-1">
                          <span className="font-bold text-gray-700">Cond:</span> {patient.conditions}
                        </div>
                      )}
                      {patient.allergies && (
                        <div className="text-[10px] text-gray-500 line-clamp-1">
                          <span className="font-bold text-gray-700">Allergies:</span> {patient.allergies}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold text-xs mb-2">
                        {patient.totalEmergencies || 0}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">
                        {patient.lastEmergencyDate 
                          ? format(new Date(patient.lastEmergencyDate), 'dd MMM yyyy') 
                          : 'No history'}
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="text-xs font-bold text-secondary mb-1">
                        {patient.lastAmbulanceNumber || 'N/A'}
                      </div>
                      <div className="text-[10px] text-gray-500 mb-1 truncate max-w-[150px]">
                        {patient.lastHospitalName || 'N/A'}
                      </div>
                      {patient.insuranceProvider && (
                        <div className="text-[10px] font-bold text-blue-600 truncate max-w-[150px]">
                          {patient.insuranceProvider}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 align-top text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm" onClick={() => handleViewDetails(patient)}>
                          <Eye className="w-4 h-4 text-secondary/60" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm border-orange-200 hover:bg-orange-50 hover:text-orange-600">
                          <AlertTriangle className="w-4 h-4 text-orange-400" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => handleDeletePatient(patient.id, patient.fullName)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
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

      {/* New Patient Registration Modal - Medium Size & High Fidelity */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50/50 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1b4382] to-[#2563eb] px-6 py-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center">
                 <svg viewBox="0 0 100 20" className="w-[800px] h-full text-white fill-none stroke-current stroke-[0.5]">
                    <path d="M0 10 L20 10 L25 5 L30 15 L35 2 L45 18 L50 10 L100 10" />
                  </svg>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-white p-2 rounded-lg">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">Add New Patient</h2>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-white/60 hover:text-white transition-colors relative z-10 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Patient Information Section */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-4 py-2 flex items-center gap-2">
                  <div className="bg-red-500 rounded p-1">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Patient Information</h3>
                </div>
                
                <div className="p-4 grid grid-cols-6 gap-x-4 gap-y-4">
                  <div className="col-span-1 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Full Name:</label>
                  </div>
                  <div className="col-span-5">
                    <input
                      required
                      type="text"
                      placeholder="Enter full name"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                      value={newPatient.fullName}
                      onChange={(e) => setNewPatient({...newPatient, fullName: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-1 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Gender:</label>
                  </div>
                  <div className="col-span-2">
                    <select
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm appearance-none"
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({...newPatient, gender: e.target.value as Gender})}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>

                  <div className="col-span-1 flex items-center justify-end">
                    <label className="text-sm font-bold text-gray-700 pr-2">Age:</label>
                  </div>
                  <div className="col-span-2">
                     <input
                      type="number"
                      placeholder="Enter age"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                    />
                  </div>

                  <div className="col-span-4 col-start-3 flex justify-end items-center mt-1">
                     <span className="text-xs font-bold text-gray-500 mr-2 flex items-center gap-1">
                       Linked User Account: <span className="p-1 bg-yellow-100 rounded text-yellow-600 inline-block ml-1"><Lock className="w-3 h-3"/></span>
                     </span>
                  </div>
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-4 py-2 flex items-center gap-2">
                  <div className="bg-red-500 rounded p-1">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Contact Details</h3>
                </div>
                
                <div className="p-4 grid grid-cols-6 gap-x-4 gap-y-4">
                  <div className="col-span-2 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Phone Number:</label>
                  </div>
                  <div className="col-span-4">
                    <div className="flex border border-gray-200 rounded bg-gray-50">
                      <span className="flex items-center px-3 border-r border-gray-200 font-medium text-gray-500 text-sm bg-gray-100">
                        +252
                      </span>
                      <input
                        required
                        type="tel"
                        placeholder="Enter phone number"
                        className="w-full h-10 px-3 bg-transparent border-none focus:ring-0 text-sm"
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Email Address:</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Region:</label>
                  </div>
                  <div className="col-span-4">
                    <select
                      required
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm appearance-none"
                      value={newPatient.regionId}
                      onChange={(e) => setNewPatient({...newPatient, regionId: e.target.value, districtId: ''})}
                    >
                      <option value="">Select region</option>
                      {availableRegions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <label className="text-sm font-bold text-gray-700">District:</label>
                  </div>
                  <div className="col-span-4">
                    <select
                      required
                      disabled={!newPatient.regionId}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm appearance-none disabled:opacity-50"
                      value={newPatient.districtId}
                      onChange={(e) => setNewPatient({...newPatient, districtId: e.target.value})}
                    >
                      <option value="">Select district</option>
                      {availableDistricts.filter(d => d.regionId === newPatient.regionId).map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 flex items-start pt-2">
                    <label className="text-sm font-bold text-gray-700">Detailed Address:</label>
                  </div>
                  <div className="col-span-4">
                     <textarea
                      placeholder="Street, Landmark, etc."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm min-h-[60px]"
                      value={newPatient.address}
                      onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-4 py-2 flex items-center gap-2">
                  <div className="bg-red-500 rounded p-1">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Medical Information</h3>
                </div>
                
                <div className="p-4 grid grid-cols-6 gap-x-4 gap-y-4">
                  <div className="col-span-2 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Blood Type:</label>
                  </div>
                  <div className="col-span-4">
                    <select
                      className="w-1/2 h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm appearance-none"
                      value={newPatient.bloodType}
                      onChange={(e) => setNewPatient({...newPatient, bloodType: e.target.value as BloodType})}
                    >
                      <option value="A_POSITIVE">A+</option>
                      <option value="A_NEGATIVE">A-</option>
                      <option value="B_POSITIVE">B+</option>
                      <option value="B_NEGATIVE">B-</option>
                      <option value="AB_POSITIVE">AB+</option>
                      <option value="AB_NEGATIVE">AB-</option>
                      <option value="O_POSITIVE">O+</option>
                      <option value="O_NEGATIVE">O-</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Medical Conditions:</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="e.g. Hypertension, Diabetes"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm"
                      value={newPatient.conditions}
                      onChange={(e) => setNewPatient({...newPatient, conditions: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Allergies:</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="e.g. Penicillin, Nuts"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm"
                      value={newPatient.allergies}
                      onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <label className="text-sm font-bold text-gray-700">Insurance Provider:</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="e.g. National Health, Bupa"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-primary text-sm"
                      value={newPatient.insuranceProvider}
                      onChange={(e) => setNewPatient({...newPatient, insuranceProvider: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 pb-2 px-2">
                <Button 
                  type="button" 
                  className="w-1/3 h-12 rounded bg-[#5b738c] hover:bg-[#4a5f75] font-bold text-white shadow"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3 h-12 rounded bg-[#e12d39] hover:bg-[#c81e2b] text-white font-bold shadow flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <span>Create Patient</span>
                      <span className="font-light text-xl">›</span>
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Patient Details Side Drawer */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex justify-end z-[100] transition-all duration-500 overflow-hidden">
          <div className="bg-white h-full w-full max-w-xl shadow-[-20px_0_50px_rgba(29,53,87,0.1)] border-l border-gray-100 relative animate-in slide-in-from-right duration-500 flex flex-col">
            
            <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-primary/5 p-3 rounded-2xl">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Patient Profile</h2>
                  <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Medical Record Overview</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="bg-gray-50 p-2 rounded-xl text-secondary/30 hover:text-primary transition-all hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="bg-primary/5 p-10 rounded-[3rem] relative group">
                    <User className="w-20 h-20 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  {selectedPatient.conditions || selectedPatient.allergies ? (
                    <div className="absolute -bottom-2 -right-2 bg-destructive p-3 rounded-2xl shadow-xl border-4 border-white">
                      <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-2 -right-2 bg-success p-3 rounded-2xl shadow-xl border-4 border-white">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase leading-none mb-2">
                    {selectedPatient.fullName}
                  </h2>
                  <div className="flex items-center justify-center gap-3">
                    <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200 text-gray-500">
                      {selectedPatient.gender || 'Unknown Gender'}
                    </span>
                    <div className="h-1 w-1 bg-gray-200 rounded-full" />
                    <span className="text-xs text-secondary/40 font-black uppercase tracking-[0.2em]">Code: {selectedPatient.patientCode}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                      <div className="w-2 h-4 bg-primary rounded-full" />
                      CORE IDENTIFICATION
                    </h3>
                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Full Name</p>
                          <p className="text-lg font-black text-secondary leading-none">{selectedPatient.fullName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Age</p>
                          <p className="text-lg font-black text-secondary leading-none">{selectedPatient.age ? `${selectedPatient.age} Years` : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Phone Link</p>
                          <p className="text-sm font-bold text-secondary leading-none">{selectedPatient.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Email Address</p>
                          <p className="text-sm font-bold text-secondary">{selectedPatient.email || 'No email provided'}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-1">Physical Location</p>
                        <p className="text-sm font-bold text-secondary">
                          {selectedPatient.region?.name} {selectedPatient.district?.name ? `- ${selectedPatient.district.name}` : ''}
                        </p>
                        <p className="text-xs text-secondary/50 mt-1">{selectedPatient.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                      <div className="w-2 h-4 bg-primary rounded-full" />
                      MEDICAL PROFILE
                    </h3>
                    <div className="bg-secondary/5 p-6 rounded-[2rem] border border-primary/10">
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">Blood Type</p>
                          <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-black text-red-600 bg-red-50 border border-red-100">
                            <Activity className="w-4 h-4 mr-2" />
                            {selectedPatient.bloodType?.replace('_', ' ') || 'UNKNOWN'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">Existing Conditions</p>
                          <p className="text-sm font-bold text-secondary">{selectedPatient.conditions || 'None reported'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">Known Allergies</p>
                          <p className="text-sm font-bold text-secondary">{selectedPatient.allergies || 'None reported'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">Insurance Provider</p>
                          <p className="text-sm font-bold text-secondary">{selectedPatient.insuranceProvider || 'Out of pocket / Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                     <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                      <div className="w-2 h-4 bg-primary rounded-full" />
                      EMERGENCY HISTORY
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-gray-100 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-2">Total Emergencies</p>
                        <p className="text-3xl font-black text-secondary tracking-tighter">{selectedPatient.totalEmergencies || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-gray-100 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-2">Last Dispatch</p>
                        <p className="text-sm font-black text-secondary mt-1 text-center">
                          {selectedPatient.lastEmergencyDate ? format(new Date(selectedPatient.lastEmergencyDate), 'MMM dd, yyyy') : 'No Record'}
                        </p>
                        <p className="text-xs font-bold text-gray-400 mt-1 max-w-full truncate">{selectedPatient.lastAmbulanceNumber || ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
              <Button className="flex-1 bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black text-[10px] tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">
                UPDATE RECORD
              </Button>
              <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black text-[10px] tracking-widest border-2 hover:bg-white active:scale-95 transition-all">
                VIEW FULL HISTORY
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>

  )
}
