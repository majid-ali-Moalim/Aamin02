'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, User, Mail, Phone, Shield, Activity, Clock, AlertCircle, X, Loader2, Award, Briefcase, Key, ClipboardList, Lock } from 'lucide-react'
import { employeesService, systemSetupService } from '@/lib/api'
import { Employee, Role, EmployeeRole, Department } from '@/types'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Master Data States
  const [availableRoles, setAvailableRoles] = useState<EmployeeRole[]>([])
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([])

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    employeeRoleId: '',
    role: 'EMPLOYEE' as Role,
    departmentId: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    fetchEmployees()
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      const [rolesData, deptsData] = await Promise.all([
        systemSetupService.getRoles(),
        systemSetupService.getDepartments()
      ])
      setAvailableRoles(rolesData)
      setAvailableDepartments(deptsData)
    } catch (err) {
      console.error('Failed to fetch master data:', err)
    }
  }

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const data = await employeesService.getAll()
      setEmployees(data)
    } catch (err) {
      console.error('Failed to fetch employees:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      setIsSubmitting(true)
      await employeesService.create(newEmployee)
      setIsAddModalOpen(false)
      setNewEmployee({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        employeeRoleId: '',
        role: 'EMPLOYEE' as Role,
        departmentId: '',
        status: 'ACTIVE'
      })
      fetchEmployees()
    } catch (err: any) {
      console.error('Failed to add employee:', err)
      setError(
        err?.response?.data?.message || 
        err?.message || 
        'Failed to register personnel. Ensure that the username and email are unique.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success/10 text-success'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-primary/10 text-primary'
      case 'on_leave': return 'bg-warning/10 text-warning'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'DISPATCHER': return 'bg-blue-100 text-blue-800'
      case 'DRIVER': return 'bg-orange-100 text-orange-800'
      case 'NURSE': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (roleName: string) => {
    const name = roleName?.toUpperCase() || ''
    if (name.includes('ADMIN')) return <Shield className="w-4 h-4" />
    if (name.includes('DISPATCH')) return <Activity className="w-4 h-4" />
    if (name.includes('DRIVER')) return <User className="w-4 h-4" />
    if (name.includes('NURSE')) return <AlertCircle className="w-4 h-4" />
    return <User className="w-4 h-4" />
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase()
      const matchesSearch = searchTerm === '' || 
        fullName.includes(searchTerm.toLowerCase()) ||
        employee.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone?.includes(searchTerm) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === '' || employee.employeeRoleId === roleFilter
      const matchesStatus = statusFilter === '' || employee.status === statusFilter
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [employees, searchTerm, roleFilter, statusFilter])

  const stats = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'ACTIVE').length,
      onDuty: employees.filter(e => e.status === 'ACTIVE').length,
      departments: new Set(employees.map(e => e.departmentId).filter(Boolean)).size
    }
  }, [employees])

  const handleViewDetails = (employee: Employee) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Employees Management</h1>
          <p className="text-gray-500 mt-1">Manage and track your operational personnel</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold h-11 px-6 shadow-sm">
            Export Report
          </Button>
          <Button 
            className="bg-primary hover:bg-destructive rounded-xl shadow-lg shadow-primary/20 transition-all font-black h-11 px-6"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            REGISTER STAFF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Employees</p>
              <p className="text-3xl font-black text-secondary mt-1 tracking-tighter">{stats.total}</p>
              <p className="text-[10px] text-green-600 mt-2 font-bold bg-green-50 inline-block px-2 py-0.5 rounded-full">LIVE COVERAGE</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Staff</p>
              <p className="text-3xl font-black text-secondary mt-1 tracking-tighter">{stats.active}</p>
              <p className="text-[10px] text-green-600 mt-2 font-bold bg-green-50 inline-block px-2 py-0.5 rounded-full">OPERATIONAL</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">On Duty</p>
              <p className="text-3xl font-black text-secondary mt-1 tracking-tighter">{stats.onDuty}</p>
              <p className="text-[10px] text-blue-600 mt-2 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded-full">ACTIVE NOW</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Departments</p>
              <p className="text-3xl font-black text-secondary mt-1 tracking-tighter">{stats.departments}</p>
              <p className="text-[10px] text-purple-600 mt-2 font-bold bg-purple-50 inline-block px-2 py-0.5 rounded-full">ORGANIZED UNITS</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name, ID, email, or department..."
              className="w-full pl-12 pr-6 h-14 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium text-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold text-secondary focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231D3557%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_1.5rem_center] bg-no-repeat min-w-[200px]"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              {availableRoles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <Button 
              variant="outline" 
              className={`rounded-2xl h-14 px-6 border-none font-bold transition-all ${showFilters ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 mr-2" />
              Advanced
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
              <select 
                className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 font-bold text-secondary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Currently Active</option>
                <option value="INACTIVE">Inactive / Offline</option>
                <option value="ON_LEAVE">Medical Leave</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
              <select className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 font-bold text-secondary">
                <option value="">All Departments</option>
                {availableDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Area</label>
              <select className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 font-bold text-secondary">
                <option value="">All Regions</option>
                <option value="HQ">Central HQ</option>
                <option value="NORTH">North Division</option>
                <option value="SOUTH">South Division</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid Display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-secondary/40 font-black uppercase tracking-widest text-xs">Synchronizing Personnel Records...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-xl font-black text-secondary mb-2">No Personnel Found</h3>
          <p className="text-secondary/50 max-w-md mx-auto">We couldn't find any staff members matching your search criteria. Try broadening your search or register a new team member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary/5 p-4 rounded-2xl group-hover:bg-primary/10 transition-colors">
                      <User className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-black text-secondary text-lg leading-tight uppercase tracking-tight">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em]">{employee.department?.name || 'GENERAL STAFF'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-1 leading-none">Specialization</p>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-black text-secondary">{employee.employeeRole?.name || 'UNASSIGNED ROLE'}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-1 leading-none">Fleet ID</p>
                    <p className="text-xs font-black text-secondary truncate">{employee.assignedAmbulanceId || 'UNASSIGNED'}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs px-1">
                    <div className="flex items-center text-secondary/50 font-bold">
                      <Mail className="w-3 h-3 mr-2" />
                      Email
                    </div>
                    <span className="font-black text-secondary max-w-[150px] truncate">{employee.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs px-1">
                    <div className="flex items-center text-secondary/50 font-bold">
                      <Phone className="w-3 h-3 mr-2" />
                      Phone
                    </div>
                    <span className="font-black text-secondary">{employee.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    className="flex-1 rounded-xl h-11 font-black text-[10px] tracking-widest bg-secondary hover:bg-secondary/90 shadow-sm"
                    onClick={() => handleViewDetails(employee)}
                  >
                    PROFILE
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-11 w-11 p-0 border-2 hover:bg-primary/5 hover:text-primary border-gray-100"
                    onClick={() => handleUpdateStatus(employee.id, 'ACTIVE')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-11 w-11 p-0 border-2 hover:bg-destructive/5 hover:text-destructive border-gray-100"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#eef3f9] to-[#e4edf6] overflow-hidden animate-in fade-in duration-200">
          {/* Header */}
          <div className="relative h-[110px] bg-[#eef3f9] border-b border-[#d0e0f0] flex items-center px-8 shadow-sm flex-shrink-0">
             {/* Decorative Background Line */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 50 L300 50 L310 40 L320 60 L330 10 L340 90 L350 50 L1000 50\' stroke=\'%231a5f9a\' stroke-width=\'2\' fill=\'none\'/%3E%3C/svg%3E")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
             
             {/* Large faint background cross */}
             <div className="absolute top-[-30px] right-[10%] opacity-5 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 100 100">
                  <path d="M 35 15 L 65 15 L 65 35 L 85 35 L 85 65 L 65 65 L 65 85 L 35 85 L 35 65 L 15 65 L 15 35 L 35 35 Z" fill="#1a5f9a" />
                </svg>
             </div>

             <div className="max-w-4xl mx-auto w-full flex items-center justify-between relative z-10">
               <div className="flex items-center gap-5">
                 {/* Ambulance Icon Mock */}
                 <div className="w-[72px] h-[48px] relative flex items-center justify-center text-[32px] bg-white rounded-md shadow-sm border border-gray-200" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)' }}>
                   🚑
                 </div>
                 <div>
                   <h2 className="text-[28px] font-bold text-[#1b5b9c] tracking-tight leading-none mb-1">Add New Employee</h2>
                   <p className="text-[#6c86a3] text-[13px]">Fill in the details below to add a new employee</p>
                 </div>
               </div>
               
               <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-[#d0e0f0] text-gray-400 hover:text-red-500 hover:bg-white transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <form onSubmit={handleAddEmployee} className="max-w-4xl mx-auto space-y-5">
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-bold flex items-center gap-3 border border-red-200 shadow-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* SECTION 1: EMPLOYEE INFORMATION */}
              <div className="bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#e2e8f0] pt-12 pb-6 px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 flex h-8 shadow-sm">
                  <div className="bg-[#df5c55] w-10 flex items-center justify-center text-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div className="bg-gradient-to-r from-[#69a1e3] to-[#8dbff7] text-white text-[11px] font-bold flex items-center px-4 pr-10 uppercase tracking-wider" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)', letterSpacing: '0.05em' }}>
                    Employee Information
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">First Name <span className="text-[#df5c55]">*</span></label>
                    <input required type="text" placeholder="Enter patient full name" className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 focus:bg-white focus:border-blue-400 transition-colors outline-none placeholder-[#94a3b8]" value={newEmployee.firstName} onChange={e => setNewEmployee({...newEmployee, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">Last Name <span className="text-[#df5c55]">*</span></label>
                    <input required type="text" placeholder="Enter name" className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 focus:bg-white focus:border-blue-400 transition-colors outline-none placeholder-[#94a3b8]" value={newEmployee.lastName} onChange={e => setNewEmployee({...newEmployee, lastName: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">Phone Number</label>
                    <div className="flex h-[38px] rounded-[4px] border border-[#cbd5e1] bg-[#f8fafc] overflow-hidden focus-within:ring-1 focus-within:ring-blue-400 focus-within:bg-white focus-within:border-blue-400 transition-colors">
                      <div className="flex items-center px-3 bg-[#f1f5f9] border-r border-[#cbd5e1] text-[13px] text-[auto] font-medium min-w-[80px]">
                         <div className="w-4 h-3 bg-[#1d4ed8] mr-2 flex items-center justify-center rounded-[2px] overflow-hidden relative"><div className="absolute inset-0 bg-white/30 clip-path-half" style={{clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'}}/></div>
                         <span className="text-[#475569]">+252</span>
                      </div>
                      <input required type="tel" placeholder="Enter phone number" className="flex-1 px-3 bg-transparent text-[13px] text-[#334155] outline-none placeholder-[#94a3b8]" value={newEmployee.phone} onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">Email Address <span className="text-[#df5c55]">*</span></label>
                    <input required type="email" placeholder="Enter employee email" className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 focus:bg-white focus:border-blue-400 transition-colors outline-none placeholder-[#94a3b8]" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* SECTION 2: JOB DETAILS */}
              <div className="bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#e2e8f0] pt-12 pb-6 px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 flex h-8 shadow-sm">
                  <div className="bg-[#df5c55] w-10 flex items-center justify-center text-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="bg-gradient-to-r from-[#69a1e3] to-[#8dbff7] text-white text-[11px] font-bold flex items-center px-4 pr-10 uppercase tracking-wider" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)', letterSpacing: '0.05em' }}>
                    Job Details
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">Employee Role <span className="text-[#df5c55]">*</span></label>
                     <select required className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 outline-none" value={newEmployee.employeeRoleId} onChange={e => setNewEmployee({...newEmployee, employeeRoleId: e.target.value})}>
                      <option value="">Select role</option>
                      {availableRoles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">Department <span className="text-[#df5c55]">*</span></label>
                    <select required className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 outline-none" value={newEmployee.departmentId} onChange={e => setNewEmployee({...newEmployee, departmentId: e.target.value})}>
                      <option value="">Select department</option>
                      {availableDepartments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">Employee Status <span className="text-[#df5c55]">*</span></label>
                     <select className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 outline-none" value={newEmployee.status} onChange={e => setNewEmployee({...newEmployee, status: e.target.value})}>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">System Status (Role) <span className="text-[#df5c55]">*</span></label>
                     <select className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 outline-none" value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value as Role})}>
                      <option value="EMPLOYEE">Standard Level</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: ACCOUNT SETTINGS */}
              <div className="bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#e2e8f0] pt-12 pb-6 px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 flex h-8 shadow-sm">
                  <div className="bg-[#df5c55] w-10 flex items-center justify-center text-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="bg-gradient-to-r from-[#69a1e3] to-[#8dbff7] text-white text-[11px] font-bold flex items-center px-4 pr-10 uppercase tracking-wider" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)', letterSpacing: '0.05em' }}>
                    Account Settings
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c] flex items-center gap-2">
                      Username <span className="text-[#f59e0b]"><Lock className="w-3 h-3"/></span>
                    </label>
                    <div className="flex relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                        <User className="w-4 h-4" />
                      </div>
                      <input required type="text" placeholder="Select user account" className="w-full h-[38px] pl-10 pr-3 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 focus:bg-white focus:border-blue-400 transition-colors outline-none placeholder-[#94a3b8]" value={newEmployee.username} onChange={e => setNewEmployee({...newEmployee, username: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                     <div className="relative flex items-center justify-center">
                       <input type="checkbox" id="sendEmail" defaultChecked className="w-[18px] h-[18px] peer cursor-pointer appearance-none border border-[#cbd5e1] rounded-[4px] bg-white checked:bg-[#3b82f6] checked:border-[#3b82f6] transition-colors" />
                       <svg className="absolute w-[12px] h-[12px] text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                     <label htmlFor="sendEmail" className="text-[13px] text-[#3b4b5c] cursor-pointer">Send Welcome Email</label>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PASSWORD */}
              <div className="bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#e2e8f0] pt-12 pb-6 px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 flex h-8 shadow-sm">
                  <div className="bg-[#df5c55] w-10 flex items-center justify-center text-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                    <Key className="w-4 h-4 transform -scale-x-100" />
                  </div>
                  <div className="bg-gradient-to-r from-[#69a1e3] to-[#8dbff7] text-white text-[11px] font-bold flex items-center px-4 pr-10 uppercase tracking-wider" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)', letterSpacing: '0.05em' }}>
                    Password <span className="text-[11px] ml-1 font-black transform translate-y-[1px]">*</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">Password <span className="text-[#df5c55]">*</span></label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                        <Key className="w-[14px] h-[14px] transform -scale-x-100" />
                      </div>
                      <input required type="password" placeholder="Enter password" className="w-full h-[38px] pl-9 pr-10 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 focus:bg-white focus:border-blue-400 transition-colors outline-none placeholder-[#94a3b8]" value={newEmployee.password} onChange={e => setNewEmployee({...newEmployee, password: e.target.value})} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] cursor-pointer hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#3b4b5c]">Confirm Password <span className="text-[#df5c55]">*</span></label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                        <Key className="w-[14px] h-[14px] transform -scale-x-100" />
                      </div>
                      <input required type="password" placeholder="Confirm password" className="w-full h-[38px] pl-9 pr-10 border border-[#cbd5e1] rounded-[4px] bg-[#f8fafc] text-[13px] text-[#334155] focus:ring-1 focus:ring-blue-400 focus:bg-white focus:border-blue-400 transition-colors outline-none placeholder-[#94a3b8]" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] cursor-pointer hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2.5">
                   <div className="relative flex items-center justify-center mt-0.5">
                       <input type="checkbox" id="tempPass" defaultChecked className="w-[14px] h-[14px] peer cursor-pointer appearance-none border border-[#cbd5e1] rounded-[3px] bg-[#f1f5f9] checked:bg-[#94a3b8] checked:border-[#94a3b8] transition-colors" />
                       <svg className="absolute w-[10px] h-[10px] text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </div>
                   <label htmlFor="tempPass" className="text-[12px] text-[#94a3b8] cursor-pointer pt-[1px] leading-tight">A temporary password can be provided. User will be forced to change it on first login.</label>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-2 pb-10 text-center space-y-4">
                <div className="flex gap-4 justify-center">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gradient-to-b from-[#7a8da3] to-[#5a6e84] hover:from-[#6b7b8f] hover:to-[#4e6074] text-white px-8 py-3 rounded-[4px] text-[15px] shadow-[0_4px_10px_rgba(90,110,132,0.3)] transition-all flex items-center justify-center gap-2 w-[220px]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                    <X className="w-4 h-4 stroke-[3]" /> Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-gradient-to-b from-[#35c38e] to-[#259b6c] hover:from-[#2eb886] hover:to-[#1f8c60] text-white px-8 py-3 rounded-[4px] text-[15px] shadow-[0_4px_10px_rgba(37,155,108,0.3)] transition-all flex items-center justify-center gap-2 w-[260px]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Create Employee <span className="text-[22px] leading-[0] transform translate-y-[-1px] font-bold ml-1">›</span></>
                    )}
                  </button>
                </div>
                <p className="text-[12.5px] text-[#94a3b8] mt-4 font-medium">User login details and welcome information will be sent by email.</p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal - Side Sheet Refactor */}
      {showDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex justify-end z-[100] transition-all duration-500 overflow-hidden">
          <div 
            className="bg-white h-full w-full max-w-xl shadow-[-20px_0_50px_rgba(29,53,87,0.1)] border-l border-gray-100 relative animate-in slide-in-from-right duration-500 flex flex-col"
          >
             <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50">
               <div className="flex items-center gap-4">
                 <div className="bg-primary/5 p-3 rounded-2xl">
                   <User className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Staff Profile</h2>
                   <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Operative Overview</p>
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
                   <div className="absolute -bottom-2 -right-2 bg-success p-3 rounded-2xl shadow-xl border-4 border-white">
                     <Activity className="w-6 h-6 text-white animate-pulse" />
                   </div>
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase leading-none mb-2">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-800`}>
                        {selectedEmployee.employeeRole?.name || 'N/A'}
                      </span>
                      <div className="h-1 w-1 bg-gray-200 rounded-full" />
                      <span className="text-xs text-secondary/40 font-black uppercase tracking-[0.2em]">ID: {selectedEmployee.id}</span>
                    </div>
                 </div>
               </div>

               <div className="space-y-10">
                 <div className="space-y-8">
                   <div>
                     <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                       <div className="w-2 h-4 bg-primary rounded-full" />
                       CORE DATA
                     </h3>
                     <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                       <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-1">
                           <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Full Operative Name</p>
                           <p className="text-lg font-black text-secondary leading-none">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                         </div>
                         <div className="space-y-1">
                           <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Phone Link</p>
                           <p className="text-lg font-black text-secondary leading-none">{selectedEmployee.phone}</p>
                         </div>
                       </div>
                       <div className="pt-4 space-y-1 border-t border-gray-100">
                         <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Secure Communication</p>
                         <p className="text-lg font-black text-secondary lowercase flex items-center gap-2">
                           {selectedEmployee.user?.email}
                         </p>
                       </div>
                     </div>
                   </div>

                   <div>
                      <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                       <div className="w-2 h-4 bg-primary rounded-full" />
                       ASSET DEPLOYMENT
                     </h3>
                     <div className="bg-gradient-to-br from-success/10 to-transparent p-6 rounded-[2rem] border-2 border-success/20 group hover:shadow-lg transition-all">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-[10px] font-black text-success uppercase tracking-[0.3em] mb-2">Fleet Integration</p>
                           <p className="text-2xl font-black text-secondary tracking-tighter">{selectedEmployee.assignedAmbulanceId || 'PENDING ASSIGNMENT'}</p>
                         </div>
                         <div className="bg-white p-5 rounded-[1.5rem] shadow-xl border border-success/10">
                           <Activity className="w-8 h-8 text-success animate-pulse" />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-8">
                   <div>
                     <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                       <div className="w-2 h-4 bg-primary rounded-full" />
                       OPERATIONAL PARAMETERS
                     </h3>
                     <div className="space-y-6 bg-secondary p-6 rounded-[2rem] shadow-2xl">
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Division</p>
                            <p className="text-lg font-black text-white">{selectedEmployee.department?.name || 'OFFICE'}</p>
                          </div>
                         <div>
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedEmployee.status)} bg-white/10 text-white border border-white/20`}>
                             {selectedEmployee.status}
                           </span>
                         </div>
                       </div>
                       <div className="pt-6 border-t border-white/10">
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Record Created</p>
                         <p className="text-sm font-bold text-white/70 italic">Synchronized at Deployment</p>
                       </div>
                     </div>
                   </div>

                   <div>
                      <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                       <div className="w-2 h-4 bg-primary rounded-full" />
                       PERFORMANCE METRICS
                     </h3>
                     <div className="grid grid-cols-2 gap-6">
                       <div className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-gray-100 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-all group">
                         <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Emergency Calls</p>
                         <p className="text-2xl font-black text-secondary tracking-tighter">00</p>
                       </div>
                       <div className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-gray-100 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-all group">
                         <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Expertise Score</p>
                         <p className="text-2xl font-black text-secondary tracking-tighter">N/A</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
               <Button className="flex-1 bg-primary hover:bg-destructive h-14 rounded-2xl font-black text-[10px] tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">
                 MODIFY STATUS
               </Button>
               <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black text-[10px] tracking-widest border-2 hover:bg-white active:scale-95 transition-all">
                 EDIT ROLE
               </Button>
               <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl flex items-center justify-center border-2 text-destructive border-destructive/10 hover:bg-destructive/5 active:scale-95 transition-all">
                 <Trash2 className="w-5 h-5" />
               </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
