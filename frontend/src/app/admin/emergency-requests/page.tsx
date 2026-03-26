'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, Phone, MapPin, Clock, User, Truck, AlertCircle } from 'lucide-react'

export default function EmergencyRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const requests = [
    {
      id: 'AAM-123',
      patient: 'Ahmed Mohamed',
      phone: '+252 61 234 5678',
      status: 'PENDING',
      priority: 'HIGH',
      location: 'Hodan District, Mogadishu',
      destination: 'Mogadishu General Hospital',
      time: '2 mins ago',
      requestTime: '10:30 AM',
      dispatcher: 'Not Assigned',
      driver: 'Not Assigned',
      ambulance: 'Not Assigned',
      nurse: 'Not Assigned',
      illness: 'Chest pain, difficulty breathing',
      notes: 'Patient reported severe chest pain, immediate medical attention required',
      timeline: [
        { time: '10:30 AM', event: 'Request received', status: 'completed' },
        { time: '10:32 AM', event: 'Triage assessment', status: 'completed' }
      ]
    },
    {
      id: 'AAM-124',
      patient: 'Fatima Ali',
      phone: '+252 61 345 6789',
      status: 'ASSIGNED',
      priority: 'MEDIUM',
      location: 'Wadajir District',
      destination: 'Benadir Hospital',
      time: '5 mins ago',
      requestTime: '10:27 AM',
      dispatcher: 'Ali Hassan',
      driver: 'Mohamed Omar',
      ambulance: 'AMB-001',
      nurse: 'Aisha Mohamed',
      illness: 'Fractured leg from fall',
      notes: 'Patient fell from stairs, suspected leg fracture',
      timeline: [
        { time: '10:27 AM', event: 'Request received', status: 'completed' },
        { time: '10:28 AM', event: 'Ambulance assigned', status: 'completed' },
        { time: '10:30 AM', event: 'Team dispatched', status: 'completed' }
      ]
    },
    {
      id: 'AAM-125',
      patient: 'Hassan Omar',
      phone: '+252 61 456 7890',
      status: 'ON_THE_WAY',
      priority: 'CRITICAL',
      location: 'Yaqshid District',
      destination: 'Kalkal Hospital',
      time: '8 mins ago',
      requestTime: '10:25 AM',
      dispatcher: 'Ali Hassan',
      driver: 'Ahmed Yusuf',
      ambulance: 'AMB-002',
      nurse: 'Nur Abdullahi',
      illness: 'Multiple injuries from car accident',
      notes: 'Critical condition, multiple injuries, requires immediate attention',
      timeline: [
        { time: '10:25 AM', event: 'Request received', status: 'completed' },
        { time: '10:26 AM', event: 'Critical priority assigned', status: 'completed' },
        { time: '10:27 AM', event: 'Ambulance dispatched', status: 'completed' },
        { time: '10:30 AM', event: 'On the way to patient', status: 'active' }
      ]
    },
    {
      id: 'AAM-126',
      patient: 'Amina Hassan',
      phone: '+252 61 567 8901',
      status: 'ARRIVED',
      priority: 'MEDIUM',
      location: 'Bondhere District',
      destination: 'Forlanini Hospital',
      time: '15 mins ago',
      requestTime: '10:20 AM',
      dispatcher: 'Said Ali',
      driver: 'Abdullahi Mohamed',
      ambulance: 'AMB-003',
      nurse: 'Khadija Ahmed',
      illness: 'Severe abdominal pain',
      notes: 'Patient experiencing severe abdominal pain, possible appendicitis',
      timeline: [
        { time: '10:20 AM', event: 'Request received', status: 'completed' },
        { time: '10:21 AM', event: 'Ambulance assigned', status: 'completed' },
        { time: '10:25 AM', event: 'Arrived at location', status: 'completed' },
        { time: '10:28 AM', event: 'Patient stabilized', status: 'completed' }
      ]
    },
    {
      id: 'AAM-127',
      patient: 'Mohamed Ali',
      phone: '+252 61 678 9012',
      status: 'COMPLETED',
      priority: 'LOW',
      location: 'Shangani District',
      destination: 'Medina Hospital',
      time: '30 mins ago',
      requestTime: '10:05 AM',
      dispatcher: 'Said Ali',
      driver: 'Ibrahim Hassan',
      ambulance: 'AMB-004',
      nurse: 'Fadumo Mohamed',
      illness: 'Minor burns from cooking accident',
      notes: 'First degree burns, treated and transported successfully',
      timeline: [
        { time: '10:05 AM', event: 'Request received', status: 'completed' },
        { time: '10:06 AM', event: 'Ambulance assigned', status: 'completed' },
        { time: '10:10 AM', event: 'Patient picked up', status: 'completed' },
        { time: '10:15 AM', event: 'Arrived at hospital', status: 'completed' },
        { time: '10:20 AM', event: 'Case completed', status: 'completed' }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800'
      case 'ON_THE_WAY': return 'bg-purple-100 text-purple-800'
      case 'ARRIVED': return 'bg-green-100 text-green-800'
      case 'PATIENT_PICKED': return 'bg-indigo-100 text-indigo-800'
      case 'REACHED_HOSPITAL': return 'bg-teal-100 text-teal-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
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
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'ASSIGNED': return <User className="w-4 h-4" />
      case 'ON_THE_WAY': return <Truck className="w-4 h-4" />
      case 'ARRIVED': return <MapPin className="w-4 h-4" />
      case 'COMPLETED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || request.status === statusFilter
    const matchesPriority = priorityFilter === '' || request.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request)
    setShowDetails(true)
  }

  const handleAssignAmbulance = (requestId: string) => {
    // Implementation for ambulance assignment
    console.log('Assign ambulance for request:', requestId)
  }

  const handleUpdateStatus = (requestId: string, newStatus: string) => {
    // Implementation for status update
    console.log('Update status for request:', requestId, 'to:', newStatus)
  }

  const handleDeleteRequest = (requestId: string) => {
    // Implementation for request deletion
    if (confirm('Are you sure you want to delete this emergency request?')) {
      console.log('Delete request:', requestId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Requests</h1>
            <p className="text-gray-600 mt-2">Manage and track all emergency requests in real-time</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              Export
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
              <p className="text-sm text-green-600 mt-2">+12% from last week</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
              <p className="text-sm text-yellow-600 mt-2">4 critical</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">12 min</p>
              <p className="text-sm text-green-600 mt-2">-3 min improvement</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">45</p>
              <p className="text-sm text-gray-600 mt-2">On track</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
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
                  placeholder="Search by tracking code, patient name, phone, location..."
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
                <option value="PENDING">Pending</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="ON_THE_WAY">On The Way</option>
                <option value="ARRIVED">Arrived</option>
                <option value="PATIENT_PICKED">Patient Picked</option>
                <option value="REACHED_HOSPITAL">Reached Hospital</option>
                <option value="COMPLETED">Completed</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dispatcher</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Dispatchers</option>
                  <option value="Ali Hassan">Ali Hassan</option>
                  <option value="Said Ali">Said Ali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ambulance</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Ambulances</option>
                  <option value="AMB-001">AMB-001</option>
                  <option value="AMB-002">AMB-002</option>
                  <option value="AMB-003">AMB-003</option>
                  <option value="AMB-004">AMB-004</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          Showing <span className="font-semibold">{filteredRequests.length}</span> of{' '}
          <span className="font-semibold">{requests.length}</span> requests
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.id}</div>
                      <div className="text-sm text-gray-900">{request.patient}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {request.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {request.location}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        To: {request.destination}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.driver === 'Not Assigned' ? (
                        <span className="text-gray-400">Not Assigned</span>
                      ) : (
                        <div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            {request.driver}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Truck className="w-3 h-3 mr-1" />
                            {request.ambulance}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <User className="w-3 h-3 mr-1" />
                            {request.nurse}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <div>{request.time}</div>
                      <div className="text-xs">Request: {request.requestTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === 'PENDING' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAssignAmbulance(request.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <User className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(request.id, 'COMPLETED')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteRequest(request.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Emergency Request Details</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedRequest.patient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Illness/Condition</p>
                    <p className="font-medium">{selectedRequest.illness}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-medium">{selectedRequest.notes}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tracking Code</p>
                    <p className="font-medium">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                      {selectedRequest.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Request Time</p>
                    <p className="font-medium">{selectedRequest.requestTime}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Pickup Location</p>
                    <p className="font-medium">{selectedRequest.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium">{selectedRequest.destination}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Team</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Dispatcher</p>
                    <p className="font-medium">{selectedRequest.dispatcher}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium">{selectedRequest.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ambulance</p>
                    <p className="font-medium">{selectedRequest.ambulance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nurse</p>
                    <p className="font-medium">{selectedRequest.nurse}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Timeline</h3>
              <div className="space-y-3">
                {selectedRequest.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.event}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button className="bg-red-600 hover:bg-red-700">
                Update Status
              </Button>
              <Button variant="outline">
                Assign Team
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
