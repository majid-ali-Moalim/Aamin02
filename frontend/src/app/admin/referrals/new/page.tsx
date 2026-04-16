'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, Search, UserPlus, FileText, MapPin, 
  Building2, ArrowRightLeft, Shield, AlertCircle,
  Truck, CheckCircle, Navigation, Heart, Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { referralsService, patientsService, systemSetupService } from '@/lib/api'
import { ReferralStatus, Priority, Patient, IncidentCategory } from '@/types'

export default function NewReferralPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNewPatient, setIsNewPatient] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [categories, setCategories] = useState<IncidentCategory[]>([])
  
  const [formData, setFormData] = useState({
    patientId: '',
    originFacility: '',
    destinationFacility: '',
    reason: '',
    priority: Priority.MEDIUM,
    incidentCategoryId: '',
    medicalNotes: '',
    newPatient: {
      fullName: '',
      phone: '',
      gender: '',
      age: ''
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, categoriesData] = await Promise.all([
          patientsService.getAll(),
          systemSetupService.getIncidentCategories()
        ])
        setPatients(patientsData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Failed to load form data:', err)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const payload = {
        ...formData,
        newPatient: isNewPatient ? formData.newPatient : undefined
      }
      await referralsService.create(payload)
      router.push('/admin/referrals')
    } catch (error) {
      console.error('Referral creation error:', error)
      alert('Failed to create referral request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 max-w-[950px] mx-auto min-h-screen">
      {/* Header Section */}
      <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-400 relative flex items-center px-10 gap-6 rounded-t-[3rem] border border-white/40 shadow-2xl overflow-hidden mb-0 transition-all">
        <div className="absolute top-0 right-0 bottom-0 opacity-10 w-1/2 pointer-events-none transform skew-x-[-15deg]">
           <div className="w-full h-full border-r-8 border-white/20" />
        </div>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center shadow-xl border border-white/30">
          <ArrowRightLeft className="w-9 h-9 text-white drop-shadow-md" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white drop-shadow-md tracking-tighter uppercase italic">Inter-Facility Transit</h1>
          <p className="text-blue-50/90 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Shield className="w-3 h-3" /> Secure Patient Transfer Logistics
          </p>
        </div>
      </div>

      <div className="bg-[#F1F6FB] p-10 rounded-b-[3rem] border-x border-b border-[#C5D7E8] shadow-2xl space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Patient Intelligence */}
          <div className="bg-white rounded-[2rem] border border-[#C5D7E8] shadow-sm overflow-hidden group">
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400 h-14 flex items-center justify-between pr-4 shadow-sm transition-all group-hover:shadow-md">
              <div className="flex items-center h-full">
                <div className="bg-[#E63946] text-white px-6 flex items-center justify-center h-full mr-6 shadow-[4px_0_15px_rgba(230,57,70,0.2)]">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-[14px] font-black text-white uppercase tracking-[0.2em] italic pr-4">Patient Intelligence</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsNewPatient(!isNewPatient)}
                className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl shadow-xl transition-all border border-white/20 active:scale-95 flex items-center gap-2 backdrop-blur-md"
              >
                 {isNewPatient ? <Search className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                 {isNewPatient ? 'Search Existing' : 'New Registry'}
              </button>
            </div>
            
            <div className="p-8 space-y-6">
               {isNewPatient ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Registry Name</label>
                        <input type="text" required placeholder="Enter full name" value={formData.newPatient.fullName} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, fullName: e.target.value}})} className="w-full p-4 text-sm font-bold bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none shadow-inner" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Primary Phone</label>
                        <input type="text" required placeholder="+252 ..." value={formData.newPatient.phone} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, phone: e.target.value}})} className="w-full p-4 text-sm font-bold bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none shadow-inner" />
                     </div>
                  </div>
               ) : (
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Existing Patient Registry</label>
                     <select 
                        required={!isNewPatient}
                        value={formData.patientId}
                        onChange={e => setFormData({...formData, patientId: e.target.value})}
                        className="w-full p-4 text-sm font-black text-secondary bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none shadow-inner appearance-none cursor-pointer"
                     >
                        <option value="">Select Registry...</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.patientCode})</option>)}
                     </select>
                  </div>
               )}
            </div>
          </div>

          {/* 2. Transit Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white rounded-[2rem] border border-[#C5D7E8] shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex items-center justify-between">
                   <h3 className="text-xs font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-rose-500" /> Origin Point
                   </h3>
                </div>
                <div className="p-6 space-y-4">
                   <input 
                     type="text" 
                     required 
                     placeholder="Hospital / Clinic (Origin)" 
                     value={formData.originFacility} 
                     onChange={e => setFormData({...formData, originFacility: e.target.value})} 
                     className="w-full p-4 text-sm font-bold bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/5 shadow-inner transition-all hover:bg-white"
                   />
                </div>
             </div>
             
             <div className="bg-white rounded-[2rem] border border-[#C5D7E8] shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex items-center justify-between">
                   <h3 className="text-xs font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-500" /> Target Destination
                   </h3>
                </div>
                <div className="p-6 space-y-4">
                   <input 
                     type="text" 
                     required 
                     placeholder="Referral Hospital (Destination)" 
                     value={formData.destinationFacility} 
                     onChange={e => setFormData({...formData, destinationFacility: e.target.value})} 
                     className="w-full p-4 text-sm font-bold bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 shadow-inner transition-all hover:bg-white"
                   />
                </div>
             </div>
          </div>

          {/* 3. Clinical Context */}
          <div className="bg-white rounded-[2rem] border border-[#C5D7E8] shadow-sm overflow-hidden">
             <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Referral Classification</label>
                      <select 
                        required
                        value={formData.incidentCategoryId}
                        onChange={e => setFormData({...formData, incidentCategoryId: e.target.value})}
                        className="w-full p-4 text-sm font-bold bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10"
                      >
                         <option value="">Select Category...</option>
                         {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Protocol Urgency</label>
                      <div className="flex gap-2">
                         {[Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL].map(p => (
                            <button 
                               key={p} 
                               type="button" 
                               onClick={() => setFormData({...formData, priority: p})}
                               className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest border-b-4 ${formData.priority === p ? 'bg-blue-600 text-white border-blue-900 shadow-lg' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                            >
                               {p}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>
                
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Clinical Justification / Reason</label>
                   <textarea rows={3} required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="State the reason for transfer (e.g., Specialized care required, Dialysis, Surgical procedure)" className="w-full p-4 text-sm font-medium bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 shadow-inner resize-none transition-all hover:bg-white" />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Pre-Transit Medical Records / Notes</label>
                   <textarea rows={2} value={formData.medicalNotes} onChange={e => setFormData({...formData, medicalNotes: e.target.value})} placeholder="Relevant patient history or stabilization notes" className="w-full p-4 text-sm font-medium bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 shadow-inner resize-none transition-all hover:bg-white" />
                </div>
             </div>
          </div>

          <div className="flex gap-8 justify-center pt-4">
             <Button 
                type="button" 
                onClick={() => router.back()}
                className="w-56 h-14 bg-gradient-to-b from-gray-400 to-gray-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl border-b-4 border-gray-800 transition-all active:scale-95 hover:from-gray-500 hover:to-gray-700"
             >
                Discard Protocol
             </Button>
             <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-56 h-14 bg-gradient-to-b from-blue-600 to-blue-800 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl border-b-4 border-blue-950 transition-all active:scale-95 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center gap-3"
             >
                {isSubmitting ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                   <>
                      <ArrowRightLeft className="w-5 h-5 opacity-70" />
                      <span>Request Protocol</span>
                   </>
                )}
             </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
