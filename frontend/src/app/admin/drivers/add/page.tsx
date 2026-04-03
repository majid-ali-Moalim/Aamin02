'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  WorkInfoSection, 
  LicenseSection, 
  ShiftSection,
  ContactEmergencySection,
  AccountAccessSection,
  AdditionalNotesSection
} from '@/components/drivers/DriverFormSections'

const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Driver Details' },
  { id: 2, title: 'Work & Assignment', description: 'Job and station details' },
  { id: 3, title: 'License & Compliance', description: 'Documents and expiration' },
  { id: 4, title: 'Shift & Availability', description: 'Working hours setup' },
  { id: 5, title: 'Review & Save', description: 'Confirm and create' }
]

export default function RedesignedAddDriverPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Master Data
  const [stations, setStations] = useState<Station[]>([])
  const [ambulances, setAmbulances] = useState<Ambulance[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<EmployeeRole[]>([])

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    nationalId: '',
    profilePhoto: '',
    
    // Step 2: Work
    employeeCode: `DRV-${Math.floor(1000 + Math.random() * 9000)}`,
    departmentId: '',
    employeeRoleId: '',
    stationId: '',
    assignedAmbulanceId: '',
    employmentDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    notes: '',

    // Step 3: Emergency & Account
    emergencyContactName: '',
    relationship: '',
    emergencyPhone: '',
    address: '',
    username: '',
    password: '',

    // Step 4: License
    licenseNumber: '',
    licenseType: 'Standard',
    licenseClass: 'Class A',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    medicalFitness: 'FIT',
    medicalExpiry: '',

    // Step 5: Shift
    defaultShift: 'Day Shift',
    typicalStartTime: '08:00',
    typicalEndTime: '16:00',
    shiftStatus: 'AVAILABLE'
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
      setAmbulances(a.filter(amb => amb.status === 'AVAILABLE'))
      setDepartments(d)
      setRoles(r)
      
      // Auto-select defaults
      const driverRole = r.find((role: EmployeeRole) => role.name === 'Driver')
      const fieldDept = d.find((dept: Department) => dept.name.includes('Field'))
      setFormData(prev => ({ 
        ...prev, 
        employeeRoleId: driverRole?.id || '', 
        departmentId: fieldDept?.id || '' 
      }))
    } catch (err) {
      console.error('Failed to fetch master data:', err)
      toast.error('Failed to connect to backend server')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoData = () => {
    const ts = Date.now().toString().slice(-6);
    setFormData({
      ...formData,
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: `ahmed.${ts}@aamin.so`,
      phone: '617001122',
      username: `ahmed.${ts}`,
      password: 'Password123!',
      employeeCode: 'DRV-' + ts,
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      nationalId: 'ID-' + ts,
      emergencyContactName: 'Fatuma Hassan',
      emergencyPhone: '617998877',
      relationship: 'Sister',
      address: 'KM4 Area, Mogadishu, Somalia',
      licenseNumber: 'LIC-' + Math.floor(10000 + Math.random() * 90000),
      licenseType: 'Heavy Duty',
      licenseClass: 'Class A',
      licenseIssueDate: '2020-01-01',
      licenseExpiryDate: '2025-01-01',
      medicalExpiry: '2025-01-01',
      employmentDate: new Date().toISOString().split('T')[0],
      defaultShift: 'Day Shift',
      typicalStartTime: '08:00',
      typicalEndTime: '20:00',
      notes: 'Fluent in Somali, English, and Arabic. Experienced in emergency response.'
    })
    toast.success('Successfully populated with demo data')
  }

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getNextStepLabel = () => {
    switch (currentStep) {
      case 1: return 'Next: Work & Assignment'
      case 2: return 'Next: License & Compliance'
      case 3: return 'Next: Shift & Availability'
      case 4: return 'Next: Review & Save'
      default: return 'Complete Registration'
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      // Map to backend structure
      const payload = {
        ...formData,
        role: 'EMPLOYEE' as const
      }
      await employeesService.create(payload)
      toast.success('Driver registered and account created successfully!')
      router.push('/admin/drivers')
    } catch (err: any) {
      console.error('Submission failed:', err)
      toast.error(err.response?.data?.message || 'Failed to register driver. Please check your data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-32 pt-2">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 px-8">
        <div>
          <div className="flex items-center justify-between gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] mb-4 ml-0.5">
            <div className="flex items-center gap-2">
              <span>Drivers</span>
              <ChevronRight className="w-3 h-3 stroke-[3]" />
              <span className="text-gray-900">Add New Driver</span>
            </div>
            <button 
              className="md:hidden text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2"
              onClick={() => router.push('/admin/drivers')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-bold">Back to Drivers</span>
            </button>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Add New Driver</h1>
          <div className="flex items-center gap-3 mt-1.5">
             <p className="text-gray-400 text-xs font-semibold tracking-tight">Register a new driver and configure their operational details</p>
             <div className="w-1 h-1 rounded-full bg-gray-200" />
             <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">Step {currentStep} of 5: {STEPS[currentStep-1].title}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
           {currentStep === 1 && (
             <Button 
               variant="outline"
               className="h-8 px-4 text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 text-blue-600 hover:bg-blue-50 transition-all rounded-lg"
               onClick={fillDemoData}
             >
               Fill Demo Data
             </Button>
           )}
           <button 
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-all flex items-center gap-2 group border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50"
              onClick={() => router.push('/admin/drivers')}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Drivers
            </button>
        </div>
      </div>

      {/* Stepper Implementation */}
      <div className="bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-2xl shadow-lg shadow-gray-200/30 mx-8">
         <DriversStepper steps={STEPS} currentStep={currentStep} />
      </div>

      <div className="px-8 space-y-12">
        <div className="max-w-4xl mx-auto">
           {currentStep === 1 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <PersonalInfoSection formData={formData} setFormData={setFormData} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                   <div className="lg:col-span-2">
                      <ContactEmergencySection formData={formData} setFormData={setFormData} />
                   </div>
                   <div className="lg:col-span-1">
                      <AccountAccessSection formData={formData} setFormData={setFormData} />
                   </div>
                </div>

                <AdditionalNotesSection formData={formData} setFormData={setFormData} />
             </div>
           )}
           
           {currentStep === 2 && (
              <WorkInfoSection 
                formData={formData} 
                setFormData={setFormData} 
                stations={stations} 
                ambulances={ambulances}
                departments={departments}
                roles={roles}
              />
           )}
           
           {currentStep === 3 && <LicenseSection formData={formData} setFormData={setFormData} />}
           
           {currentStep === 4 && <ShiftSection formData={formData} setFormData={setFormData} />}

            {currentStep === 5 && (
             <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-50">
                      <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                         <h2 className="text-xl font-black text-gray-900 tracking-tight">Review Driver Information</h2>
                         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Please review all details before creating the record</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      {/* Personal Summary */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-2 mb-2">
                           <User className="w-4 h-4 text-blue-600" />
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Personal Information</p>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                               <User className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                               <p className="text-sm font-black text-gray-900">{formData.firstName} {formData.lastName}</p>
                               <p className="text-xs text-gray-500 font-medium">{formData.phone}</p>
                               <p className="text-xs text-gray-500 font-medium">{formData.email}</p>
                            </div>
                         </div>
                         <div className="space-y-3 pt-2">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                               <span className="text-[10px] font-bold text-gray-400 uppercase">DOB</span>
                               <span className="text-xs font-bold text-gray-700">{formData.dateOfBirth || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                               <span className="text-[10px] font-bold text-gray-400 uppercase">Gender</span>
                               <span className="text-xs font-bold text-gray-700">{formData.gender || 'N/A'}</span>
                            </div>
                         </div>
                         
                         <div className="space-y-3 pt-6 border-t border-gray-50 mt-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                               <Shield className="w-3 h-3 text-blue-500" />
                               Account Security
                            </p>
                            <div className="flex justify-between border-b border-gray-50 pb-1">
                               <span className="text-[10px] font-bold text-gray-400 uppercase">Login Email</span>
                               <span className="text-xs font-bold text-gray-700">{formData.username || 'N/A'}</span>
                            </div>
                         </div>
                      </div>

                      {/* Work Summary */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-2 mb-2">
                           <Truck className="w-4 h-4 text-blue-600" />
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Work Information</p>
                         </div>
                         <div className="space-y-4">
                            {[
                              { label: 'Employee Code', value: formData.employeeCode },
                              { label: 'Department', value: departments.find(d => d.id === formData.departmentId)?.name },
                              { label: 'Role', value: roles.find(r => r.id === formData.employeeRoleId)?.name || 'Driver' },
                              { label: 'Station', value: stations.find(s => s.id === formData.stationId)?.name },
                              { label: 'Ambulance', value: ambulances.find(a => a.id === formData.assignedAmbulanceId)?.ambulanceNumber || 'None' }
                            ].map((item, i) => (
                              <div key={i} className="flex justify-between border-b border-gray-50 pb-2">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase">{item.label}</span>
                                 <span className="text-xs font-bold text-gray-700">{item.value || 'N/A'}</span>
                              </div>
                            ))}
                         </div>
                      </div>

                      {/* License Summary */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-2 mb-2">
                           <Shield className="w-4 h-4 text-blue-600" />
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">License & Compliance</p>
                         </div>
                         <div className="space-y-4">
                            {[
                              { label: 'License Number', value: formData.licenseNumber },
                              { label: 'Type', value: formData.licenseType },
                              { label: 'Class', value: formData.licenseClass },
                              { label: 'Expiry', value: formData.licenseExpiryDate },
                              { label: 'Status', value: 'VALD', isBadge: true }
                            ].map((item, i) => (
                              <div key={i} className="flex justify-between border-b border-gray-50 pb-2">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase">{item.label}</span>
                                 {item.isBadge ? (
                                   <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest">Valid</span>
                                 ) : (
                                   <span className="text-xs font-bold text-gray-700">{item.value || 'N/A'}</span>
                                 )}
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-gray-100">
                       {/* Shift Summary */}
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-2">
                           <Clock className="w-4 h-4 text-blue-600" />
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Shift & Availability</p>
                         </div>
                         <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                             <div>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Default Shift</p>
                               <p className="text-sm font-black text-gray-800 mt-1">{formData.defaultShift}</p>
                             </div>
                             <div>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Typical Hours</p>
                               <p className="text-sm font-black text-gray-800 mt-1">{formData.typicalStartTime} - {formData.typicalEndTime}</p>
                             </div>
                         </div>
                       </div>

                       {/* Emergency Summary */}
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-2">
                           <Phone className="w-4 h-4 text-blue-600" />
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Emergency Contact</p>
                         </div>
                         <div className="bg-blue-50/20 p-6 rounded-3xl border border-blue-50">
                             <div className="space-y-2">
                               <p className="text-sm font-black text-gray-800">{formData.emergencyContactName || 'N/A'}</p>
                               <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{formData.relationship}</p>
                               <p className="text-xs text-gray-500 font-bold mt-2">{formData.emergencyPhone}</p>
                             </div>
                         </div>
                       </div>

                       {/* Notes Summary */}
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-2">
                           <AlertCircle className="w-4 h-4 text-gray-400" />
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Additional Notes</p>
                         </div>
                         <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 h-full min-h-[100px]">
                            <p className="text-xs font-medium text-gray-500 italic">
                               {formData.notes || "No additional notes provided."}
                            </p>
                         </div>
                       </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-10 border-t border-gray-100/30 max-w-4xl mx-auto">
          {currentStep === 1 ? (
            <Button 
              variant="ghost" 
              className="h-12 px-10 rounded-xl bg-white/50 shadow-sm border border-gray-100 font-black text-[11px] text-gray-400 hover:text-gray-900 tracking-widest uppercase transition-all flex items-center"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="h-12 px-10 rounded-xl bg-gray-50/50 border border-gray-200 font-black text-[11px] text-gray-500 hover:text-gray-900 tracking-widest uppercase transition-all flex items-center group shadow-sm"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </Button>
          )}

          <Button 
            className={`h-12 rounded-xl font-black tracking-[0.2em] uppercase text-[11px] flex items-center transition-all group shadow-xl transition-all duration-500
              ${currentStep === 5 
                ? 'px-14 bg-green-600 hover:bg-green-700 text-white ring-8 ring-green-100/50' 
                : 'px-12 bg-blue-600 hover:bg-blue-700 text-white ring-8 ring-blue-50/50'}`}
            onClick={currentStep === 5 ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : getNextStepLabel()}
            {currentStep < 5 && <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform stroke-[3]" />}
            {currentStep === 5 && !isSubmitting && <Save className="w-4 h-4 ml-3" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
