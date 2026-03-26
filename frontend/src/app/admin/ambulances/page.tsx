'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, Truck, MapPin, User, AlertCircle, Settings, Wrench } from 'lucide-react'

export default function AmbulancesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAmbulance, setSelectedAmbulance] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const ambulances = [
    {
      id: 'AMB-001',
      plateNumber: 'SO-1234',
      type: 'Basic',
      status: 'AVAILABLE',
      location: 'Hodan District, Mogadishu',
      driver: 'Mohamed Omar',
      nurse: 'Aisha Mohamed',
      currentRequest: 'None',
      fuelLevel: '85%',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      equipment: ['Oxygen', 'First Aid', 'Stretcher', 'Defibrillator'],
      notes: 'Well-maintained, ready for dispatch',
      totalDispatches: 156,
      avgResponseTime: '12 min'
    },
    {
      id: 'AMB-002',
      plateNumber: 'SO-5678',
      type: 'Advanced',
      status: 'DISPATCHED',
      location: 'En route to Yaqshid District',
      driver: 'Ahmed Yusuf',
      nurse: 'Nur Abdullahi',
      currentRequest: 'AAM-125',
      fuelLevel: '72%',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-04-20',
      equipment: ['Oxygen', 'Ventilator', 'ECG Monitor', 'Medications', 'Defibrillator'],
      notes: 'Advanced life support equipment',
      totalDispatches: 203,
      avgResponseTime: '10 min'
    },
    {
      id: 'AMB-003',
      plateNumber: 'SO-9012',
      type: 'Basic',
      status: 'MAINTENANCE',
      location: 'Service Center, Mogadishu',
      driver: 'Not Assigned',
      nurse: 'Not Assigned',
      currentRequest: 'None',
      fuelLevel: '45%',
      lastMaintenance: '2024-02-28',
      nextMaintenance: '2024-03-15',
      equipment: ['Oxygen', 'First Aid', 'Stretcher'],
      notes: 'Under maintenance - engine service',
      totalDispatches: 89,
      avgResponseTime: '15 min'
    },
    {
      id: 'AMB-004',
      plateNumber: 'SO-3456',
      type: 'Advanced',
      status: 'AVAILABLE',
      location: 'Wadajir District, Mogadishu',
      driver: 'Ibrahim Hassan',
      nurse: 'Fadumo Mohamed',
      currentRequest: 'None',
      fuelLevel: '91%',
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-05-10',
      equipment: ['Oxygen', 'Ventilator', 'ECG Monitor', 'Medications', 'Defibrillator'],
      notes: 'Fully equipped and ready',
      totalDispatches: 178,
      avgResponseTime: '11 min'
    },
    {
      id: 'AMB-005',
      plateNumber: 'SO-7890',
      type: 'Basic',
      status: 'OFFLINE',
      location: 'Headquarters, Mogadishu',
      driver: 'Not Assigned',
      nurse: 'Not Assigned',
      currentRequest: 'None',
      fuelLevel: '60%',
      lastMaintenance: '2024-02-15',
      nextMaintenance: '2024-05-15',
      equipment: ['Oxygen', 'First Aid', 'Stretcher'],
      notes: 'Offline for driver training',
      totalDispatches: 67,
      avgResponseTime: '14 min'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800'
      case 'DISPATCHED': return 'bg-blue-100 text-blue-800'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800'
      case 'OFFLINE': return 'bg-gray-100 text-gray-800'
      case 'OUT_OF_SERVICE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <Truck className="w-4 h-4" />
      case 'DISPATCHED': return <MapPin className="w-4 h-4" />
      case 'MAINTENANCE': return <Wrench className="w-4 h-4" />
      case 'OFFLINE': return <AlertCircle className="w-4 h-4" />
      default: return <Truck className="w-4 h-4" />
    }
  }

  const getFuelColor = (level: string) => {
    const numLevel = parseInt(level)
    if (numLevel >= 70) return 'bg-green-500'
    if (numLevel >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const filteredAmbulances = ambulances.filter(ambulance => {
    const matchesSearch = searchTerm === '' || 
      ambulance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || ambulance.status === statusFilter
    const matchesType = typeFilter === '' || ambulance.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewDetails = (ambulance: any) => {
    setSelectedAmbulance(ambulance)
    setShowDetails(true)
  }

  const handleAssignDriver = (ambulanceId: string) => {
    console.log('Assign driver for ambulance:', ambulanceId)
  }

  const handleUpdateStatus = (ambulanceId: string, newStatus: string) => {
    console.log('Update status for ambulance:', ambulanceId, 'to:', newStatus)
  }

  const handleDeleteAmbulance = (ambulanceId: string) => {
    if (confirm('Are you sure you want to delete this ambulance?')) {
      console.log('Delete ambulance:', ambulanceId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ambulances Management</h1>
            <p className="text-gray-600 mt-2">Manage all ambulance vehicles and their operational status</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              Export
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Ambulance
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ambulances</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
              <p className="text-sm text-gray-600 mt-2">2 Advanced, 3 Basic</p>
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
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dispatched</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
              <p className="text-sm text-blue-600 mt-2">Currently active</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
              <p className="text-sm text-yellow-600 mt-2">Under service</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Wrench className="w-6 h-6 text-yellow-600" />
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
                  placeholder="Search by ID, plate number, driver, location..."
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
                <option value="AVAILABLE">Available</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OFFLINE">Offline</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Basic">Basic</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Drivers</option>
                  <option value="Mohamed Omar">Mohamed Omar</option>
                  <option value="Ahmed Yusuf">Ahmed Yusuf</option>
                  <option value="Ibrahim Hassan">Ibrahim Hassan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Levels</option>
                  <option value="high">High (70%+)</option>
                  <option value="medium">Medium (40-70%)</option>
                  <option value="low">Low (&lt;40%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Maintenance</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Timeframes</option>
                  <option value="overdue">Overdue</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="next-month">Next Month</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          Showing <span className="font-semibold">{filteredAmbulances.length}</span> of{' '}
          <span className="font-semibold">{ambulances.length}</span> ambulances
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                  Fuel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance
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
                      <div className="text-sm font-medium text-gray-900">{ambulance.id}</div>
                      <div className="text-sm text-gray-500">{ambulance.plateNumber}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Type: <span className="font-medium">{ambulance.type}</span>
                      </div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {ambulance.location}
                      </div>
                      {ambulance.currentRequest !== 'None' && (
                        <div className="text-xs text-blue-600 mt-1">
                          Request: {ambulance.currentRequest}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ambulance.driver === 'Not Assigned' ? (
                        <span className="text-gray-400">Not Assigned</span>
                      ) : (
                        <div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            {ambulance.driver}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Nurse: {ambulance.nurse}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getFuelColor(ambulance.fuelLevel)}`}></div>
                      <span className="text-sm text-gray-900">{ambulance.fuelLevel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Next: {ambulance.nextMaintenance}</div>
                      <div className="text-xs text-gray-500">Last: {ambulance.lastMaintenance}</div>
                    </div>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAssignDriver(ambulance.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <User className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(ambulance.id, 'MAINTENANCE')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
            </tbody>
          </table>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
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
                    <p className="text-sm text-gray-600">Type</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedAmbulance.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAmbulance.status)}`}>
                      {selectedAmbulance.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Location</p>
                    <p className="font-medium">{selectedAmbulance.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Request</p>
                    <p className="font-medium">{selectedAmbulance.currentRequest}</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Fuel Level</p>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getFuelColor(selectedAmbulance.fuelLevel)}`}></div>
                      <span className="font-medium">{selectedAmbulance.fuelLevel}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Maintenance</p>
                    <p className="font-medium">{selectedAmbulance.lastMaintenance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Maintenance</p>
                    <p className="font-medium">{selectedAmbulance.nextMaintenance}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Dispatches</p>
                    <p className="font-medium">{selectedAmbulance.totalDispatches}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Response Time</p>
                    <p className="font-medium">{selectedAmbulance.avgResponseTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAmbulance.equipment.map((item: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <p className="text-gray-700">{selectedAmbulance.notes}</p>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button className="bg-red-600 hover:bg-red-700">
                Update Status
              </Button>
              <Button variant="outline">
                Assign Driver
              </Button>
              <Button variant="outline">
                Schedule Maintenance
              </Button>
              <Button variant="outline">
                Edit Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
