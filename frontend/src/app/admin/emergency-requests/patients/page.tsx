'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Users, Search, Filter, Plus, Eye, Edit, Trash2, 
  Phone, Calendar, Clock, Activity, Shield, 
  MapPin, Loader2, Download, Heart, FileText, UserPlus
} from 'lucide-react'
import { patientsService, emergencyRequestsService } from '@/lib/api'
import { Patient, EmergencyRequest } from '@/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function EmergencyPatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true)
        const data = await patientsService.getAll()
        setPatients(data)
      } catch (err) {
        console.error('Failed to fetch patients:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm)
    )
  }, [patients, searchTerm])

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-50">
         <div className="flex items-center gap-6 p-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-400 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-200">
               <Heart className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-3xl font-black text-secondary tracking-tighter uppercase italic">Emergency Registry</h1>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Shield className="w-3 h-3 text-red-600" /> Patient Intelligence Network
               </p>
            </div>
         </div>
         
         <div className="flex items-center gap-4 px-6">
            <Button variant="outline" className="h-14 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] bg-white border-gray-100 hover:bg-gray-50 transition-all">
               <Download className="w-4 h-4 mr-2 text-red-600" />
               Archived Records
            </Button>
            <Button 
               onClick={() => router.push('/admin/patients/add')}
               className="h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-200 transition-all active:scale-95 border-b-4 border-red-800"
            >
               <UserPlus className="w-4 h-4 mr-2" />
               Register Patient
            </Button>
         </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-red-500 transition-colors" />
            <input 
               type="text" 
               placeholder="Search by Patient Name, ID, or Phone..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 h-14 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-red-500/10 font-bold text-gray-700 transition-all focus:bg-white"
            />
         </div>
         <Button variant="outline" className="h-14 rounded-2xl px-6 bg-white border-gray-100">
            <Filter className="w-5 h-5 text-gray-400" />
         </Button>
      </div>

      {/* Result Grid */}
      {isLoading ? (
         <div className="p-24 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Querying Medical Archives...</p>
         </div>
      ) : filteredPatients.length === 0 ? (
         <div className="p-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Users className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-secondary mb-2">No Records Found</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">There are currently no patients in the emergency database matching your criteria.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPatients.map((patient) => (
               <div key={patient.id} className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden">
                  <div className="p-8">
                     <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-red-200 font-black text-xl group-hover:bg-red-50 group-hover:text-red-500 transition-colors border border-gray-50">
                              {patient.fullName.charAt(0)}
                           </div>
                           <div>
                              <h3 className="text-lg font-black text-secondary tracking-tight group-hover:text-red-600 transition-colors uppercase italic">{patient.fullName}</h3>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{patient.patientCode || 'UID-PENDING'}</p>
                           </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-gray-50">
                           <Eye className="w-5 h-5 text-gray-300 group-hover:text-red-400" />
                        </Button>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Phone className="w-4 h-4 text-blue-400" />
                           <span className="text-xs font-bold text-gray-600">{patient.phone || 'No Contact Data'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Calendar className="w-4 h-4 text-orange-400" />
                           <span className="text-xs font-bold text-gray-600">
                              {patient.age ? `${patient.age} Years` : 'Age Data Missing'} 
                              {patient.gender && <span className="opacity-40 px-1.5">•</span>} 
                              {patient.gender}
                           </span>
                        </div>
                        
                        <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-emerald-500" />
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">History Logged</span>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600">
                                 <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600">
                                 <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Status Indicator Bar */}
                  <div className="h-1.5 w-full bg-gray-50">
                     <div className="h-full bg-red-500 w-[70%] rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  )
}
