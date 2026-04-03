import React from 'react'
import { 
  User, Phone, Mail, MapPin, Calendar, CreditCard, 
  Stethoscope, GraduationCap, Briefcase, Award, 
  Droplets, ShieldCheck, Lock, UserCircle, Clock,
  Upload, CheckCircle2, AlertCircle, FileText, ChevronRight
} from 'lucide-react'
import { Station } from '@/types'
import { uploadService } from '@/lib/api'
import { toast } from 'react-hot-toast'

// --- Reusable Input Components (Nurse Blue Theme) ---
const FormInput = ({ label, required, icon: Icon, prefix, ...props }: any) => (
  <div className="space-y-2 focus-within:z-10 group">
    <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-blue-600">
      {label} {required && <span className="text-red-500 ml-1.5 font-bold text-sm">*</span>}
    </label>
    <div className="relative group/input">
      <div className="absolute inset-0 bg-blue-600/0 border border-transparent rounded-xl transition-all group-focus-within/input:border-blue-500/30 group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100/50" />
      <div className="relative flex items-center h-12 bg-white border border-gray-200/80 rounded-xl group-focus-within/input:border-blue-500/40 group-focus-within/input:shadow-md group-hover/input:border-gray-300 transition-all overflow-hidden px-4 shadow-sm">
        {prefix && (
          <div className="h-full pr-3 flex items-center gap-1.5 border-r border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500">
            {prefix}
          </div>
        )}
        {Icon && <Icon className={`w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors ${prefix ? 'ml-3' : ''}`} />}
        <input
          {...props}
          className={`flex-1 h-full bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium outline-none ml-2`}
        />
      </div>
    </div>
  </div>
)

const FormSelect = ({ label, required, options, ...props }: any) => (
  <div className="space-y-2 group focus-within:z-10">
    <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-blue-600">
      {label} {required && <span className="text-red-500 ml-1.5 font-bold text-sm">*</span>}
    </label>
    <div className="relative group/input">
       <div className="absolute inset-0 bg-blue-600/0 border border-transparent rounded-xl transition-all group-focus-within/input:border-blue-500/30 group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100/50" />
       <div className="relative flex items-center h-12 bg-white border border-gray-200/80 rounded-xl group-focus-within/input:border-blue-500/40 group-focus-within/input:shadow-md group-hover/input:border-gray-300 transition-all overflow-hidden shadow-sm">
        <select
          {...props}
          className="flex-1 h-full px-4 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-800 cursor-pointer appearance-none outline-none"
        >
          <option value="" className="text-gray-400">Select {label}</option>
          {options?.map((opt: any) => (
            <option key={opt.id || opt} value={opt.id || opt}>{opt.name || opt}</option>
          ))}
        </select>
        <ChevronRight className="w-4 h-4 text-gray-400 mr-4 rotate-90 pointer-events-none group-focus-within/input:text-blue-500 transition-colors" />
      </div>
    </div>
  </div>
)

