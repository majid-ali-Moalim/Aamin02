'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, Truck, MapPin, User, Clock, AlertCircle, Phone, Navigation, Activity, Bell } from 'lucide-react'

export default function DispatchManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDispatch, setSelectedDispatch] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const dispatches = [
    {
      id: 'DISP-001',
      requestId: 'AAM-125',
      patient: 'Hassan Omar',
      phone: '+252 61 456 7890',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      pickupLocation: 'Yaqshid District, Mogadishu',
      destination: 'Kalkal Hospital',
      ambulance: 'AMB-002',
      driver: 'Ahmed Yusuf',
      nurse: 'Nur Abdullahi',
      dispatcher: 'Ali Hassan',
      dispatchTime: '10:25 AM',
      estimatedArrival: '10:35 AM',
      actualArrival: 'Pending',
      distance: '3.2 km',
      eta: '8 min',
      currentLocation: '2.1 km from pickup',
      route: 'Via Maka Al-Mukarama Road',
      emergencyType: 'Car Accident',
      patientCondition: 'Critical - Multiple injuries',
      specialInstructions: 'Advanced life support required, notify ER',
      teamStatus: 'En Route',
      communication: 'Radio contact established',
      escalationLevel: 'High'
    },
    {
      id: 'DISP-002',
      requestId: 'AAM-124',
      patient: 'Fatima Ali',
      phone: '+252 61 345 6789',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      pickupLocation: 'Wadajir District',
      destination: 'Benadir Hospital',
      ambulance: 'AMB-001',
      driver: 'Mohamed Omar',
      nurse: 'Aisha Mohamed',
      dispatcher: 'Said Ali',
      dispatchTime: '10:27 AM',
      estimatedArrival: '10:40 AM',
      actualArrival: '10:32 AM',
      distance: '4.5 km',
      eta: '5 min',
      currentLocation: 'At patient location',
      route: 'Via Industrial Road',
      emergencyType: 'Fractured Leg',
      patientCondition: 'Stable - Leg fracture',
      specialInstructions: 'Immobilization required',
      teamStatus: 'Patient Assessment',
      communication: 'Regular updates',
      escalationLevel: 'Normal'
    },
    {
      id: 'DISP-003',
      requestId: 'AAM-126',
      patient: 'Amina Hassan',
      phone: '+252 61 567 8901',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      pickupLocation: 'Bondhere District',
      destination: 'Forlanini Hospital',
      ambulance: 'AMB-003',
      driver: 'Abdullahi Mohamed',
      nurse: 'Khadija Ahmed',
      dispatcher: 'Said Ali',
      dispatchTime: '10:20 AM',
      estimatedArrival: '10:30 AM',
      actualArrival: '10:28 AM',
      distance: '2.8 km',
      eta: 'Completed',
      currentLocation: 'Hospital',
      route: 'Via Shangani Street',
      emergencyType: 'Abdominal Pain',
      patientCondition: 'Stable - Under observation',
      specialInstructions: 'Monitor vitals',
      teamStatus: 'Handover Complete',
      communication: 'Mission completed',
      escalationLevel: 'Normal'
    },
    {
      id: 'DISP-004',
      requestId: 'AAM-123',
      patient: 'Ahmed Mohamed',
      phone: '+252 61 234 5678',
      status: 'PENDING',
      priority: 'HIGH',
      pickupLocation: 'Hodan District',
      destination: 'Mogadishu General Hospital',
      ambulance: 'Not Assigned',
      driver: 'Not Assigned',
      nurse: 'Not Assigned',
      dispatcher: 'Ali Hassan',
      dispatchTime: 'Pending',
      estimatedArrival: 'Pending',
      actualArrival: 'Pending',
      distance: '0 km',
      eta: 'Pending',
      currentLocation: 'Dispatch Center',
      route: 'Not Determined',
      emergencyType: 'Chest Pain',
      patientCondition: 'Unknown - Emergency call',
      specialInstructions: 'Urgent response required',
      teamStatus: 'Awaiting Assignment',
      communication: 'Initial contact made',
      escalationLevel: 'Medium'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'ESCALATED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Activity className="w-4 h-4" />
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'COMPLETED': return <AlertCircle className="w-4 h-4" />
      case 'ESCALATED': return <Bell className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredDispatches = dispatches.filter(dispatch => {
    const matchesSearch = searchTerm === '' || 
      dispatch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.phone.includes(searchTerm) ||
      dispatch.ambulance.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || dispatch.status === statusFilter
    const matchesPriority = priorityFilter === '' || dispatch.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewDetails = (dispatch: any) => {
    setSelectedDispatch(dispatch)
    setShowDetails(true)
  }

  const handleAssignTeam = (dispatchId: string) => {
    console.log('Assign team for dispatch:', dispatchId)
  }

  const handleUpdateStatus = (dispatchId: string, newStatus: string) => {
    console.log('Update status for dispatch:', dispatchId, 'to:', newStatus)
  }

  const handleEscalate = (dispatchId: string) => {
    console.log('Escalate dispatch:', dispatchId)
  }

  const handleCommunicate = (dispatchId: string) => {
    console.log('Communicate with team:', dispatchId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dispatch Management</h1>
            <p className="text-gray-600 mt-2">Control ambulance dispatch operations in real-time</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              Export
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              New Dispatch
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Dispatches</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              <p className="text-sm text-green-600 mt-2">1 critical</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Assignment</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
              <p className="text-sm text-yellow-600 mt-2">High priority</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8 min</p>
              <p className="text-sm text-green-600 mt-2">-2 min today</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              <p className="text-sm text-gray-600 mt-2">On target</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="bg-red-600 hover:bg-red-700">
            <Truck className="w-4 h-4 mr-2" />
            Assign Nearest Ambulance
          </Button>
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Contact All Teams
          </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Emergency Alert
          </Button>
          <Button variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            View Live Map
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
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
                  placeholder="Search by dispatch ID, request ID, patient, ambulance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="ESCALATED">Escalated</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dispatcher</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Dispatchers</option>
                  <option value="Ali Hassan">Ali Hassan</option>
                  <option value="Said Ali">Said Ali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Types</option>
                  <option value="Car Accident">Car Accident</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Time</option>
                  <option value="last-hour">Last Hour</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          Showing <span className="font-semibold">{filteredDispatches.length}</span> of{' '}
          <span className="font-semibold">{dispatches.length}</span> dispatches
        </p>
      </div>

      {/* Dispatch Board */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispatch Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDispatches.map((dispatch) => (
                <tr key={dispatch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{dispatch.id}</div>
                      <div className="text-sm text-gray-500">{dispatch.requestId}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {dispatch.emergencyType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{dispatch.patient}</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {dispatch.phone}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {dispatch.patientCondition}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getStatusColor(dispatch.status)}`}>
                        {getStatusIcon(dispatch.status)}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dispatch.status)}`}>
                          {dispatch.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {dispatch.teamStatus}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {dispatch.driver === 'Not Assigned' ? (
                        <span className="text-gray-400">Not Assigned</span>
                      ) : (
                        <div>
                          <div className="flex items-center">
                            <Truck className="w-3 h-3 mr-1 text-gray-400" />
                            {dispatch.ambulance}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Driver: {dispatch.driver}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Nurse: {dispatch.nurse}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Dispatcher: {dispatch.dispatcher}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {dispatch.pickupLocation}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        To: {dispatch.destination}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {dispatch.currentLocation}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Route: {dispatch.route}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>ETA: {dispatch.eta}</div>
                      <div className="text-xs text-gray-500">
                        Distance: {dispatch.distance}
                      </div>
                      <div className="text-xs text-gray-500">
                        Dispatch: {dispatch.dispatchTime}
                      </div>
                      {dispatch.actualArrival !== 'Pending' && (
                        <div className="text-xs text-green-600 mt-1">
                          Arrived: {dispatch.actualArrival}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(dispatch)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {dispatch.status === 'PENDING' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAssignTeam(dispatch.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <User className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCommunicate(dispatch.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      {dispatch.priority === 'CRITICAL' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEscalate(dispatch.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(dispatch.id, 'COMPLETED')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedDispatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dispatch Details</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Dispatch ID</p>
                    <p className="font-medium">{selectedDispatch.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Request ID</p>
                    <p className="font-medium">{selectedDispatch.requestId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDispatch.status)}`}>
                      {selectedDispatch.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedDispatch.priority)}`}>
                      {selectedDispatch.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Emergency Type</p>
                    <p className="font-medium">{selectedDispatch.emergencyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Team Status</p>
                    <p className="font-medium">{selectedDispatch.teamStatus}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-medium">{selectedDispatch.patient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedDispatch.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-medium">{selectedDispatch.patientCondition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Special Instructions</p>
                    <p className="font-medium">{selectedDispatch.specialInstructions}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Team</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Ambulance</p>
                    <p className="font-medium">{selectedDispatch.ambulance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium">{selectedDispatch.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nurse</p>
                    <p className="font-medium">{selectedDispatch.nurse}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dispatcher</p>
                    <p className="font-medium">{selectedDispatch.dispatcher}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Timing</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Pickup Location</p>
                    <p className="font-medium">{selectedDispatch.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium">{selectedDispatch.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Location</p>
                    <p className="font-medium">{selectedDispatch.currentLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-medium">{selectedDispatch.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-medium">{selectedDispatch.distance}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Dispatch Time</p>
                    <p className="text-xs text-gray-500">{selectedDispatch.dispatchTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Estimated Arrival</p>
                    <p className="text-xs text-gray-500">{selectedDispatch.estimatedArrival}</p>
                  </div>
                </div>
                {selectedDispatch.actualArrival !== 'Pending' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Actual Arrival</p>
                      <p className="text-xs text-gray-500">{selectedDispatch.actualArrival}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{selectedDispatch.communication}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Escalation Level</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedDispatch.escalationLevel === 'High' ? 'bg-red-100 text-red-800' : 
                    selectedDispatch.escalationLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedDispatch.escalationLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button className="bg-red-600 hover:bg-red-700">
                Update Status
              </Button>
              <Button variant="outline">
                Contact Team
              </Button>
              <Button variant="outline">
                Escalate
              </Button>
              <Button variant="outline">
                View Map
              </Button>
              <Button variant="outline">
                Print Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
