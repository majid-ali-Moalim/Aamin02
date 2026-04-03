import React from 'react'
import { 
  User, Truck, Shield, Clock, MapPin, 
  Phone, Mail, Calendar, Info, 
  CreditCard, Upload, Eye, EyeOff, CheckCircle2,
  AlertCircle, ChevronRight, X, BookOpen, 
  Lock, Settings, Briefcase, Activity
} from 'lucide-react'
import { Station, Ambulance, Department, EmployeeRole } from '@/types'
import { uploadService } from '@/lib/api'
import { toast } from 'react-hot-toast'

// --- Reusable Input Components ---
const FormInput = ({ label, required, icon: Icon, prefix, ...props }: any) => (
  <div className="space-y-2 focus-within:z-10 group">
    <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-red-600">
      {label} {required && <span className="text-red-500 ml-1.5 font-bold text-sm">*</span>}
    </label>
    <div className="relative group/input">
      <div className="absolute inset-0 bg-red-600/0 border border-transparent rounded-xl transition-all group-focus-within/input:border-red-500/30 group-focus-within/input:ring-4 group-focus-within/input:ring-red-100/50" />
      <div className="relative flex items-center h-12 bg-white border border-gray-200/80 rounded-xl group-focus-within/input:border-red-500/40 group-focus-within/input:shadow-md group-hover/input:border-gray-300 transition-all overflow-hidden px-4 shadow-sm">
        {prefix && (
          <div className="h-full pr-3 flex items-center gap-1.5 border-r border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500">
            {prefix}
          </div>
        )}
        {Icon && <Icon className={`w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors ${prefix ? 'ml-3' : ''}`} />}
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
    <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-red-600">
      {label} {required && <span className="text-red-500 ml-1.5 font-bold text-sm">*</span>}
    </label>
    <div className="relative group/input">
       <div className="absolute inset-0 bg-red-600/0 border border-transparent rounded-xl transition-all group-focus-within/input:border-red-500/30 group-focus-within/input:ring-4 group-focus-within/input:ring-red-100/50" />
       <div className="relative flex items-center h-12 bg-white border border-gray-200/80 rounded-xl group-focus-within/input:border-red-500/40 group-focus-within/input:shadow-md group-hover/input:border-gray-300 transition-all overflow-hidden shadow-sm">
        <select
          {...props}
          className="flex-1 h-full px-4 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-800 cursor-pointer appearance-none outline-none"
        >
          <option value="" className="text-gray-400">Select {label}</option>
          {options?.map((opt: any) => (
            <option key={opt.id} value={opt.id}>{opt.name || opt.ambulanceNumber}</option>
          ))}
        </select>
        <ChevronRight className="w-4 h-4 text-gray-400 mr-4 rotate-90 pointer-events-none group-focus-within/input:text-red-500 transition-colors" />
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
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Upload photo</span>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept={accept} onChange={handleFileChange} />
      </div>
    </div>
  )
}

// --- Specific Steps (1 to 5) ---

export const PersonalInfoSection = ({ formData, setFormData }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FormInput label="First Name" required placeholder="Enter first name" icon={User} value={formData.firstName} onChange={(e: any) => setFormData({...formData, firstName: e.target.value})} />
      <FormInput label="Last Name" required placeholder="Enter last name" icon={User} value={formData.lastName} onChange={(e: any) => setFormData({...formData, lastName: e.target.value})} />
      <FormSelect label="Gender" required options={[{id: 'MALE', name: 'Male'}, {id: 'FEMALE', name: 'Female'}]} value={formData.gender} onChange={(e: any) => setFormData({...formData, gender: e.target.value})} />
      <FormInput label="Date of Birth" required type="date" value={formData.dateOfBirth} onChange={(e: any) => setFormData({...formData, dateOfBirth: e.target.value})} />
      <FormInput label="National / Employee ID" placeholder="Optional" icon={CreditCard} value={formData.nationalId} onChange={(e: any) => setFormData({...formData, nationalId: e.target.value})} />
      <div className="md:col-span-2">
         <FormInput label="Address" placeholder="Full residential address" icon={MapPin} value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} />
      </div>
    </div>
    <div className="lg:col-span-1">
      <FileUploadField label="Profile Photo" value={formData.profilePhoto} onChange={(url: string) => setFormData({...formData, profilePhoto: url})} />
    </div>
  </div>
)

export const ContactEmergencySection = ({ formData, setFormData }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="space-y-6 md:col-span-2">
       <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Contact Details</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Phone Number" required prefix="+252" icon={Phone} value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} />
          <FormInput label="Alternate Phone" prefix="+252" icon={Phone} value={formData.alternatePhone} onChange={(e: any) => setFormData({...formData, alternatePhone: e.target.value})} />
          <div className="md:col-span-2">
             <FormInput label="Email Address" required type="email" icon={Mail} value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
          </div>
       </div>
    </div>
    <div className="space-y-6">
       <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Emergency Contact</h3>
       <FormInput label="Contact Name" required icon={User} value={formData.emergencyContactName} onChange={(e: any) => setFormData({...formData, emergencyContactName: e.target.value})} />
       <FormInput label="Contact Phone" required prefix="+252" icon={Phone} value={formData.emergencyPhone} onChange={(e: any) => setFormData({...formData, emergencyPhone: e.target.value})} />
    </div>
  </div>
)