const FileUploadField = ({ label, value, onChange, accept = "image/*" }: any) => {
    const [isUploading, setIsUploading] = React.useState(false)
    const [localPreview, setLocalPreview] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
  
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.type.startsWith('image/')) setLocalPreview(URL.createObjectURL(file))
      try {
        setIsUploading(true)
        const res = await uploadService.uploadFile(file)
        onChange(res.url)
        toast.success(`${label} uploaded`)
      } catch (error) {
        toast.error(`Upload failed`)
        setLocalPreview(null)
      } finally {
        setIsUploading(false)
      }
    }
  
    const displayUrl = localPreview || (value?.startsWith('/uploads') ? `http://localhost:3001${value}` : value)
  
    return (
      <div className="space-y-1.5 group">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative h-24 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer overflow-hidden"
        >
          {displayUrl ? (
            <img src={displayUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Upload className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Upload file</span>
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept={accept} onChange={handleFileChange} />
        </div>
      </div>
    )
}

// --- Specific Sections ---

export const PersonalInfoSection = ({ formData, setFormData }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
       <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="First Name" required icon={User} value={formData.firstName} onChange={(e: any) => setFormData({...formData, firstName: e.target.value})} />
          <FormInput label="Last Name" required icon={User} value={formData.lastName} onChange={(e: any) => setFormData({...formData, lastName: e.target.value})} />
          <FormSelect label="Gender" required options={['MALE', 'FEMALE']} value={formData.gender} onChange={(e: any) => setFormData({...formData, gender: e.target.value})} />
          <FormInput label="Date of Birth" required type="date" value={formData.dateOfBirth} onChange={(e: any) => setFormData({...formData, dateOfBirth: e.target.value})} />
          <FormInput label="National ID" icon={CreditCard} value={formData.nationalId} onChange={(e: any) => setFormData({...formData, nationalId: e.target.value})} />
          <FormInput label="Address" icon={MapPin} value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} />
       </div>
       <div className="md:col-span-1">
          <FileUploadField label="Profile Photo" value={formData.profilePhoto} onChange={(url: string) => setFormData({...formData, profilePhoto: url})} />
       </div>
    </div>
  </div>
)

export const ContactEmergencySection = ({ formData, setFormData }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="md:col-span-2 space-y-6">
       <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Primary Contact</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Phone Number" required prefix="+252" icon={Phone} value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} />
          <FormInput label="Alternate Phone" prefix="+252" icon={Phone} value={formData.alternatePhone} onChange={(e: any) => setFormData({...formData, alternatePhone: e.target.value})} />
          <div className="md:col-span-2">
            <FormInput label="Email Address" required icon={Mail} value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
          </div>
       </div>
    </div>
    <div className="space-y-6">
       <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Emergency</h3>
       <FormInput label="Contact Name" required icon={User} value={formData.emergencyContactName} onChange={(e: any) => setFormData({...formData, emergencyContactName: e.target.value})} />
       <FormInput label="Relationship" value={formData.relationship} onChange={(e: any) => setFormData({...formData, relationship: e.target.value})} />
       <FormInput label="Contact Phone" required prefix="+252" icon={Phone} value={formData.emergencyPhone} onChange={(e: any) => setFormData({...formData, emergencyPhone: e.target.value})} />
    </div>
  </div>
)

export const ProfessionalSection = ({ formData, setFormData }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
       <FormInput label="License Number" required icon={Award} value={formData.licenseNumber} onChange={(e: any) => setFormData({...formData, licenseNumber: e.target.value})} />
       <FormInput label="License Expiry" required type="date" value={formData.licenseExpiryDate} onChange={(e: any) => setFormData({...formData, licenseExpiryDate: e.target.value})} />
       <FormSelect label="Qualification" required options={['Diploma in Nursing', 'BSc Nursing', 'MSc Nursing', 'Specialist Nurse']} value={formData.qualification} onChange={(e: any) => setFormData({...formData, qualification: e.target.value})} />
       <FormSelect label="Specialization" required options={['Emergency', 'ICU', 'Trauma', 'General']} value={formData.specialization} onChange={(e: any) => setFormData({...formData, specialization: e.target.value})} />
       <FormInput label="Years of Experience" type="number" icon={Briefcase} value={formData.yearsOfExperience} onChange={(e: any) => setFormData({...formData, yearsOfExperience: e.target.value})} />
       <FormSelect label="Blood Group" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} value={formData.bloodGroup} onChange={(e: any) => setFormData({...formData, bloodGroup: e.target.value})} />
    </div>
    <div className="md:col-span-1">
       <FileUploadField label="Certification Upload (PDF/Image)" accept="image/*,application/pdf" value={formData.certificationUpload} onChange={(url: string) => setFormData({...formData, certificationUpload: url})} />
       <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-[10px] text-blue-600 font-bold leading-tight">Must include valid registration with the Ministry of Health.</p>
       </div>
    </div>
  </div>
)

export const AccountAccessSection = ({ formData, setFormData }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="space-y-6">
       <FormInput label="Username / System ID" required icon={UserCircle} value={formData.username} onChange={(e: any) => setFormData({...formData, username: e.target.value})} />
       <FormInput label="Password" required type="password" icon={Lock} value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} />
       <FormInput label="Confirm Password" required type="password" icon={Lock} />
    </div>
    <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col justify-center">
       <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
             <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
             <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Security Clearance</h4>
             <p className="text-[10px] text-gray-400 font-bold">Standard clinical staff permissions</p>
          </div>
       </div>
       <ul className="space-y-2 mt-4">
          {['Access to medical reports', 'Incident dispatch visibility', 'Patient records management'].map(item => (
            <li key={item} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
               <CheckCircle2 className="w-3 h-3 text-green-500" /> {item}
            </li>
          ))}
       </ul>
    </div>
  </div>
)

export const ShiftSection = ({ formData, setFormData, stations }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="space-y-6">
       <FormSelect label="Assigned Station" required options={stations} value={formData.stationId} onChange={(e: any) => setFormData({...formData, stationId: e.target.value})} />
       <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Working Days</label>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
               const isSelected = formData.workDays?.includes(day)
               return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                        const current = formData.workDays || ''
                        const next = current.includes(day) 
                          ? current.split(',').filter((d: string) => d !== day).join(',')
                          : [...current.split(',').filter(Boolean), day].join(',')
                        setFormData({ ...formData, workDays: next })
                    }}
                    className={`py-3 rounded-xl text-[10px] font-black transition-all border-2 ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-300 border-gray-100 hover:border-blue-200'}`}
                  >
                    {day}
                  </button>
               )
            })}
          </div>
       </div>
    </div>
    <div className="grid grid-cols-1 gap-6">
       <FormSelect label="Primary Shift" options={['Morning Shift', 'Afternoon Shift', 'Night Shift', 'Rotational']} value={formData.defaultShift} onChange={(e: any) => setFormData({...formData, defaultShift: e.target.value})} />
       <FormInput label="Backup / Emergency Shift" placeholder="Optional" icon={Clock} value={formData.backupShift} onChange={(e: any) => setFormData({...formData, backupShift: e.target.value})} />
    </div>
  </div>
)
