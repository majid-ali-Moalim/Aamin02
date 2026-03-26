'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, User, Mail, Phone, Shield, Activity, Clock, AlertCircle } from 'lucide-react'

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const employees = [
    {
      id: 'EMP-001',
      firstName: 'Ali',
      lastName: 'Hassan',
      email: 'ali.hassan@aamin.so',
      phone: '+252 61 234 5678',
      role: 'dispatcher',
      status: 'active',
      onDuty: true,
      department: 'Dispatch Operations',
      hireDate: '2023-01-15',
      lastLogin: '2024-03-26 10:30 AM',
      assignedAmbulance: 'None',
      currentRequest: 'AAM-124, AAM-125',
      totalDispatches: 456,
      avgDispatchTime: '8 min',
      certifications: ['Emergency Dispatch', 'CPR Certified'],
      address: 'Hodan District, Mogadishu',
      emergencyContact: '+252 61 999 8888'
    },
    {
      id: 'EMP-002',
      firstName: 'Said',
      lastName: 'Ali',
      email: 'said.ali@aamin.so',
      phone: '+252 61 345 6789',
      role: 'dispatcher',
      status: 'active',
      onDuty: true,
      department: 'Dispatch Operations',
      hireDate: '2023-03-20',
      lastLogin: '2024-03-26 09:45 AM',
      assignedAmbulance: 'None',
      currentRequest: 'AAM-126, AAM-127',
      totalDispatches: 378,
      avgDispatchTime: '9 min',
      certifications: ['Emergency Dispatch', 'First Aid'],
      address: 'Wadajir District, Mogadishu',
      emergencyContact: '+252 61 777 6666'
    },
    {
      id: 'EMP-003',
      firstName: 'Mohamed',
      lastName: 'Omar',
      email: 'mohamed.omar@aamin.so',
      phone: '+252 61 456 7890',
      role: 'driver',
      status: 'active',
      onDuty: true,
      department: 'Field Operations',
      hireDate: '2022-11-10',
      lastLogin: '2024-03-26 08:15 AM',
      assignedAmbulance: 'AMB-001',
      currentRequest: 'AAM-124',
      totalDispatches: 234,
      avgDispatchTime: '12 min',
      certifications: ['Commercial License', 'Defensive Driving', 'First Aid'],
      address: 'Yaqshid District, Mogadishu',
      emergencyContact: '+252 61 555 4444'
    },
    {
      id: 'EMP-004',
      firstName: 'Ahmed',
      lastName: 'Yusuf',
      email: 'ahmed.yusuf@aamin.so',
      phone: '+252 61 567 8901',
      role: 'driver',
      status: 'active',
      onDuty: true,
      department: 'Field Operations',
      hireDate: '2023-02-15',
      lastLogin: '2024-03-26 07:30 AM',
      assignedAmbulance: 'AMB-002',
      currentRequest: 'AAM-125',
      totalDispatches: 198,
      avgDispatchTime: '10 min',
      certifications: ['Commercial License', 'Emergency Vehicle Operations'],
      address: 'Bondhere District, Mogadishu',
      emergencyContact: '+252 61 333 2222'
    },
    {
      id: 'EMP-005',
      firstName: 'Aisha',
      lastName: 'Mohamed',
      email: 'aisha.mohamed@aamin.so',
      phone: '+252 61 678 9012',
      role: 'nurse',
      status: 'active',
      onDuty: true,
      department: 'Medical Services',
      hireDate: '2023-04-20',
      lastLogin: '2024-03-26 09:00 AM',
      assignedAmbulance: 'AMB-001',
      currentRequest: 'AAM-124',
      totalDispatches: 167,
      avgDispatchTime: '11 min',
      certifications: ['Registered Nurse', 'Emergency Care', 'BLS Certified'],
      address: 'Shangani District, Mogadishu',
      emergencyContact: '+252 61 111 0000'
    },
    {
      id: 'EMP-006',
      firstName: 'Nur',
      lastName: 'Abdullahi',
      email: 'nur.abdullahi@aamin.so',
      phone: '+252 61 789 0123',
      role: 'nurse',
      status: 'active',
      onDuty: true,
      department: 'Medical Services',
      hireDate: '2023-05-15',
      lastLogin: '2024-03-26 08:45 AM',
      assignedAmbulance: 'AMB-002',
      currentRequest: 'AAM-125',
      totalDispatches: 145,
      avgDispatchTime: '13 min',
      certifications: ['Registered Nurse', 'Critical Care', 'ACLS Certified'],
      address: 'Hamarweyne District, Mogadishu',
      emergencyContact: '+252 61 999 8888'
    },
    {
      id: 'EMP-007',
      firstName: 'Fadumo',
      lastName: 'Mohamed',
      email: 'fadumo.mohamed@aamin.so',
      phone: '+252 61 890 1234',
      role: 'nurse',
      status: 'inactive',
      onDuty: false,
      department: 'Medical Services',
      hireDate: '2023-06-10',
      lastLogin: '2024-03-25 06:00 PM',
      assignedAmbulance: 'AMB-004',
      currentRequest: 'None',
      totalDispatches: 89,
      avgDispatchTime: '14 min',
      certifications: ['Registered Nurse', 'Pediatric Care'],
      address: 'Abdiaziz District, Mogadishu',
      emergencyContact: '+252 61 777 5555'
    },
    {
      id: 'EMP-008',
      firstName: 'Ibrahim',
      lastName: 'Hassan',
      email: 'ibrahim.hassan@aamin.so',
      phone: '+252 61 901 2345',
      role: 'admin',
      status: 'active',
      onDuty: true,
      department: 'Administration',
      hireDate: '2022-09-01',
      lastLogin: '2024-03-26 11:00 AM',
      assignedAmbulance: 'None',
      currentRequest: 'None',
      totalDispatches: 0,
      avgDispatchTime: 'N/A',
      certifications: ['System Administration', 'Database Management'],
      address: 'Hodan District, Mogadishu',
      emergencyContact: '+252 61 666 3333'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'on_leave': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'dispatcher': return 'bg-blue-100 text-blue-800'
      case 'driver': return 'bg-orange-100 text-orange-800'
      case 'nurse': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'dispatcher': return <Activity className="w-4 h-4" />
      case 'driver': return <User className="w-4 h-4" />
      case 'nurse': return <AlertCircle className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === '' || employee.role === roleFilter
    const matchesStatus = statusFilter === '' || employee.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee)
    setShowDetails(true)
  }

  const handleAssignRole = (employeeId: string) => {
    console.log('Assign role for employee:', employeeId)
  }

  const handleUpdateStatus = (employeeId: string, newStatus: string) => {
    console.log('Update status for employee:', employeeId, 'to:', newStatus)
  }

  const handleDeleteEmployee = (employeeId: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      console.log('Delete employee:', employeeId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees Management</h1>
            <p className="text-gray-600 mt-2">Manage all staff members in the system</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              Export
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
              <p className="text-sm text-green-600 mt-2">+2 this month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
              <p className="text-sm text-green-600 mt-2">87.5% active rate</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Duty</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
              <p className="text-sm text-blue-600 mt-2">Currently working</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
              <p className="text-sm text-gray-600 mt-2">Active teams</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600" />
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
                  placeholder="Search by name, email, phone, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="dispatcher">Dispatcher</option>
                <option value="driver">Driver</option>
                <option value="nurse">Nurse</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Departments</option>
                  <option value="Dispatch Operations">Dispatch Operations</option>
                  <option value="Field Operations">Field Operations</option>
                  <option value="Medical Services">Medical Services</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duty Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Duty Status</option>
                  <option value="true">On Duty</option>
                  <option value="false">Off Duty</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date Range</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          Showing <span className="font-semibold">{filteredEmployees.length}</span> of{' '}
          <span className="font-semibold">{employees.length}</span> employees
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{employee.id}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {employee.department}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getRoleColor(employee.role)}`}>
                        {getRoleIcon(employee.role)}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                        {employee.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {employee.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                      <div className="text-xs text-gray-500">
                        {employee.onDuty ? 'On Duty' : 'Off Duty'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Ambulance: {employee.assignedAmbulance}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {employee.currentRequest !== 'None' ? `Request: ${employee.currentRequest}` : 'No active requests'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Total: {employee.totalDispatches}</div>
                      <div className="text-xs text-gray-500">
                        Avg: {employee.avgDispatchTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(employee)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAssignRole(employee.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(employee.id, 'inactive')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteEmployee(employee.id)}
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
      {showDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-medium">{selectedEmployee.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedEmployee.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <p className="font-medium">{selectedEmployee.emergencyContact}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedEmployee.role)}`}>
                      {selectedEmployee.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duty Status</p>
                    <p className="font-medium">{selectedEmployee.onDuty ? 'On Duty' : 'Off Duty'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hire Date</p>
                    <p className="font-medium">{selectedEmployee.hireDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium">{selectedEmployee.lastLogin}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Assignment</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Assigned Ambulance</p>
                    <p className="font-medium">{selectedEmployee.assignedAmbulance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Requests</p>
                    <p className="font-medium">{selectedEmployee.currentRequest}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Dispatches</p>
                    <p className="font-medium">{selectedEmployee.totalDispatches}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Dispatch Time</p>
                    <p className="font-medium">{selectedEmployee.avgDispatchTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {selectedEmployee.certifications.map((cert: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button className="bg-red-600 hover:bg-red-700">
                Update Status
              </Button>
              <Button variant="outline">
                Assign Role
              </Button>
              <Button variant="outline">
                Edit Profile
              </Button>
              <Button variant="outline">
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
