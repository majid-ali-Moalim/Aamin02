'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, Truck, MapPin, User, Clock, AlertCircle, Navigation, Phone, RefreshCw, ZoomIn, ZoomOut, Layers } from 'lucide-react'

export default function AmbulanceTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedAmbulance, setSelectedAmbulance] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [mapView, setMapView] = useState('standard')
  const [selectedRequest, setSelectedRequest] = useState('')

  const ambulances = [
    {
      id: 'AMB-001',
      plateNumber: 'SO-1234',
      status: 'DISPATCHED',
      driver: 'Mohamed Omar',
      nurse: 'Aisha Mohamed',
      currentLocation: { lat: 2.0469, lng: 45.3182, address: 'Wadajir District, Near Industrial Road' },
      destination: { lat: 2.0470, lng: 45.3190, address: 'Benadir Hospital' },
      pickupLocation: { lat: 2.0455, lng: 45.3170, address: 'Wadajir District, Main Street' },
      speed: '45 km/h',
      heading: 'Northeast',
      eta: '5 min',
      distance: '2.1 km',
      fuelLevel: '72%',
      requestId: 'AAM-124',
      patient: 'Fatima Ali',
      emergencyType: 'Fractured Leg',
      priority: 'MEDIUM',
      lastUpdate: '2 mins ago',
      route: 'Industrial Road → Hospital Avenue',
      temperature: 'Normal',
      oxygenLevel: '98%',
      heartRate: '82 bpm',
      bloodPressure: '120/80'
    },
    {
      id: 'AMB-002',
      plateNumber: 'SO-5678',
      status: 'DISPATCHED',
      driver: 'Ahmed Yusuf',
      nurse: 'Nur Abdullahi',
      currentLocation: { lat: 2.0480, lng: 45.3200, address: 'Yaqshid District, Maka Al-Mukarama Road' },
      destination: { lat: 2.0475, lng: 45.3210, address: 'Kalkal Hospital' },
      pickupLocation: { lat: 2.0465, lng: 45.3195, address: 'Yaqshid District, Market Area' },
      speed: '60 km/h',
      heading: 'North',
      eta: '3 min',
      distance: '1.8 km',
      fuelLevel: '68%',
      requestId: 'AAM-125',
      patient: 'Hassan Omar',
      emergencyType: 'Car Accident',
      priority: 'CRITICAL',
      lastUpdate: '1 min ago',
      route: 'Maka Al-Mukarama Road → Hospital Street',
      temperature: '36.5°C',
      oxygenLevel: '94%',
      heartRate: '95 bpm',
      bloodPressure: '140/90'
    },
    {
      id: 'AMB-003',
      plateNumber: 'SO-9012',
      status: 'AVAILABLE',
      driver: 'Not Assigned',
      nurse: 'Not Assigned',
      currentLocation: { lat: 2.0450, lng: 45.3150, address: 'Service Center, Mogadishu' },
      destination: null,
      pickupLocation: null,
      speed: '0 km/h',
      heading: 'Stationary',
      eta: 'N/A',
      distance: '0 km',
      fuelLevel: '45%',
      requestId: 'None',
      patient: 'None',
      emergencyType: 'None',
      priority: 'N/A',
      lastUpdate: '5 mins ago',
      route: 'None',
      temperature: 'N/A',
      oxygenLevel: 'N/A',
      heartRate: 'N/A',
      bloodPressure: 'N/A'
    },
    {
      id: 'AMB-004',
      plateNumber: 'SO-3456',
      status: 'AVAILABLE',
      driver: 'Ibrahim Hassan',
      nurse: 'Fadumo Mohamed',
      currentLocation: { lat: 2.0475, lng: 45.3165, address: 'Wadajir District, Base Station' },
      destination: null,
      pickupLocation: null,
      speed: '0 km/h',
      heading: 'Stationary',
      eta: 'N/A',
      distance: '0 km',
      fuelLevel: '91%',
      requestId: 'None',
      patient: 'None',
      emergencyType: 'None',
      priority: 'N/A',
      lastUpdate: '3 mins ago',
      route: 'None',
      temperature: 'N/A',
      oxygenLevel: 'N/A',
      heartRate: 'N/A',
      bloodPressure: 'N/A'
    },
    {
      id: 'AMB-005',
      plateNumber: 'SO-7890',
      status: 'MAINTENANCE',
      driver: 'Not Assigned',
      nurse: 'Not Assigned',
      currentLocation: { lat: 2.0440, lng: 45.3140, address: 'Headquarters, Mogadishu' },
      destination: null,
      pickupLocation: null,
      speed: '0 km/h',
      heading: 'Stationary',
      eta: 'N/A',
      distance: '0 km',
      fuelLevel: '60%',
      requestId: 'None',
      patient: 'None',
      emergencyType: 'None',
      priority: 'N/A',
      lastUpdate: '1 hour ago',
      route: 'None',
      temperature: 'N/A',
      oxygenLevel: 'N/A',
      heartRate: 'N/A',
      bloodPressure: 'N/A'
    }
  ]

  const emergencyRequests = [
    {
      id: 'AAM-124',
      patient: 'Fatima Ali',
      location: { lat: 2.0455, lng: 45.3170, address: 'Wadajir District, Main Street' },
      priority: 'MEDIUM',
      status: 'ASSIGNED',
      assignedAmbulance: 'AMB-001'
    },
    {
      id: 'AAM-125',
      patient: 'Hassan Omar',
      location: { lat: 2.0465, lng: 45.3195, address: 'Yaqshid District, Market Area' },
      priority: 'CRITICAL',
      status: 'ON_THE_WAY',
      assignedAmbulance: 'AMB-002'
    }
  ]

  const hospitals = [
    { id: 'HOSP-001', name: 'Mogadishu General Hospital', location: { lat: 2.0470, lng: 45.3190 } },
    { id: 'HOSP-002', name: 'Benadir Hospital', location: { lat: 2.0470, lng: 45.3190 } },
    { id: 'HOSP-003', name: 'Kalkal Hospital', location: { lat: 2.0475, lng: 45.3210 } },
    { id: 'HOSP-004', name: 'Forlanini Hospital', location: { lat: 2.0485, lng: 45.3225 } }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800'
      case 'DISPATCHED': return 'bg-blue-100 text-blue-800'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800'
      case 'OFFLINE': return 'bg-gray-100 text-gray-800'
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

  const filteredAmbulances = ambulances.filter(ambulance => {
    const matchesSearch = searchTerm === '' || 
      ambulance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.currentLocation.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || ambulance.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (ambulance: any) => {
    setSelectedAmbulance(ambulance)
    setShowDetails(true)
  }

  const handleTrackByRequest = (requestId: string) => {
    setSelectedRequest(requestId)
    const ambulance = ambulances.find(a => a.requestId === requestId)
    if (ambulance) {
      setSelectedAmbulance(ambulance)
      setShowDetails(true)
    }
  }

  const handleRefresh = () => {
    console.log('Refresh map data')
  }

  const handleZoomIn = () => {
    console.log('Zoom in')
  }

  const handleZoomOut = () => {
    console.log('Zoom out')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Ambulance Tracking</h1>
            <p className="text-gray-600 mt-2">Monitor moving ambulances on a real-time map</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Navigation className="w-4 h-4 mr-2" />
              Full Screen
            </Button>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Map View:</span>
              <select 
                value={mapView}
                onChange={(e) => setMapView(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
                <option value="traffic">Traffic</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Layers className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full ml-4"></div>
            <span>Dispatched</span>
            <div className="w-3 h-3 bg-yellow-500 rounded-full ml-4"></div>
            <span>Maintenance</span>
            <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
            <span>Emergency</span>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: '500px' }}>
        <div className="w-full h-full bg-gray-100 relative">
          {/* Map Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">Interactive Map View</p>
              <p className="text-gray-500 mb-4">Real-time ambulance tracking</p>
              
              {/* Simulated Map Elements */}
              <div className="relative w-96 h-64 bg-gray-200 rounded-lg mx-auto">
                {/* Hospital Markers */}
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="absolute w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `${((hospital.location.lng - 45.3140) / 0.0085) * 100}%`,
                      top: `${((2.0485 - hospital.location.lat) / 0.0045) * 100}%`
                    }}
                    title={hospital.name}
                  ></div>
                ))}
                
                {/* Emergency Request Markers */}
                {emergencyRequests.map((request) => (
                  <div
                    key={request.id}
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"
                    style={{
                      left: `${((request.location.lng - 45.3140) / 0.0085) * 100}%`,
                      top: `${((2.0485 - request.location.lat) / 0.0045) * 100}%`
                    }}
                    title={`${request.patient} - ${request.priority}`}
                  ></div>
                ))}
                
                {/* Ambulance Markers */}
                {filteredAmbulances.map((ambulance) => (
                  <div
                    key={ambulance.id}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                      ambulance.status === 'AVAILABLE' ? 'bg-green-500' :
                      ambulance.status === 'DISPATCHED' ? 'bg-blue-500' :
                      ambulance.status === 'MAINTENANCE' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}
                    style={{
                      left: `${((ambulance.currentLocation.lng - 45.3140) / 0.0085) * 100}%`,
                      top: `${((2.0485 - ambulance.currentLocation.lat) / 0.0045) * 100}%`
                    }}
                    title={`${ambulance.id} - ${ambulance.driver}`}
                  >
                    <Truck className="w-3 h-3 text-white m-0.5" />
                  </div>
                ))}
                
                {/* Route Lines (simplified) */}
                {filteredAmbulances.filter(a => a.status === 'DISPATCHED' && a.destination).map((ambulance) => (
                  <svg
                    key={`route-${ambulance.id}`}
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <line
                      x1={`${((ambulance.currentLocation.lng - 45.3140) / 0.0085) * 100}%`}
                      y1={`${((2.0485 - ambulance.currentLocation.lat) / 0.0045) * 100}%`}
                      x2={`${((ambulance.destination.lng - 45.3140) / 0.0085) * 100}%`}
                      y2={`${((2.0485 - ambulance.destination.lat) / 0.0045) * 100}%`}
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Ambulances</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              <p className="text-sm text-blue-600 mt-2">Currently dispatched</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              <p className="text-sm text-green-600 mt-2">Ready for dispatch</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Navigation className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Cases</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              <p className="text-sm text-red-600 mt-2">1 critical</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Speed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">52 km/h</p>
              <p className="text-sm text-gray-600 mt-2">Active vehicles</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Navigation className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Emergency Requests */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Emergency Requests</h3>
        <div className="space-y-3">
          {emergencyRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  request.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{request.patient}</p>
                  <p className="text-sm text-gray-500">{request.location.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </span>
                <span className="text-sm text-gray-600">{request.assignedAmbulance}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTrackByRequest(request.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ambulance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Ambulance Fleet Status</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search ambulances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAmbulances.map((ambulance) => (
            <div key={ambulance.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${
                    ambulance.status === 'AVAILABLE' ? 'bg-green-500' :
                    ambulance.status === 'DISPATCHED' ? 'bg-blue-500' :
                    ambulance.status === 'MAINTENANCE' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{ambulance.id}</p>
                    <p className="text-sm text-gray-500">{ambulance.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{ambulance.driver}</p>
                    <p className="text-xs text-gray-500">{ambulance.nurse}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ambulance.status)}`}>
                      {ambulance.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{ambulance.currentLocation.address}</p>
                    <p className="text-xs text-gray-500">Speed: {ambulance.speed} • {ambulance.heading}</p>
                  </div>
                  
                  {ambulance.status === 'DISPATCHED' && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{ambulance.patient}</p>
                      <p className="text-xs text-gray-500">ETA: {ambulance.eta} • {ambulance.distance}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ambulance.priority)}`}>
                        {ambulance.priority}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(ambulance)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {ambulance.status === 'DISPATCHED' && (
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedAmbulance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ambulance Details</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Ambulance ID</p>
                    <p className="font-medium">{selectedAmbulance.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plate Number</p>
                    <p className="font-medium">{selectedAmbulance.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAmbulance.status)}`}>
                      {selectedAmbulance.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Level</p>
                    <p className="font-medium">{selectedAmbulance.fuelLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Update</p>
                    <p className="font-medium">{selectedAmbulance.lastUpdate}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Team</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium">{selectedAmbulance.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nurse</p>
                    <p className="font-medium">{selectedAmbulance.nurse}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Location</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedAmbulance.currentLocation.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Speed</p>
                    <p className="font-medium">{selectedAmbulance.speed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Heading</p>
                    <p className="font-medium">{selectedAmbulance.heading}</p>
                  </div>
                </div>
              </div>

              {selectedAmbulance.status === 'DISPATCHED' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Request ID</p>
                      <p className="font-medium">{selectedAmbulance.requestId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Patient</p>
                      <p className="font-medium">{selectedAmbulance.patient}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Emergency Type</p>
                      <p className="font-medium">{selectedAmbulance.emergencyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Priority</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedAmbulance.priority)}`}>
                        {selectedAmbulance.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pickup Location</p>
                      <p className="font-medium">{selectedAmbulance.pickupLocation.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Destination</p>
                      <p className="font-medium">{selectedAmbulance.destination?.address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ETA</p>
                      <p className="font-medium">{selectedAmbulance.eta}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-medium">{selectedAmbulance.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-medium">{selectedAmbulance.route}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedAmbulance.status === 'DISPATCHED' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Vitals</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="font-medium">{selectedAmbulance.temperature}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Oxygen Level</p>
                      <p className="font-medium">{selectedAmbulance.oxygenLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Heart Rate</p>
                      <p className="font-medium">{selectedAmbulance.heartRate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Blood Pressure</p>
                      <p className="font-medium">{selectedAmbulance.bloodPressure}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              <Button className="bg-red-600 hover:bg-red-700">
                Track on Map
              </Button>
              <Button variant="outline">
                Contact Team
              </Button>
              <Button variant="outline">
                View Route
              </Button>
              <Button variant="outline">
                Update Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
