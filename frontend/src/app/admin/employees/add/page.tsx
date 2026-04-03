'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, ArrowRight, Save, X, Loader2,
  CheckCircle2, AlertCircle, Info, UserPlus, ChevronRight,
  User, Truck, Shield, Clock, Phone
} from 'lucide-react'
import { employeesService, systemSetupService, ambulancesService } from '@/lib/api'
import { Station, Ambulance, Department, EmployeeRole } from '@/types'
import DriversStepper from '@/components/drivers/DriversStepper'
import { 
  PersonalInfoSection, 
  ContactEmergencySection, 
  AccountAccessSection, 
  ShiftStationSection,
  ReviewEmployeeSection
} from '@/components/drivers/DriverFormSections'

export default function GenericAddEmployeePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleType = searchParams.get('role')?.toLowerCase() || 'driver'
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Master Data
  const [stations, setStations] = useState<Station[]>([])
  const [ambulances, setAmbulances] = useState<Ambulance[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<EmployeeRole[]>([])

  // Dynamic Steps Based on Latest User Request (Fixed 5 Steps)
  const STEPS = [
    { id: 1, title: 'Personal Information', description: 'Core data' },
    { id: 2, title: 'Contact & Emergency', description: 'Communication' },
    { id: 3, title: 'Account Access', description: 'Security' },
    { id: 4, title: 'Shift & Availability', description: 'Operations' },
    { id: 5, title: 'Review & Save', description: 'Finalize' }
  ]

  const totalSteps = STEPS.length

  // Form State matching all requested fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'MALE',
    dateOfBirth: '',
    profilePhoto: '',
    nationalId: '',
    address: '',
    phone: '',
    alternatePhone: '',
    email: '',
    emergencyContactName: '',
    emergencyPhone: '',
    username: '',
    password: '',
    confirmPassword: '',
    permissions: [] as string[],
    status: 'ACTIVE',
    defaultShift: 'Morning',
    shiftStatus: 'AVAILABLE',
    stationId: '',
    notes: '',
    confirmed: false,
    employeeCode: '',
    departmentId: '',
    employeeRoleId: '',
    employmentDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      setIsLoading(true)
      const [s, a, d, r] = await Promise.all([
        systemSetupService.getStations(),
        ambulancesService.getAll(),
        systemSetupService.getDepartments(),
        systemSetupService.getRoles()
      ])
      setStations(s)
      setAmbulances(a)
      setDepartments(d)
      setRoles(r)
      
      const targetRole = r.find((role: EmployeeRole) => role.name.toLowerCase().includes(roleType))
      setFormData(prev => ({ 
        ...prev, 
        employeeRoleId: targetRole?.id || '',
        employeeCode: `${roleType.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      }))
    } catch (err) {
      console.error('Failed to fetch master data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep === 3 && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!formData.confirmed) {
       toast.error('Please confirm the information is correct')
       return
    }
    try {
      setIsSubmitting(true)
      await employeesService.create(formData)
      toast.success('Registration successful!')
      router.push('/admin/employees')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoSection formData={formData} setFormData={setFormData} />
      case 2: return <ContactEmergencySection formData={formData} setFormData={setFormData} />
      case 3: return <AccountAccessSection formData={formData} setFormData={setFormData} />
      case 4: return <ShiftStationSection formData={formData} setFormData={setFormData} stations={stations} />
      case 5: return <ReviewEmployeeSection formData={formData} setFormData={setFormData} />
      default: return null
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-32 pt-2">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 px-8">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] mb-4">
            <span>Employees</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 capitalize font-black">Add New {roleType}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight capitalize">Register New {roleType}</h1>
          <p className="text-gray-400 text-xs font-semibold tracking-tight mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-sm capitalize">Step {currentStep} of {totalSteps}: {STEPS[currentStep-1].title}</p>
        </div>
        <button 
          className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-all flex items-center gap-2 group border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel
        </button>
      </div>

      <div className="bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-2xl shadow-lg shadow-gray-200/30 mx-8">
         <DriversStepper steps={STEPS} currentStep={currentStep} />
      </div>

      <div className="px-8 space-y-12 min-h-[500px]">
        <div key={currentStep} className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
           {renderStepContent()}
        </div>

        <div className="flex items-center justify-between pt-10 border-t border-gray-100/30 max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className={`h-12 px-10 rounded-xl bg-gray-50/50 border border-gray-200 font-black text-[11px] text-gray-500 hover:text-gray-900 tracking-widest uppercase transition-all flex items-center group shadow-sm ${currentStep === 1 ? 'invisible' : ''}`}
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Previous
          </Button>

          <Button 
            className={`h-12 rounded-xl font-black tracking-[0.2em] uppercase text-[11px] flex items-center transition-all group shadow-xl transition-all duration-500 px-12 bg-red-600 hover:bg-red-700 text-white ring-8 ring-red-50/50`}
            onClick={currentStep === totalSteps ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : currentStep === totalSteps ? 'Finalize Registration' : 'Continue'}
            {currentStep < totalSteps && <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform stroke-[3]" />}
            {currentStep === totalSteps && !isSubmitting && <Save className="w-4 h-4 ml-3" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
