'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Eye, Edit, Trash2, User, Phone, Mail, Calendar, MapPin, AlertCircle, FileText } from 'lucide-react'

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const patients = [
    {
      id: 'PAT-001',
      firstName: 'Ahmed',
      lastName: 'Mohamed',
      phone: '+252 61 234 5678',
      email: 'ahmed.mohamed@email.com',
      dateOfBirth: '1985-06-15',
      age: 38,
      gender: 'Male',
      bloodType: 'O+',
      address: 'Hodan District, Mogadishu',
      emergencyContact: 'Fatima Mohamed - +252 61 999 8888',
      medicalConditions: ['Hypertension', 'Diabetes Type 2'],
      allergies: ['Penicillin', 'Peanuts'],
      medications: ['Metformin', 'Lisinopril'],
      totalRequests: 3,
      lastRequest: '2024-03-20',
      assignedAmbulance: 'AMB-001',
      lastHospital: 'Mogadishu General Hospital',
      insuranceProvider: 'Somali Health Insurance',
      insuranceNumber: 'SHI-123456'
    },
    {
      id: 'PAT-002',
      firstName: 'Fatima',
      lastName: 'Ali',
      phone: '+252 61 345 6789',
      email: 'fatima.ali@email.com',
      dateOfBirth: '1992-03-22',
      age: 32,
      gender: 'Female',
      bloodType: 'A+',
      address: 'Wadajir District, Mogadishu',
      emergencyContact: 'Hassan Ali - +252 61 777 6666',
      medicalConditions: ['Asthma'],
      allergies: ['None'],
      medications: ['Albuterol Inhaler'],
      totalRequests: 2,
      lastRequest: '2024-03-25',
      assignedAmbulance: 'AMB-001',
      lastHospital: 'Benadir Hospital',
      insuranceProvider: 'Private Insurance',
      insuranceNumber: 'PI-789012'
    },
    {
      id: 'PAT-003',
      firstName: 'Hassan',
      lastName: 'Omar',
      phone: '+252 61 456 7890',
      email: 'hassan.omar@email.com',
      dateOfBirth: '1978-11-08',
      age: 45,
      gender: 'Male',
      bloodType: 'B+',
      address: 'Yaqshid District, Mogadishu',
      emergencyContact: 'Amina Omar - +252 61 555 4444',
      medicalConditions: ['Heart Disease', 'High Cholesterol'],
      allergies: ['Sulfa drugs'],
      medications: ['Aspirin', 'Statin'],
      totalRequests: 5,
      lastRequest: '2024-03-26',
      assignedAmbulance: 'AMB-002',
      lastHospital: 'Kalkal Hospital',
      insuranceProvider: 'No Insurance',
      insuranceNumber: 'N/A'
    },
    {
      id: 'PAT-004',
      firstName: 'Amina',
      lastName: 'Hassan',
      phone: '+252 61 567 8901',
      email: 'amina.hassan@email.com',
      dateOfBirth: '1995-08-30',
      age: 28,
      gender: 'Female',
      bloodType: 'AB+',
      address: 'Bondhere District, Mogadishu',
      emergencyContact: 'Mohamed Hassan - +252 61 333 2222',
      medicalConditions: ['None'],
      allergies: ['Latex'],
      medications: ['None'],
      totalRequests: 1,
      lastRequest: '2024-03-15',
      assignedAmbulance: 'AMB-003',
      lastHospital: 'Forlanini Hospital',
      insuranceProvider: 'Employer Insurance',
      insuranceNumber: 'EI-345678'
    },
    {
      id: 'PAT-005',
      firstName: 'Mohamed',
      lastName: 'Ali',
      phone: '+252 61 678 9012',
      email: 'mohamed.ali@email.com',
      dateOfBirth: '2001-04-12',
      age: 23,
      gender: 'Male',
      bloodType: 'O-',
      address: 'Shangani District, Mogadishu',
      emergencyContact: 'Khadija Ali - +252 61 111 0000',
      medicalConditions: ['None'],
      allergies: ['None'],
      medications: ['None'],
      totalRequests: 1,
      lastRequest: '2024-03-10',
      assignedAmbulance: 'AMB-004',
      lastHospital: 'Medina Hospital',
      insuranceProvider: 'Student Insurance',
      insuranceNumber: 'SI-901234'
    }
  ]

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient)
    setShowDetails(true)
  }

  const handleLinkToRequest = (patientId: string) => {
    console.log('Link patient to request:', patientId)
  }

  const handleViewMedicalHistory = (patientId: string) => {
    console.log('View medical history for patient:', patientId)
  }

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient record?')) {
      console.log('Delete patient:', patientId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients Management</h1>
            <p className="text-gray-600 mt-2">Store and manage patient details related to emergency cases</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              Export
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Register Patient
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">892</p>
              <p className="text-sm text-green-600 mt-2">+45 this month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
              <p className="text-sm text-blue-600 mt-2">Currently in treatment</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Repeat Patients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
              <p className="text-sm text-yellow-600 mt-2">17.5% return rate</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With Insurance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">623</p>
              <p className="text-sm text-green-600 mt-2">69.8% coverage</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-purple-600" />
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
                  placeholder="Search by name, phone, email, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Ages</option>
                  <option value="0-18">0-18</option>
                  <option value="19-35">19-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51+">51+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">All Blood Types</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          Showing <span className="font-semibold">{filteredPatients.length}</span> of{' '}
          <span className="font-semibold">{patients.length}</span> patients
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emergency History
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{patient.id}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {patient.age} years, {patient.gender}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Mail className="w-3 h-3 mr-1" />
                        {patient.email}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {patient.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">Blood: {patient.bloodType}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Conditions: {patient.medicalConditions.length > 0 ? patient.medicalConditions.join(', ') : 'None'}
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        Allergies: {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Total: {patient.totalRequests}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last: {patient.lastRequest}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Ambulance: {patient.assignedAmbulance}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Hospital: {patient.lastHospital}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Insurance: {patient.insuranceProvider}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(patient)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLinkToRequest(patient.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewMedicalHistory(patient.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-red-600 hover:text-red-700"
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
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
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
                    <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Patient ID</p>
                    <p className="font-medium">{selectedPatient.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{selectedPatient.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium">{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Type</p>
                    <p className="font-medium">{selectedPatient.bloodType}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedPatient.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <p className="font-medium">{selectedPatient.emergencyContact}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Medical Conditions</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient.medicalConditions.map((condition: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Allergies</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient.allergies.map((allergy: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Medications</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient.medications.map((medication: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency History</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Emergency Requests</p>
                    <p className="font-medium">{selectedPatient.totalRequests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Emergency Request</p>
                    <p className="font-medium">{selectedPatient.lastRequest}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Assigned Ambulance</p>
                    <p className="font-medium">{selectedPatient.assignedAmbulance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Hospital</p>
                    <p className="font-medium">{selectedPatient.lastHospital}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Insurance Provider</p>
                  <p className="font-medium">{selectedPatient.insuranceProvider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Insurance Number</p>
                  <p className="font-medium">{selectedPatient.insuranceNumber}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button className="bg-red-600 hover:bg-red-700">
                Link to Request
              </Button>
              <Button variant="outline">
                View Medical History
              </Button>
              <Button variant="outline">
                Edit Profile
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