export const AccountAccessSection = ({ formData, setFormData }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="space-y-6">
       <FormInput label="Username / Login Email" required icon={Mail} value={formData.username} onChange={(e: any) => setFormData({...formData, username: e.target.value})} />
       <FormInput label="Password" required type="password" icon={Lock} value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} />
       <FormInput label="Confirm Password" required type="password" icon={Lock} value={formData.confirmPassword} onChange={(e: any) => setFormData({...formData, confirmPassword: e.target.value})} />
    </div>
    <div className="space-y-6 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
       <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Account Status</label>
          <div 
             onClick={() => setFormData({...formData, status: formData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'})}
             className={`w-12 h-6 rounded-full cursor-pointer transition-all p-1 ${formData.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-200'}`}
          >
             <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.status === 'ACTIVE' ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
       </div>
       <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Direct Permissions</label>
          <div className="flex flex-wrap gap-2">
             {['View Dispatch', 'Manage Fleet', 'Edit Employees', 'System Setup'].map(perm => {
                const isSelected = formData.permissions?.includes(perm)
                return (
                  <button 
                    key={perm}
                    onClick={() => {
                       const perms = formData.permissions || []
                       setFormData({
                          ...formData, 
                          permissions: isSelected ? perms.filter((p: any) => p !== perm) : [...perms, perm]
                       })
                    }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all shadow-sm ${isSelected ? 'bg-red-600 text-white' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                  >
                    {perm}
                  </button>
                )
             })}
          </div>
       </div>
    </div>
  </div>
)

export const ShiftStationSection = ({ formData, setFormData, stations }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="space-y-6">
       <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Shift Type</label>
       <div className="grid grid-cols-1 gap-3">
          {['Morning', 'Night', 'Rotational'].map(type => (
            <button
               key={type}
               onClick={() => setFormData({...formData, defaultShift: type})}
               className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.defaultShift === type ? 'border-red-600 bg-red-50 text-red-600 shadow-lg' : 'border-gray-50 bg-white text-gray-400 hover:border-gray-200'}`}
            >
               <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${formData.defaultShift === type ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
                     <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-wider">{type}</span>
               </div>
               {formData.defaultShift === type && <CheckCircle2 className="w-5 h-5" />}
            </button>
          ))}
       </div>
    </div>
    <div className="space-y-8">
       <FormSelect label="Availability Status" required options={[{id: 'AVAILABLE', name: 'Available'}, {id: 'ONDUTY', name: 'On Duty'}, {id: 'OFFLINE', name: 'Offline'}]} value={formData.shiftStatus} onChange={(e: any) => setFormData({...formData, shiftStatus: e.target.value})} />
       <FormSelect label="Assigned Station" required options={stations} value={formData.stationId} onChange={(e: any) => setFormData({...formData, stationId: e.target.value})} />
       
       <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
             <Info className="w-4 h-4" />
             Assignment Logic
          </p>
          <p className="text-xs text-blue-500/80 font-semibold leading-relaxed tracking-tight">
             Shift changes affect automatic dispatch priority. Please ensure the station matches the primary geographic area of activity.
          </p>
       </div>
    </div>
  </div>
)

export const ReviewEmployeeSection = ({ formData, setFormData }: any) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
           { label: 'Full Name', value: `${formData.firstName} ${formData.lastName}`, icon: User },
           { label: 'Role / Level', value: formData.permissions?.join(', ') || 'Standard', icon: Briefcase },
           { label: 'Phone', value: `+252 ${formData.phone}`, icon: Phone },
           { label: 'Shift', value: formData.defaultShift, icon: Clock }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:border-red-600/20 transition-all">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                   <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
             </div>
             <p className="text-sm font-black text-gray-900 line-clamp-1">{stat.value || 'N/A'}</p>
          </div>
        ))}
     </div>

     <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-4 block">Notes / Remarks</label>
        <textarea 
           placeholder="Add any specific operational notes about this employee..."
           className="w-full h-32 p-4 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-red-100 transition-all"
           value={formData.notes}
           onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />
        
        <div className="mt-8 pt-8 border-t border-gray-50">
           <label className="flex items-center gap-4 cursor-pointer group">
              <input 
                 type="checkbox"
                 className="w-6 h-6 rounded-lg border-2 border-gray-200 text-red-600 focus:ring-4 focus:ring-red-100 transition-all cursor-pointer"
                 onChange={(e) => setFormData({...formData, confirmed: e.target.checked})}
              />
              <div>
                 <p className="text-xs font-black text-gray-900 uppercase tracking-wider">I confirm all information is correct</p>
                 <p className="text-[10px] text-gray-400 font-bold tracking-tight">This will create a permanent record in the Aamin Dispatch System</p>
              </div>
           </label>
        </div>
     </div>
  </div>
)
