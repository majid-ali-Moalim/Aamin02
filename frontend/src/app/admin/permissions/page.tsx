'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, Shield, User, Truck, AlertCircle, Settings, Lock, Unlock, CheckCircle, XCircle } from 'lucide-react'

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const staffMembers = [
    {
      id: 'EMP-001',
      firstName: 'Ali',
      lastName: 'Hassan',
      email: 'ali.hassan@aamin.so',
      role: 'dispatcher',
      status: 'active',
      permissions: {
        canRegisterDriver: true,
        canRegisterNurse: false,
        canRegisterAmbulance: false,
        canRegisterPatient: true,
        canAssignRequest: true,
        canEditRequest: true,
        canDeleteRequest: false,
        canViewReports: true,
        canManageNotifications: true,
        canViewAnalytics: false,
        canManageStaff: false,
        canManageSystem: false
      },
      lastPermissionUpdate: '2024-03-20',
      updatedBy: 'Admin User',
      department: 'Dispatch Operations'
    },
    {
      id: 'EMP-002',
      firstName: 'Said',
      lastName: 'Ali',
      email: 'said.ali@aamin.so',
      role: 'dispatcher',
      status: 'active',
      permissions: {
        canRegisterDriver: true,
        canRegisterNurse: true,
        canRegisterAmbulance: false,
        canRegisterPatient: true,
        canAssignRequest: true,
        canEditRequest: true,
        canDeleteRequest: true,
        canViewReports: true,
        canManageNotifications: true,
        canViewAnalytics: true,
        canManageStaff: false,
        canManageSystem: false
      },
      lastPermissionUpdate: '2024-03-15',
      updatedBy: 'Admin User',
      department: 'Dispatch Operations'
    },
    {
      id: 'EMP-008',
      firstName: 'Ibrahim',
      lastName: 'Hassan',
      email: 'ibrahim.hassan@aamin.so',
      role: 'admin',
      status: 'active',
      permissions: {
        canRegisterDriver: true,
        canRegisterNurse: true,
        canRegisterAmbulance: true,
        canRegisterPatient: true,
        canAssignRequest: true,
        canEditRequest: true,
        canDeleteRequest: true,
        canViewReports: true,
        canManageNotifications: true,
        canViewAnalytics: true,
        canManageStaff: true,
        canManageSystem: true
      },
      lastPermissionUpdate: '2024-03-01',
      updatedBy: 'System',
      department: 'Administration'
    },
    {
      id: 'EMP-003',
      firstName: 'Mohamed',
      lastName: 'Omar',
      email: 'mohamed.omar@aamin.so',
      role: 'driver',
      status: 'active',
      permissions: {
        canRegisterDriver: false,
        canRegisterNurse: false,
        canRegisterAmbulance: false,
        canRegisterPatient: false,
        canAssignRequest: false,
        canEditRequest: false,
        canDeleteRequest: false,
        canViewReports: false,
        canManageNotifications: false,
        canViewAnalytics: false,
        canManageStaff: false,
        canManageSystem: false
      },
      lastPermissionUpdate: '2024-03-10',
      updatedBy: 'Admin User',
      department: 'Field Operations'
    },
    {
      id: 'EMP-005',
      firstName: 'Aisha',
      lastName: 'Mohamed',
      email: 'aisha.mohamed@aamin.so',
      role: 'nurse',
      status: 'active',
      permissions: {
        canRegisterDriver: false,
        canRegisterNurse: false,
        canRegisterAmbulance: false,
        canRegisterPatient: true,
        canAssignRequest: false,
        canEditRequest: false,
        canDeleteRequest: false,
        canViewReports: false,
        canManageNotifications: false,
        canViewAnalytics: false,
        canManageStaff: false,
        canManageSystem: false
      },
      lastPermissionUpdate: '2024-03-12',
      updatedBy: 'Admin User',
      department: 'Medical Services'
    }
  ]

  const permissionCategories = [
    {
      category: 'Registration Permissions',
      icon: <User className="w-5 h-5" />,
      permissions: [
        { key: 'canRegisterDriver', label: 'Register Drivers', description: 'Can add new driver profiles' },
        { key: 'canRegisterNurse', label: 'Register Nurses', description: 'Can add new nurse profiles' },
        { key: 'canRegisterAmbulance', label: 'Register Ambulances', description: 'Can add new ambulance vehicles' },
        { key: 'canRegisterPatient', label: 'Register Patients', description: 'Can add new patient records' }
      ]
    },
    {
      category: 'Request Management',
      icon: <AlertCircle className="w-5 h-5" />,
      permissions: [
        { key: 'canAssignRequest', label: 'Assign Requests', description: 'Can assign ambulances to requests' },
        { key: 'canEditRequest', label: 'Edit Requests', description: 'Can modify request details' },
        { key: 'canDeleteRequest', label: 'Delete Requests', description: 'Can remove requests' }
      ]
    },
    {
      category: 'System Access',
      icon: <Settings className="w-5 h-5" />,
      permissions: [
        { key: 'canViewReports', label: 'View Reports', description: 'Can access system reports' },
        { key: 'canManageNotifications', label: 'Manage Notifications', description: 'Can send system notifications' },
        { key: 'canViewAnalytics', label: 'View Analytics', description: 'Can access analytics dashboard' }
      ]
    },
    {
      category: 'Administrative',
      icon: <Shield className="w-5 h-5" />,
      permissions: [
        { key: 'canManageStaff', label: 'Manage Staff', description: 'Can manage staff permissions' },
        { key: 'canManageSystem', label: 'Manage System', description: 'Can modify system settings' }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
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

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = searchTerm === '' || 
      `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === '' || staff.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const handleViewDetails = (staff: any) => {
    setSelectedStaff(staff)
    setShowDetails(true)
  }

  const handleUpdatePermissions = (staffId: string) => {
    console.log('Update permissions for staff:', staffId)
  }

  const handleTogglePermission = (staffId: string, permissionKey: string) => {
    console.log('Toggle permission:', staffId, permissionKey)
  }

  const handleResetPermissions = (staffId: string) => {
    if (confirm('Are you sure you want to reset all permissions for this staff member?')) {
      console.log('Reset permissions for staff:', staffId)
    }
  }

  const getPermissionCount = (permissions: any) => {
    return Object.values(permissions).filter(Boolean).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Permission Management</h1>
            <p className="text-gray-600 mt-2">Control who can create or manage records in the system</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              Export
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Assign Permissions
            </Button>
          </div>
        </div>
      </div>

      {/* Permission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
              <p className="text-sm text-gray-600 mt-2">With permissions</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Full Access</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
              <p className="text-sm text-purple-600 mt-2">Admin level</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Can Register</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              <p className="text-sm text-green-600 mt-2">Staff/vehicles</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Limited Access</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              <p className="text-sm text-yellow-600 mt-2">Basic permissions</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Lock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Permission Matrix Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Matrix Overview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Register
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {staff.firstName} {staff.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{staff.role}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-1">
                      {staff.permissions.canRegisterDriver && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {staff.permissions.canRegisterNurse && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {staff.permissions.canRegisterAmbulance && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {staff.permissions.canRegisterPatient && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {!staff.permissions.canRegisterDriver && !staff.permissions.canRegisterNurse && 
                       !staff.permissions.canRegisterAmbulance && !staff.permissions.canRegisterPatient && 
                       <XCircle className="w-4 h-4 text-gray-300" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-1">
                      {staff.permissions.canAssignRequest && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {staff.permissions.canEditRequest && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {staff.permissions.canDeleteRequest && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {!staff.permissions.canAssignRequest && !staff.permissions.canEditRequest && 
                       !staff.permissions.canDeleteRequest && <XCircle className="w-4 h-4 text-gray-300" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-1">
                      {staff.permissions.canViewReports && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {staff.permissions.canManageNotifications && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {staff.permissions.canViewAnalytics && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {!staff.permissions.canViewReports && !staff.permissions.canManageNotifications && 
                       !staff.permissions.canViewAnalytics && <XCircle className="w-4 h-4 text-gray-300" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-1">
                      {staff.permissions.canManageStaff && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {staff.permissions.canManageSystem && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {!staff.permissions.canManageStaff && !staff.permissions.canManageSystem && 
                       <XCircle className="w-4 h-4 text-gray-300" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getPermissionCount(staff.permissions)}/11
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  placeholder="Search by name, email, ID..."
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
            </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-gray-900">{staff.firstName} {staff.lastName}</p>
                    <p className="text-sm text-gray-500">{staff.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(staff.role)}`}>
                        {staff.role}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                        {staff.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{getPermissionCount(staff.permissions)} Permissions</p>
                    <p className="text-xs text-gray-500">Updated: {staff.lastPermissionUpdate}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(staff)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUpdatePermissions(staff.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResetPermissions(staff.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Staff Permissions</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedStaff.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedStaff.role)}`}>
                      {selectedStaff.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{selectedStaff.department}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Summary</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Permissions</p>
                    <p className="font-medium">{getPermissionCount(selectedStaff.permissions)} / 11</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{selectedStaff.lastPermissionUpdate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Updated By</p>
                    <p className="font-medium">{selectedStaff.updatedBy}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {permissionCategories.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="text-red-600">{category.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.permissions.map((permission) => (
                      <div key={permission.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{permission.label}</p>
                          <p className="text-sm text-gray-500">{permission.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedStaff.permissions[permission.key] ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleTogglePermission(selectedStaff.id, permission.key)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Lock className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-gray-300" />
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleTogglePermission(selectedStaff.id, permission.key)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Unlock className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <Button className="bg-red-600 hover:bg-red-700">
                Update Permissions
              </Button>
              <Button variant="outline">
                Reset All Permissions
              </Button>
              <Button variant="outline">
                Copy to Another Staff
              </Button>
              <Button variant="outline">
                Export Permission Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
