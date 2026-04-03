'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, ArrowRight, Save, X, Loader2,
  CheckCircle2, AlertCircle, Info, UserPlus, ChevronRight,
  User, Stethoscope, Shield, Clock, Phone,
  FileText, GraduationCap, MapPin, Award
} from 'lucide-react'
import { employeesService, systemSetupService } from '@/lib/api'
import { Station, Department, EmployeeRole } from '@/types'
import NursesStepper from '@/components/nurses/NursesStepper'
import { 
  PersonalInfoSection, 
  ContactEmergencySection, 
  ProfessionalSection, 
  AccountAccessSection,
  ShiftSection
} from '@/components/nurses/NurseFormSections'

const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Personal details' },
  { id: 2, title: 'Contact & Emergency', description: 'Contact information' },
  { id: 3, title: 'Medical Education', description: 'Qualifications' },
  { id: 4, title: 'System Access', description: 'Account security' },
  { id: 5, title: 'Work & Shift', description: 'Station assignment' },
  { id: 6, title: 'Review & Save', description: 'Confirm record' }
]

export default function AddNursePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Master Data
  const [stations, setStations] = useState<Station[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<EmployeeRole[]>([])

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'FEMALE',
    dateOfBirth: '',
    nationalId: '',
    profilePhoto: '',
    address: '',
    
    // Step 2: Contact
    alternatePhone: '',
    emergencyContactName: '',
    relationship: '',
    emergencyPhone: '',

    // Step 3: Medical
    qualification: 'BSc Nursing',
    specialization: 'Emergency',
    licenseNumber: '',
    licenseExpiryDate: '',
    yearsOfExperience: '2',
    certificationUpload: '',
    bloodGroup: '',
    medicalClearanceStatus: 'PENDING',

    // Step 4: Account
    username: '',
    password: '',
    roleId: '', // Added later from fetch

    // Step 5: Shift
    stationId: '',
    departmentId: '',
    defaultShift: 'Morning Shift',
    backupShift: '',
    workDays: 'Mon,Tue,Wed,Thu,Fri',
    status: 'ACTIVE',
    employeeCode: `NUR-${Math.floor(1000 + Math.random() * 9000)}`
  })

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      setIsLoading(true)
      const [s, d, r] = await Promise.all([
        systemSetupService.getStations(),
        systemSetupService.getDepartments(),
        systemSetupService.getRoles()
      ])
      setStations(s)
      setDepartments(d)
      setRoles(r)
      
      // Default selections
      const nurseRole = r.find((role: EmployeeRole) => role.name === 'Nurse')
      const clinicalDept = d.find((dept: Department) => dept.name.includes('Clinical') || dept.name.includes('Medical'))
      
      setFormData(prev => ({ 
        ...prev, 
        roleId: nurseRole?.id || '', 
        departmentId: clinicalDept?.id || '' 
      }))
    } catch (err) {
      console.error('Failed to fetch master data:', err)
      toast.error('Connection failed')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoData = () => {
    const ts = Date.now().toString().slice(-4);
    setFormData({
      ...formData,
      firstName: 'Amina',
      lastName: 'Ali',
      email: `amina.nurse.${ts}@aamin.so`,
      phone: '617' + ts + '888',
      username: `amina.nurse.${ts}`,
      password: 'Password123!',
      employeeCode: 'NUR-' + ts,
      gender: 'FEMALE',
      dateOfBirth: '1995-03-24',
      nationalId: 'NID-' + ts,
      emergencyContactName: 'Omar Ali',
      emergencyPhone: '618' + ts + '999',
      relationship: 'Brother',
      address: 'Bakara Market, Mogadishu',
      licenseNumber: 'NR-' + ts + '-LIC',
      licenseExpiryDate: '2027-12-31',
      yearsOfExperience: '5',
      qualification: 'BSc Nursing',
      specialization: 'ICU',
      workDays: 'Mon,Tue,Wed,Thu,Fri',
      additionalNotes: 'Certified in Advanced Trauma Life Support (ATLS).'
    } as any)
    toast.success('Populated with demo nurse data')
  }

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const payload = {
        ...formData,
        employeeRoleId: formData.roleId,
        role: 'EMPLOYEE' as const
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

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-32 pt-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 px-8">
        <div>
          <div className="flex items-center justify-between gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] mb-4 ml-0.5">
            <div className="flex items-center gap-2">
              <span>Nurses</span>
              <ChevronRight className="w-3 h-3 stroke-[3]" />
              <span className="text-gray-900">Add New Nurse</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Register New Nurse</h1>
          <div className="flex items-center gap-3 mt-1.5">
             <p className="text-gray-400 text-xs font-semibold tracking-tight">Onboard a new medical professional to the Aamin ambulance network</p>
             <div className="w-1 h-1 rounded-full bg-gray-200" />
             <p className="text-blue-600 font-bold text-xs uppercase tracking-widest underline decoration-2 decoration-blue-200 underline-offset-4">
               Step {currentStep} of 6: {STEPS[currentStep-1].title}
             </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
           <Button variant="outline" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-2 border-blue-50 text-blue-600 hover:bg-blue-50 rounded-xl" onClick={fillDemoData}>
             Demo Nurse
           </Button>
           <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 flex items-center gap-2 border border-gray-100 px-4 py-2 rounded-xl" onClick={() => router.push('/admin/nurses')}>
             <ArrowLeft className="w-4 h-4" />
             Back
           </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-2xl shadow-lg shadow-gray-200/30 mx-8">
         <NursesStepper steps={STEPS} currentStep={currentStep} />
      </div>

      <div className="px-8 space-y-12">
        <div className="max-w-4xl mx-auto">
           {currentStep === 1 && <PersonalInfoSection formData={formData} setFormData={setFormData} />}
           {currentStep === 2 && <ContactEmergencySection formData={formData} setFormData={setFormData} />}
           {currentStep === 3 && <ProfessionalSection formData={formData} setFormData={setFormData} />}
           {currentStep === 4 && <AccountAccessSection formData={formData} setFormData={setFormData} />}
           {currentStep === 5 && <ShiftSection formData={formData} setFormData={setFormData} stations={stations} />}
           
           {currentStep === 6 && (
             <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                      <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                         <h2 className="text-xl font-black text-gray-900 tracking-tight">Final Registration Review</h2>
                         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Review nurse credentials and system access details</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      <div className="space-y-6">
                         <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                           <User className="w-4 h-4 text-blue-600" /> Personal Info
                         </p>
                         <div className="space-y-1">
                            <p className="text-sm font-black text-gray-900">{formData.firstName} {formData.lastName}</p>
                            <p className="text-xs text-gray-500 font-medium">{formData.email}</p>
                            <p className="text-xs text-gray-400 font-medium">{formData.address}</p>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                           <Stethoscope className="w-4 h-4 text-blue-600" /> Medical
                         </p>
                         <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                               <span className="text-[10px] font-bold text-gray-400 uppercase">Qualification</span>
                               <span className="text-xs font-bold text-gray-700">{formData.qualification}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                               <span className="text-[10px] font-bold text-gray-400 uppercase">Specialty</span>
                               <span className="text-xs font-bold text-gray-700">{formData.specialization}</span>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                           <Shield className="w-4 h-4 text-blue-600" /> Deployment
                         </p>
                         <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                               <span className="text-[10px] font-bold text-gray-400 uppercase">Station</span>
                               <span className="text-xs font-bold text-gray-700">{stations.find(s => s.id === formData.stationId)?.name || 'None'}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-[10px] font-bold text-gray-400 uppercase">Days</span>
                               <span className="text-xs font-bold text-blue-500">{formData.workDays}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-10 border-t border-gray-100/30 max-w-4xl mx-auto">
          {currentStep === 1 ? (
             <Button variant="ghost" className="h-12 px-10 rounded-xl bg-white border border-gray-100 font-black text-[11px] text-gray-400 uppercase" onClick={() => router.back()}>Cancel</Button>
          ) : (
             <Button variant="ghost" className="h-12 px-10 rounded-xl bg-gray-50 border border-gray-200 font-black text-[11px] text-gray-500 uppercase flex items-center group shadow-sm" onClick={handleBack}>
               <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1" />
               Previous
             </Button>
          )}

          <Button 
            className={`h-12 rounded-xl font-black tracking-[0.2em] uppercase text-[11px] flex items-center transition-all group shadow-xl
              ${currentStep === 6 ? 'px-14 bg-green-600 hover:bg-green-700' : 'px-12 bg-blue-600 hover:bg-blue-700'}`}
            onClick={currentStep === 6 ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : currentStep === 6 ? 'Complete Registration' : 'Next Section'}
            {currentStep < 6 && <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1" />}
            {currentStep === 6 && !isSubmitting && <Save className="w-4 h-4 ml-3" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
