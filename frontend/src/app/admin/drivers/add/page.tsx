'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeft, Save, X, Loader2,
  CheckCircle2, AlertCircle, Info, UserPlus, ChevronRight,
  User, Truck, Shield, Clock, Phone, MapPin, Activity,
  Siren, HeartPulse, Landmark, Medal, GraduationCap,
  FileText, Briefcase, Lock, Database, UserCheck, Radio,
  LogOut, LayoutGrid, Calendar, ClipboardList, ShieldCheck,
  CreditCard, Mail
} from 'lucide-react'
import { 
  driversService, 
  systemSetupService,  
  ambulancesService,
  uploadService,
  employeesService
} from '@/lib/api'
import { 
  Station, 
  Ambulance, 
  Department, 
  EmployeeRole, 
  Region, 
  District 
} from '@/types'
import { 
  SectionHeader, 
  TacticalBadge, 
  FormInput, 
  FormSelect, 
  FormCheckbox,
  FileUploadCard
} from '@/components/drivers/DriverFormSections'

export default function StructuredAddDriverPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  
  // Master Data
  const [regions, setRegions] = useState<Region[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [ambulances, setAmbulances] = useState<Ambulance[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<EmployeeRole[]>([])
  const [nextDriverId, setNextDriverId] = useState('001')

  // Form State
  const [formData, setFormData] = useState({
    // 1. Driver ID
    driverId: '001',
    // 2. Personal Information
    profilePhoto: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    alternatePhone: '',
    email: '',
    nationalId: '',
    // 3. Address & Location
    address: '',
    regionId: '',
    districtId: '',
    stationId: '',
    // 4. Emergency Contact
    emergencyContactName: '',
    emergencyPhone: '',
    relationship: '',
    // 5. Employment Information
    employeeCode: '',
    employeeRoleId: '',
    departmentId: '',
    employmentType: 'Full-time',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    // 6. Dispatch & Operational Status
    shiftStatus: 'Off Duty',
    availabilityStatus: 'Available',
    assignedAmbulanceId: '',
    // 7. License & Professional Info
    licenseNumber: '',
    licenseClass: 'B',
    licenseExpiryDate: '',
    yearsOfExperience: '',
    emergencyDrivingTraining: false,
    // 8. Skills & Certifications
    firstAidCertified: false,
    advancedLifeSupport: false,
    certificationsUrl: '',
    // 9. Account Access
    username: '',
    password: '',
    confirmPassword: '',
    role: 'DRIVER',
    accountStatus: 'Active',
    // 10. Additional Info
    notes: ''
  })

  // ScrollSpy / Sidebar Navigation
  const [activeSection, setActiveSection] = useState('personal')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    fetchMasterData()
    generateDriverId()
    
    // Setup Intersection Observer for ScrollSpy
    const sections = document.querySelectorAll('section[id]')
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, { rootMargin: '-20% 0px -70% 0px' })

    sections.forEach(section => observerRef.current?.observe(section))
    
    return () => observerRef.current?.disconnect()
  }, [])

  const generateDriverId = async () => {
    try {
      const stats = await driversService.getStats()
      const nextId = (stats.total + 1).toString().padStart(3, '0')
      setNextDriverId(nextId)
      setFormData(prev => ({ ...prev, driverId: nextId }))
    } catch (err) {
      console.error("Failed to generate driver ID", err)
    }
  }

  const fetchMasterData = async () => {
    try {
      setIsLoading(true)
      const [regs, depts, rls, ambs] = await Promise.all([
        systemSetupService.getRegions(),
        systemSetupService.getDepartments(),
        systemSetupService.getRoles(),
        ambulancesService.getAll()
      ])
      setRegions(regs)
      setDepartments(depts)
      setRoles(rls)
      setAmbulances(ambs.filter(a => a.status === 'AVAILABLE'))

      // Auto-set roles & departments
      const driverRole = rls.find((r: any) => r.name === 'Driver')
      const opsDept = depts.find((d: any) => d.name === 'Operations' || d.name === 'Field Operations')
      setFormData(prev => ({
        ...prev,
        employeeRoleId: driverRole?.id || '',
        departmentId: opsDept?.id || ''
      }))
    } catch (err) {
      toast.error("Failed to load setup data")
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingPhoto(true)
      const res: any = await uploadService.uploadFile(file)
      setFormData(prev => ({ ...prev, profilePhoto: res.url }))
      toast.success("Profile photo uploaded")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to upload photo")
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!formData.username || !formData.password || !formData.email) {
      toast.error("Missing required account credentials (Email, Username, or Password)")
      return
    }

    try {
      setIsSubmitting(true)
      
      // Map frontend formData to backend payload
      const payload = {
        ...formData,
        role: 'EMPLOYEE', // System access role
        // Backend expects certain fields at top level
        email: formData.email,
        username: formData.username,
        password: formData.password,
      }

      await employeesService.create(payload)
      toast.success("Driver registered successfully")
      router.push('/admin/drivers')
    } catch (err: any) {
      console.error("Registration Error:", err)
      toast.error(err.response?.data?.message || "Registration failed. Check network or duplicate data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const SECTIONS = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'location', label: 'Address & Location', icon: MapPin },
    { id: 'emergency', label: 'Emergency Contact', icon: Phone },
    { id: 'employment', label: 'Employment Info', icon: Briefcase },
    { id: 'operational', label: 'Operational Status', icon: Siren },
    { id: 'license', label: 'License & Professional', icon: Shield },
    { id: 'skills', label: 'Skills & Certs', icon: GraduationCap },
    { id: 'account', label: 'Account Access', icon: Lock },
    { id: 'additional', label: 'Additional Notes', icon: AlertCircle },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col overflow-hidden">
      
      {/* Immersive Header */}
      <header className="h-20 bg-[#0F1C2E] border-b border-white/5 flex items-center justify-between px-8 shrink-0 shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="group p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-600 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white group-hover:-translate-x-1 transition-all" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-0.5">
              <span>Driver Management</span>
              <ChevronRight className="w-3 h-3 opacity-20" />
              <span className="text-red-500">Intake Protocol</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">New Driver Deployment</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-6 text-right hidden sm:block">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Target ID</p>
            <p className="text-lg font-black text-white tracking-widest italic">DR-{nextDriverId}</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-3 px-8 h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            Confirm Registration
          </button>
        </div>
      </header>

      {/* Main Immersive Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Table of Contents */}
        <aside className="w-80 bg-white border-r border-gray-100 hidden lg:flex flex-col p-8 overflow-y-auto">
          <div className="mb-8">
            <div className="flex flex-col items-center p-6 bg-slate-50 rounded-[2rem] border border-gray-100 relative group">
              <label className="w-24 h-24 rounded-3xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center mb-4 transition-all hover:border-red-500 overflow-hidden relative cursor-pointer">
                {isUploadingPhoto ? (
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                ) : formData.profilePhoto ? (
                  <img src={`http://localhost:3001${formData.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserPlus className="w-10 h-10 text-gray-200 group-hover:text-red-500 transition-colors" />
                )}
                {!isUploadingPhoto && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 opacity-0 hover:opacity-100 transition-opacity flex justify-center">
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Update Photo</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
              </label>
              <div className="text-center">
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                  {formData.firstName || "New"} {formData.lastName || "Driver"}
                </p>
                <TacticalBadge label={`DR-${formData.driverId}`} color="red" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-4">Deployment Sections</p>
            {SECTIONS.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-[#0F1C2E] text-white shadow-xl shadow-slate-200' 
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'group-hover:text-red-500'} transition-colors`} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-left">{section.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />}
                </button>
              )
            })}
          </div>

          <div className="mt-auto pt-10">
             <div className="p-5 rounded-2xl bg-slate-50 border border-gray-100 text-[10px] text-gray-500 font-bold leading-relaxed tracking-tight italic">
               Complete all mandatory fields marked with a red marker to finalize driver authentication and mission readiness protocol.
             </div>
          </div>
        </aside>

        {/* Scrollable Form Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-32">
            
            {/* START STRUCTURED FORM PODS */}

            <section id="personal" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={User} title="Profile & Personal Information" subtitle="Full legal bio-data capture" />

                {/* Profile Photo Preview (upload stays in sidebar) */}
                <div className="flex items-center gap-6 mb-10 p-5 bg-slate-50 rounded-3xl border border-gray-100">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0">
                    {isUploadingPhoto ? (
                      <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                    ) : formData.profilePhoto ? (
                      <img src={`http://localhost:3001${formData.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-200" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-widest">
                      {formData.firstName || 'First'} {formData.lastName || 'Last'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      {formData.profilePhoto ? '✓ Profile photo uploaded via sidebar' : 'Upload profile photo from the sidebar panel →'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormInput label="First Name" required icon={User} value={formData.firstName} onChange={(e: any) => setFormData({...formData, firstName: e.target.value})} />
                  <FormInput label="Middle Name" icon={User} value={formData.middleName} onChange={(e: any) => setFormData({...formData, middleName: e.target.value})} />
                  <FormInput label="Last Name" required icon={User} value={formData.lastName} onChange={(e: any) => setFormData({...formData, lastName: e.target.value})} />
                  <FormSelect label="Gender" required icon={User} options={[{id: 'MALE', label: 'Male'}, {id: 'FEMALE', label: 'Female'}]} value={formData.gender} onChange={(e: any) => setFormData({...formData, gender: e.target.value})} />
                  <FormInput label="Date of Birth" required type="date" value={formData.dateOfBirth} onChange={(e: any) => setFormData({...formData, dateOfBirth: e.target.value})} />
                  <FormInput label="National ID Number" required icon={CreditCard} value={formData.nationalId} onChange={(e: any) => setFormData({...formData, nationalId: e.target.value})} />
                  <FormInput label="Phone Number" required prefix="+252" icon={Phone} value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} />
                  <FormInput label="Alternative Phone" prefix="+252" icon={Phone} value={formData.alternatePhone} onChange={(e: any) => setFormData({...formData, alternatePhone: e.target.value})} />
                </div>
              </div>
            </section>

            {/* 3. Address & Location */}
            <section id="location" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={MapPin} title="Address & Location" subtitle="Geographic assignment matrix" color="blue" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <FormInput label="Residential Address" required icon={MapPin} value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <FormSelect label="Region" required icon={Landmark} options={regions} value={formData.regionId} onChange={(e: any) => handleRegionChange(e.target.value)} />
                  <FormSelect label="District" required icon={MapPin} options={districts} value={formData.districtId} onChange={(e: any) => handleDistrictChange(e.target.value)} />

                  <FormSelect label="Assigned Station / Base" required icon={Landmark} options={stations} value={formData.stationId} onChange={(e: any) => setFormData({...formData, stationId: e.target.value})} />
                </div>
              </div>
            </section>

            {/* 4. Emergency Contact */}
            <section id="emergency" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={Phone} title="Emergency Contact" subtitle="Kin / Immediate response contact" color="amber" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormInput label="Contact Name" required icon={User} value={formData.emergencyContactName} onChange={(e: any) => setFormData({...formData, emergencyContactName: e.target.value})} />
                  <FormInput label="Relationship" required icon={Activity} value={formData.relationship} onChange={(e: any) => setFormData({...formData, relationship: e.target.value})} />
                  <FormInput label="Contact Phone" required prefix="+252" icon={Phone} value={formData.emergencyPhone} onChange={(e: any) => setFormData({...formData, emergencyPhone: e.target.value})} />
                </div>
              </div>
            </section>

            {/* 5. Employment Information */}
            <section id="employment" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={Briefcase} title="Employment Information" subtitle="Organizational status & payroll binding" color="slate" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FormInput label="Employee Code" required icon={Database} placeholder="EMP-XXXX" value={formData.employeeCode} onChange={(e: any) => setFormData({...formData, employeeCode: e.target.value})} />
                  <FormSelect label="Department" required options={departments} value={formData.departmentId} onChange={(e: any) => setFormData({...formData, departmentId: e.target.value})} />
                  <FormSelect label="Employment Type" required options={[
                    {id: 'Full-time', label: 'Full-time'},
                    {id: 'Part-time', label: 'Part-time'},
                    {id: 'Contract', label: 'Contract'},
                    {id: 'Volunteer', label: 'Volunteer'}
                  ]} value={formData.employmentType} onChange={(e: any) => setFormData({...formData, employmentType: e.target.value})} />
                  <FormInput label="Join Date" required type="date" value={formData.joinDate} onChange={(e: any) => setFormData({...formData, joinDate: e.target.value})} />
                </div>
              </div>
            </section>

            {/* 6. Dispatch & Operational Status */}
            <section id="operational" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={Siren} title="Dispatch & Operational Status" subtitle="Live readiness configuration" color="red" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormSelect label="Shift Status" required icon={Clock} options={[
                    {id: 'On Duty', label: 'On Duty'},
                    {id: 'Off Duty', label: 'Off Duty'},
                    {id: 'On Leave', label: 'On Leave'}
                  ]} value={formData.shiftStatus} onChange={(e: any) => setFormData({...formData, shiftStatus: e.target.value})} />
                  <FormSelect label="Availability Status" required icon={UserCheck} options={[
                    {id: 'Available', label: 'Available'},
                    {id: 'Busy', label: 'Busy'},
                    {id: 'Not Available', label: 'Not Available'}
                  ]} value={formData.availabilityStatus} onChange={(e: any) => setFormData({...formData, availabilityStatus: e.target.value})} />
                  <FormSelect label="Assigned Ambulance" icon={Truck} options={ambulances} value={formData.assignedAmbulanceId} onChange={(e: any) => setFormData({...formData, assignedAmbulanceId: e.target.value})} />
                </div>
              </div>
            </section>

            {/* 7. License & Professional Info */}
            <section id="license" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={Shield} title="License & Professional Info" subtitle="Credential validation protocol" color="blue" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-2">
                    <FormInput label="Driving License Number" required icon={FileText} value={formData.licenseNumber} onChange={(e: any) => setFormData({...formData, licenseNumber: e.target.value})} />
                  </div>
                  <FormSelect label="License Class" required options={[
                    {id: 'B', label: 'Class B'},
                    {id: 'C', label: 'Class C'},
                    {id: 'D', label: 'Class D'}
                  ]} value={formData.licenseClass} onChange={(e: any) => setFormData({...formData, licenseClass: e.target.value})} />
                  <FormInput label="License Expiry" required type="date" value={formData.licenseExpiryDate} onChange={(e: any) => setFormData({...formData, licenseExpiryDate: e.target.value})} />
                  <FormInput label="Years of Experience" required type="number" icon={Activity} value={formData.yearsOfExperience} onChange={(e: any) => setFormData({...formData, yearsOfExperience: e.target.value})} />
                  <div className="lg:col-span-3">
                    <FormCheckbox label="Emergency Driving Training" description="Advanced tactical ambulance driving certification" checked={formData.emergencyDrivingTraining} onChange={(e: any) => setFormData({...formData, emergencyDrivingTraining: e.target.checked})} />
                  </div>
                </div>

                {/* Certificate Upload */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">License Certificate Document</p>
                  <FileUploadCard
                    label="License / Certificate Upload"
                    icon={Medal}
                    description="Upload driving license scan or professional certificate (PDF, JPG, PNG)"
                    value={formData.certificationsUrl}
                    onChange={(url: string) => setFormData({...formData, certificationsUrl: url})}
                  />
                </div>
              </div>
            </section>

            {/* 8. Skills & Certifications */}
            <section id="skills" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={GraduationCap} title="Skills & Certifications" subtitle="Clinical & tactical expertise" color="green" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <FormCheckbox label="First Aid Certified" description="Active basic life support (BLS) certification" checked={formData.firstAidCertified} onChange={(e: any) => setFormData({...formData, firstAidCertified: e.target.checked})} />
                      <FormCheckbox label="Advanced Life Support Training" description="Qualified for ALS/Paramedic protocol support" checked={formData.advancedLifeSupport} onChange={(e: any) => setFormData({...formData, advancedLifeSupport: e.target.checked})} />
                   </div>
                   <FileUploadCard label="Certification Portfolio" icon={Medal} description="Upload all professional certs" value={formData.certificationsUrl} onChange={(url: string) => setFormData({...formData, certificationsUrl: url})} />
                </div>
              </div>
            </section>

            {/* 9. Account Access */}
            <section id="account" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={Lock} title="Account Access" subtitle="System authentication credentials" color="slate" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FormInput label="Email Address" required icon={Mail} value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
                  <FormInput label="Username" required icon={User} value={formData.username} onChange={(e: any) => setFormData({...formData, username: e.target.value})} />
                  <FormInput label="Password" required type="password" icon={Lock} value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} />
                  <FormInput label="Confirm Password" required type="password" icon={Lock} value={formData.confirmPassword} onChange={(e: any) => setFormData({...formData, confirmPassword: e.target.value})} />
                  <FormSelect label="Account Status" required options={[
                    {id: 'Active', label: 'Active'},
                    {id: 'Disabled', label: 'Disabled'}
                  ]} value={formData.accountStatus} onChange={(e: any) => setFormData({...formData, accountStatus: e.target.value})} />
                  <div className="md:col-span-2 pt-6">
                     <TacticalBadge label="Role Lock: DRIVER" color="blue" icon={ShieldCheck} />
                  </div>
                </div>
              </div>
            </section>

            {/* 10. Additional Info */}
            <section id="additional" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                <SectionHeader icon={AlertCircle} title="Additional Information" subtitle="Supplementary mission notes" color="slate" />
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes / Remarks</label>
                  <textarea 
                    className="w-full h-40 p-6 bg-slate-50 border-none rounded-3xl text-sm font-bold text-gray-800 placeholder:text-gray-300 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                    placeholder="Enter any medical history, incident reports or specific driver attributes..."
                    value={formData.notes}
                    onChange={(e: any) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
