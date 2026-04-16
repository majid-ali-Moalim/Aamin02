'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, ArrowRight, Save, Loader2,
  CheckCircle2, Info, UserPlus, ChevronRight,
  User, Stethoscope, Shield, Phone, Upload, FileText,
  GraduationCap, Award, Camera, Briefcase,
  Activity, Users, Key, Bell, Smartphone, CreditCard
} from 'lucide-react'
import { employeesService, systemSetupService, nursesService, ambulancesService } from '@/lib/api'
import { Station, Department, EmployeeRole } from '@/types'

const STEPS = [
  { id: 1, title: 'Profile & Personal',    description: 'Personal information' },
  { id: 2, title: 'Emergency Contact',     description: 'Emergency details' },
  { id: 3, title: 'Employment Info',       description: 'Job details' },
  { id: 4, title: 'Professional Info',     description: 'Medical credentials' },
  { id: 5, title: 'Operational Status',    description: 'Dispatch status' },
  { id: 6, title: 'Ambulance Assignment',  description: 'Vehicle assignment' },
  { id: 7, title: 'System Account',        description: 'Login access' },
]

export default function AddNursePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Master Data
  const [regions, setRegions] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [ambulances, setAmbulances] = useState<any[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<EmployeeRole[]>([])

  // Form State
  const [formData, setFormData] = useState({
    // Section A: Profile & Identity
    profilePhoto: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'FEMALE',
    dateOfBirth: '',
    phoneNumber: '',
    alternativePhoneNumber: '',
    emailAddress: '',
    nationalIdNumber: '',
    residentialAddress: '',
    regionId: '',
    districtId: '',
    currentArea: '',

    // Section B: Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',

    // Section C: Employment Information
    employeeCode: `NUR-${Math.floor(1000 + Math.random() * 9000)}`,
    employeeRole: 'Nurse',
    department: '',
    departmentId: '',     // backend ID
    roleId: '',           // backend ID
    employmentType: 'FULL_TIME',
    joinDate: '',
    employmentStatus: 'ACTIVE',
    stationId: '',

    // Section D: Professional Information
    qualificationLevel: 'BSc Nursing',
    specialization: 'Emergency',
    yearsOfExperience: '2',
    certificationType: 'Basic Life Support',
    licenseExpiryDate: '',
    emergencyCareTrained: true,

    // Section E: Operational Status
    shiftStatus: 'AVAILABLE',
    availabilityStatus: 'AVAILABLE',
    readinessStatus: 'READY',

    // Section F: Ambulance Assignment
    assignAmbulanceNow: false,
    assignedAmbulance: '',

    createSystemAccount: true,
    username: '',
    loginEmail: '',
    temporaryPassword: '',
    accountStatus: 'ACTIVE',
    mobileAppAccess: true,
    notificationAccess: true,

    // Section H: Uploads & Notes
    uploadCertificates: '',
    remarksNotes: '',
  })

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      setIsLoading(true)
      const [s, d, r, reg, amb] = await Promise.all([
        systemSetupService.getStations(),
        systemSetupService.getDepartments(),
        systemSetupService.getRoles(),
        systemSetupService.getRegions(),
        ambulancesService.getAll()
      ])
      setStations(s)
      setDepartments(d)
      setRoles(r)
      setRegions(reg)
      setAmbulances(amb)

      // Auto-select defaults
      const nurseRole   = r.find((role: EmployeeRole) => role.name?.toLowerCase().includes('nurse'))
      const clinicalDept = d.find((dept: Department) =>
        dept.name?.toLowerCase().includes('clinical') || dept.name?.toLowerCase().includes('medical')
      )
      setFormData(prev => ({
        ...prev,
        roleId:       nurseRole?.id    || '',
        departmentId: clinicalDept?.id || '',
        department:   clinicalDept?.id || '',
      }))
    } catch (err) {
      console.error('Failed to fetch master data:', err)
      toast.error('Connection failed — check backend')
    } finally {
      setIsLoading(false)
    }
  }

  // Cascading Logic
  const handleRegionChange = async (regId: string) => {
    setFormData(prev => ({ ...prev, regionId: regId, districtId: '', stationId: '' }))
    if (!regId) return
    const dists = await systemSetupService.getDistricts(regId)
    setDistricts(dists)
  }

  const handleDistrictChange = async (distId: string) => {
    setFormData(prev => ({ ...prev, districtId: distId, stationId: '' }))
    if (!distId) return
    const stns = await systemSetupService.getStations(distId)
    setStations(stns)
  }

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('File size must be less than 2MB'); return }
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, profilePhoto: event.target?.result as string }))
      toast.success('Photo uploaded')
    }
    reader.readAsDataURL(file)
  }

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be less than 5MB'); return }
    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, uploadCertificates: event.target?.result as string }))
      toast.success('Certificate uploaded')
    }
    reader.readAsDataURL(file)
  }

  const fillDemoData = () => {
    const ts = Date.now().toString().slice(-4)
    setFormData(prev => ({
      ...prev,
      firstName: 'Amina',
      middleName: 'Abdullahi',
      lastName: 'Ali',
      emailAddress: `amina.nurse.${ts}@aamin.so`,
      phoneNumber: `617${ts}888`,
      alternativePhoneNumber: `618${ts}777`,
      username: `amina.nurse.${ts}`,
      loginEmail: `amina.nurse.${ts}@aamin.so`,
      temporaryPassword: 'Password123!',
      employeeCode: `NUR-${ts}`,
      gender: 'FEMALE',
      dateOfBirth: '1995-03-24',
      nationalIdNumber: `NID-${ts}`,
      emergencyContactName: 'Omar Ali',
      emergencyContactPhone: `618${ts}999`,
      emergencyContactRelationship: 'Brother',
      residentialAddress: 'Bakara Market, Mogadishu',
      region: 'Banadir',
      district: 'Hamar Weyne',
      currentArea: 'Bakara',
      licenseExpiryDate: '2027-12-31',
      yearsOfExperience: '5',
      qualificationLevel: 'BSc Nursing',
      specialization: 'ICU',
      remarksNotes: 'Certified in Advanced Trauma Life Support (ATLS).',
    }))
    toast.success('Populated with demo nurse data')
  }

  const handleNext = () => { if (currentStep < 7) setCurrentStep(currentStep + 1) }
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1) }

  const handleSubmit = async () => {
    // Validate required account fields
    if (formData.createSystemAccount) {
      if (!formData.username || !formData.temporaryPassword) {
        toast.error('Username and password are required')
        return
      }
      const email = formData.loginEmail || formData.emailAddress
      if (!email) {
        toast.error('Login email is required')
        return
      }
    }
    if (!formData.firstName || !formData.lastName) {
      toast.error('First and last name are required')
      return
    }

    try {
      setIsSubmitting(true)

      // Build payload mapped to employeesService.create() contract
      const payload = {
        // Auth / User record
        username:  formData.username,
        email:     formData.loginEmail || formData.emailAddress,
        password:  formData.temporaryPassword,
        role:      'EMPLOYEE' as const,

        // Personal
        firstName:    formData.firstName,
        lastName:     formData.lastName,
        phone:        formData.phoneNumber,
        alternatePhone: formData.alternativePhoneNumber,
        gender:       formData.gender,
        dateOfBirth:  formData.dateOfBirth  || undefined,
        nationalId:   formData.nationalIdNumber || undefined,
        profilePhoto: formData.profilePhoto   || undefined,
        address:      formData.residentialAddress,

        // Emergency contact
        emergencyContactName: formData.emergencyContactName,
        emergencyPhone:       formData.emergencyContactPhone,
        relationship:         formData.emergencyContactRelationship,

        // Employment
        employeeCode:   formData.employeeCode,
        employeeRoleId: formData.roleId       || undefined,
        departmentId:   formData.departmentId || formData.department || undefined,
        stationId:      formData.assignedStation || undefined,
        employmentDate: formData.joinDate     || undefined,
        status:         formData.employmentStatus,
        shiftStatus:    formData.shiftStatus,
        defaultShift:   formData.shiftStatus,

        // Nurse / Professional
        licenseExpiryDate: formData.licenseExpiryDate || undefined,
        qualification:   formData.qualificationLevel,
        specialization:  formData.specialization,
        yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined,
        medicalClearanceStatus: 'CLEARED',

        // Ambulance
        assignedAmbulanceId: formData.assignAmbulanceNow && formData.assignedAmbulance
          ? formData.assignedAmbulance
          : undefined,

        // Misc
        workDays: 'Mon,Tue,Wed,Thu,Fri',
      }

      await employeesService.create(payload)
      toast.success('Nurse registered successfully!')
      router.push('/admin/nurses')
    } catch (err: any) {
      console.error('Submission failed:', err)
      toast.error(err.response?.data?.message || 'Failed to register nurse.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Shared input/select class ────────────────────────────────────────────
  const inputCls = 'w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all'

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-32 pt-2">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 px-8">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] mb-4 ml-0.5">
            <span>Nurses</span>
            <ChevronRight className="w-3 h-3 stroke-[3]" />
            <span className="text-gray-900">Comprehensive Registration</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Complete Nurse Registration</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-gray-400 text-xs font-semibold tracking-tight">Register a medical professional with comprehensive credentials</p>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest underline decoration-2 decoration-blue-200 underline-offset-4">
              Step {currentStep} of 7: {STEPS[currentStep - 1].title}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-2 border-blue-50 text-blue-600 hover:bg-blue-50 rounded-xl" onClick={fillDemoData}>
            Demo Data
          </Button>
          <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 flex items-center gap-2 border border-gray-100 px-4 py-2 rounded-xl" onClick={() => router.push('/admin/nurses')}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-2xl shadow-lg shadow-gray-200/30 mx-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-xs font-black transition-all
                ${currentStep >= step.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-100 text-gray-400'}`}>
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 transition-all ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 px-1">
          {STEPS.map((step) => (
            <div key={step.id} className="flex-1 text-center">
              <p className={`text-[9px] font-black uppercase tracking-widest transition-all
                ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-300'}`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 space-y-12">
        <div className="max-w-5xl mx-auto">

          {/* ── Step 1: Profile & Personal ── */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Profile & Personal Information</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Basic identity and contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Profile Photo */}
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {formData.profilePhoto
                          ? <img src={formData.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                          : <Camera className="w-6 h-6 text-gray-400" />
                        }
                      </div>
                      <div>
                        <input type="file" id="profile-photo-upload" accept="image/*" className="hidden" onChange={handleProfilePhotoUpload} />
                        <Button variant="outline" className="h-9 px-4 text-xs font-black uppercase tracking-widest"
                          onClick={() => document.getElementById('profile-photo-upload')?.click()}>
                          <Upload className="w-4 h-4 mr-2" />Upload Photo
                        </Button>
                        <p className="text-[10px] text-gray-400 mt-1">JPG/PNG, max 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">First Name *</label>
                    <input type="text" className={inputCls} value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="Enter first name" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Middle Name</label>
                    <input type="text" className={inputCls} value={formData.middleName}
                      onChange={(e) => setFormData({...formData, middleName: e.target.value})} placeholder="Enter middle name" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Last Name *</label>
                    <input type="text" className={inputCls} value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Enter last name" />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Gender *</label>
                    <select className={inputCls} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Date of Birth *</label>
                    <input type="date" className={inputCls} value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">National ID Number *</label>
                    <input type="text" className={inputCls} value={formData.nationalIdNumber}
                      onChange={(e) => setFormData({...formData, nationalIdNumber: e.target.value})} placeholder="Enter national ID" />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Phone Number *</label>
                    <input type="tel" className={inputCls} value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Alternative Phone</label>
                    <input type="tel" className={inputCls} value={formData.alternativePhoneNumber}
                      onChange={(e) => setFormData({...formData, alternativePhoneNumber: e.target.value})} placeholder="Alternative phone" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Email Address *</label>
                    <input type="email" className={inputCls} value={formData.emailAddress}
                      onChange={(e) => setFormData({...formData, emailAddress: e.target.value})} placeholder="Enter email address" />
                  </div>

                  <div className="lg:col-span-3">
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Residential Address *</label>
                    <input type="text" className={inputCls} value={formData.residentialAddress}
                      onChange={(e) => setFormData({...formData, residentialAddress: e.target.value})} placeholder="Enter residential address" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Region</label>
                    <select className={inputCls} value={formData.regionId} onChange={(e) => handleRegionChange(e.target.value)}>
                      <option value="">Select region</option>
                      {regions.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">District</label>
                    <select className={inputCls} value={formData.districtId} onChange={(e) => handleDistrictChange(e.target.value)} disabled={!formData.regionId}>
                      <option value="">Select district</option>
                      {districts.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Current Area / Sub-area</label>
                    <input type="text" className={inputCls} value={formData.currentArea}
                      onChange={(e) => setFormData({...formData, currentArea: e.target.value})} placeholder="Enter current area" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Emergency Contact ── */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                  <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Emergency Contact Information</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Person to contact in case of emergency</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Contact Name *</label>
                    <input type="text" className={inputCls} value={formData.emergencyContactName}
                      onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})} placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Contact Phone *</label>
                    <input type="tel" className={inputCls} value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})} placeholder="Phone number" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Relationship *</label>
                    <select className={inputCls} value={formData.emergencyContactRelationship}
                      onChange={(e) => setFormData({...formData, emergencyContactRelationship: e.target.value})}>
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Relative">Relative</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Employment Information ── */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                  <div className="p-2.5 rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/30">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Employment Information</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Job details and employment status</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Employee Code</label>
                    <input type="text" className={inputCls} value={formData.employeeCode}
                      onChange={(e) => setFormData({...formData, employeeCode: e.target.value})} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Employee Role</label>
                    <div className="w-full h-11 bg-gray-100 border border-gray-200 rounded-xl px-4 flex items-center text-sm font-bold text-gray-400">
                      Nurse (Fixed)
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Department</label>
                    <select className={inputCls} value={formData.departmentId}
                      onChange={(e) => setFormData({...formData, departmentId: e.target.value, department: e.target.value})}>
                      <option value="">Select department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Employment Type</label>
                    <select className={inputCls} value={formData.employmentType}
                      onChange={(e) => setFormData({...formData, employmentType: e.target.value})}>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="TEMPORARY">Temporary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Join Date *</label>
                    <input type="date" className={inputCls} value={formData.joinDate}
                      onChange={(e) => setFormData({...formData, joinDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Employment Status</label>
                    <select className={inputCls} value={formData.employmentStatus}
                      onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}>
                      <option value="ACTIVE">Active</option>
                      <option value="ON_LEAVE">On Leave</option>
                      <option value="SUSPENDED">Suspended</option>
                      <option value="TERMINATED">Terminated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Assigned Station / Base</label>
                    <select className={inputCls} value={formData.stationId}
                      onChange={(e) => setFormData({...formData, stationId: e.target.value})}>
                      <option value="">Select station</option>
                      {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Professional Information ── */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                  <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Professional Information</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Medical qualifications and credentials</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Qualification Level</label>
                    <select className={inputCls} value={formData.qualificationLevel}
                      onChange={(e) => setFormData({...formData, qualificationLevel: e.target.value})}>
                      <option value="Diploma Nursing">Diploma Nursing</option>
                      <option value="BSc Nursing">BSc Nursing</option>
                      <option value="MSc Nursing">MSc Nursing</option>
                      <option value="PhD Nursing">PhD Nursing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Specialization</label>
                    <select className={inputCls} value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}>
                      <option value="Emergency">Emergency</option>
                      <option value="ICU">ICU</option>
                      <option value="Trauma">Trauma</option>
                      <option value="General">General</option>
                      <option value="Pediatric">Pediatric</option>
                      <option value="Surgical">Surgical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Years of Experience</label>
                    <input type="number" className={inputCls} value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})} min="0" max="50" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Certification Type</label>
                    <select className={inputCls} value={formData.certificationType}
                      onChange={(e) => setFormData({...formData, certificationType: e.target.value})}>
                      <option value="Basic Life Support">Basic Life Support</option>
                      <option value="Advanced Cardiac Life Support">Advanced Cardiac Life Support</option>
                      <option value="Pediatric Advanced Life Support">Pediatric Advanced Life Support</option>
                      <option value="Trauma Nursing">Trauma Nursing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">License Expiry Date *</label>
                    <input type="date" className={inputCls} value={formData.licenseExpiryDate}
                      onChange={(e) => setFormData({...formData, licenseExpiryDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Emergency Care Trained</label>
                    <div className="flex items-center gap-3 h-11">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.emergencyCareTrained}
                        onChange={(e) => setFormData({...formData, emergencyCareTrained: e.target.checked})} />
                      <label className="text-sm font-bold text-gray-700">Certified in emergency care</label>
                    </div>
                  </div>
                </div>

                {/* Certificates Upload & Notes integrated into Professional Info */}
                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">Professional Certificates</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 transition-all bg-gray-50/50 cursor-pointer group"
                      onClick={() => document.getElementById('cert-upload')?.click()}>
                      <input type="file" id="cert-upload" className="hidden" onChange={handleCertificateUpload} />
                      {formData.uploadCertificates ? (
                        <div className="flex flex-col items-center gap-2">
                           <CheckCircle2 className="w-8 h-8 text-green-500" />
                           <p className="text-sm font-bold text-gray-900">Certificate Attached</p>
                           <button className="text-[10px] text-red-500 font-black uppercase hover:underline" 
                             onClick={(e) => { e.stopPropagation(); setFormData({...formData, uploadCertificates: ''}) }}>Remove</button>
                        </div>
                      ) : (
                        <>
                          <Award className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                          <p className="text-sm font-bold text-gray-700">Click to upload certificates</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">Professional Remarks / Notes</label>
                    <textarea
                      className="w-full h-[120px] bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all resize-none"
                      value={formData.remarksNotes}
                      onChange={(e) => setFormData({...formData, remarksNotes: e.target.value})}
                      placeholder="Enter any medical qualifications or experience notes..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Operational Status ── */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                  <div className="p-2.5 rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Operational Status</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Current work and availability status</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Shift Status</label>
                    <select className={inputCls} value={formData.shiftStatus}
                      onChange={(e) => setFormData({...formData, shiftStatus: e.target.value})}>
                      <option value="AVAILABLE">Available</option>
                      <option value="ON_DUTY">On Duty</option>
                      <option value="ON_BREAK">On Break</option>
                      <option value="OFF_DUTY">Off Duty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Availability Status</label>
                    <select className={inputCls} value={formData.availabilityStatus}
                      onChange={(e) => setFormData({...formData, availabilityStatus: e.target.value})}>
                      <option value="AVAILABLE">Available</option>
                      <option value="BUSY">Busy</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                      <option value="ON_LEAVE">On Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Readiness Status</label>
                    <select className={inputCls} value={formData.readinessStatus}
                      onChange={(e) => setFormData({...formData, readinessStatus: e.target.value})}>
                      <option value="READY">Ready</option>
                      <option value="NOT_READY">Not Ready</option>
                      <option value="STANDBY">Standby</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6: Ambulance Assignment ── */}
          {currentStep === 6 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                  <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/30">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Ambulance Assignment</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Vehicle assignment and deployment</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Assign Ambulance Now</label>
                    <div className="flex items-center gap-3 h-11">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.assignAmbulanceNow}
                        onChange={(e) => setFormData({...formData, assignAmbulanceNow: e.target.checked})} />
                      <label className="text-sm font-bold text-gray-700">Assign vehicle immediately</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Assigned Ambulance</label>
                    <select className={inputCls} value={formData.assignedAmbulance}
                      onChange={(e) => setFormData({...formData, assignedAmbulance: e.target.value})}
                      disabled={!formData.assignAmbulanceNow}>
                      <option value="">Select available ambulance</option>
                      {ambulances.map((a: any) => <option key={a.id} value={a.id}>{a.ambulanceNumber} ({a.type})</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* ── Step 7: System Account Access ── */}
          {currentStep === 7 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                  <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/30">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">System Account Access</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Login credentials and system access</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Toggle create account */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.createSystemAccount}
                        onChange={(e) => setFormData({...formData, createSystemAccount: e.target.checked})} />
                      <div>
                        <label className="text-sm font-bold text-gray-700">Create System Account</label>
                        <p className="text-xs text-gray-500">Generate login credentials for this nurse</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Username *</label>
                    <input type="text" className={inputCls} value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder={formData.createSystemAccount ? 'Enter username' : 'Account not created'}
                      disabled={!formData.createSystemAccount} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Login Email *</label>
                    <input type="email" className={inputCls} value={formData.loginEmail}
                      onChange={(e) => setFormData({...formData, loginEmail: e.target.value})}
                      placeholder={formData.createSystemAccount ? 'Login email address' : 'Account not created'}
                      disabled={!formData.createSystemAccount} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Temporary Password *</label>
                    <input type="password" className={inputCls} value={formData.temporaryPassword}
                      onChange={(e) => setFormData({...formData, temporaryPassword: e.target.value})}
                      placeholder={formData.createSystemAccount ? 'Temporary password' : 'Account not created'}
                      disabled={!formData.createSystemAccount} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Account Status</label>
                    <select className={inputCls} value={formData.accountStatus}
                      onChange={(e) => setFormData({...formData, accountStatus: e.target.value})}
                      disabled={!formData.createSystemAccount}>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Mobile App Access</label>
                    <div className="flex items-center gap-3 h-11">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.mobileAppAccess}
                        onChange={(e) => setFormData({...formData, mobileAppAccess: e.target.checked})}
                        disabled={!formData.createSystemAccount} />
                      <label className="text-sm font-bold text-gray-700">Allow mobile app login</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Notification Access</label>
                    <div className="flex items-center gap-3 h-11">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.notificationAccess}
                        onChange={(e) => setFormData({...formData, notificationAccess: e.target.checked})}
                        disabled={!formData.createSystemAccount} />
                      <label className="text-sm font-bold text-gray-700">Receive system notifications</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}



        </div>

        {/* ─── Navigation Buttons ─── */}
        <div className="flex items-center justify-between pt-10 border-t border-gray-100/30 max-w-5xl mx-auto">
          {currentStep === 1 ? (
            <Button variant="ghost" className="h-12 px-10 rounded-xl bg-white border border-gray-100 font-black text-[11px] text-gray-400 uppercase"
              onClick={() => router.back()}>
              Cancel
            </Button>
          ) : (
            <Button variant="ghost" className="h-12 px-10 rounded-xl bg-gray-50 border border-gray-200 font-black text-[11px] text-gray-500 uppercase flex items-center group shadow-sm"
              onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </Button>
          )}

          <Button
            className={`h-12 rounded-xl font-black tracking-[0.2em] uppercase text-[11px] flex items-center transition-all group shadow-xl
              ${currentStep === 7
                ? 'px-14 bg-green-600 hover:bg-green-700'
                : 'px-12 bg-blue-600 hover:bg-blue-700'
              }`}
            onClick={currentStep === 7 ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
              : currentStep === 7
                ? <><Save className="w-4 h-4 mr-2" />Complete Registration</>
                : <>Next Section <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
            }
          </Button>
        </div>
      </div>
    </div>
  )
}
