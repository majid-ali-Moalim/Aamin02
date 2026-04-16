'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Users, Search, Filter, Plus, Eye, Edit, Trash2, 
  MapPin, Phone, Clock, AlertCircle, CheckCircle, 
  Loader2, Download, Building2, ArrowRightLeft,
  Calendar, FileText, Shield
} from 'lucide-react'
import { referralsService, systemSetupService, patientsService } from '@/lib/api'
import { EmergencyRequest, Patient, ReferralStatus } from '@/types'
import { format, formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ReferralsPage() {
  const router = useRouter()
  const [referrals, setReferrals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchReferrals()
  }, [])

  const fetchReferrals = async () => {
    try {
      setIsLoading(true)
      const data = await referralsService.getAll()
      setReferrals(data)
    } catch (err) {
      console.error('Failed to fetch referrals:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReferrals = useMemo(() => {
    return referrals.filter(ref => {
      const patientName = ref.patient?.fullName?.toLowerCase() || ''
      const trackingCode = ref.trackingCode?.toLowerCase() || ''
      const matchesSearch = patientName.includes(searchTerm.toLowerCase()) || trackingCode.includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || ref.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [referrals, searchTerm, statusFilter])

  const getStatusStyle = (status: ReferralStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-50">
         <div className="flex items-center gap-6 p-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
               <ArrowRightLeft className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-3xl font-black text-secondary tracking-tighter uppercase italic">Inter-Facility Referrals</h1>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Shield className="w-3 h-3 text-blue-600" /> Administrative Transfer Registry
               </p>
            </div>
         </div>
         
         <div className="flex items-center gap-4 px-6">
            <Button variant="outline" className="h-14 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] bg-white border-gray-100 hover:bg-gray-50 transition-all">
               <Download className="w-4 h-4 mr-2 text-blue-600" />
               Export Logs
            </Button>
            <Button 
               onClick={() => router.push('/admin/referrals/new')}
               className="h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 transition-all active:scale-95 border-b-4 border-blue-800"
            >
               <Plus className="w-4 h-4 mr-2" />
               New Transfer Request
            </Button>
         </div>
      </div>

      {/* Stats QuickView */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
            { label: 'Pending Transfers', value: referrals.filter(r => r.status === 'PENDING').length, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
            { label: 'Active Missions', value: referrals.filter(r => r.status === 'ACCEPTED').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Activity },
            { label: 'Completed Today', value: referrals.filter(r => r.status === 'COMPLETED').length, color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle },
            { label: 'Rejected/Cancelled', value: referrals.filter(r => r.status === 'REJECTED').length, color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle }
         ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-[2rem] border border-transparent hover:border-gray-100 transition-all ${stat.bg} group`}>
               <div className="flex justify-between items-center mb-4">
                  <stat.icon className={`w-5 h-5 ${stat.color} opacity-60 group-hover:scale-110 transition-transform`} />
                  <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
         ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
               type="text" 
               placeholder="Search by Patient Name or Transfer ID..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 h-14 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-700 transition-all focus:bg-white"
            />
         </div>
         <div className="flex gap-4">
            <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest text-gray-400 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
            >
               <option value="">Filter Status</option>
               <option value="PENDING">Pending</option>
               <option value="ACCEPTED">Accepted</option>
               <option value="REJECTED">Rejected/Cancelled</option>
               <option value="COMPLETED">Completed</option>
            </select>
            <Button variant="outline" className="h-14 rounded-2xl px-6 bg-white border-gray-100">
               <Filter className="w-5 h-5 text-gray-400" />
            </Button>
         </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
         {isLoading ? (
            <div className="p-24 flex flex-col items-center gap-4">
               <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Querying Active Channels...</p>
            </div>
         ) : filteredReferrals.length === 0 ? (
            <div className="p-24 text-center">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ArrowRightLeft className="w-10 h-10 text-gray-200" />
               </div>
               <h3 className="text-xl font-black text-secondary mb-2">No Active Referrals</h3>
               <p className="text-sm text-gray-400 max-w-xs mx-auto">There are currently no inter-facility transfer requests in the system matching your criteria.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50 border-b border-gray-50">
                        <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mission ID</th>
                        <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient / Registry</th>
                        <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Facility Transit</th>
                        <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Status</th>
                        <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                        <th className="py-6 px-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {filteredReferrals.map((ref) => (
                        <tr key={ref.id} className="hover:bg-blue-50/30 transition-colors group">
                           <td className="py-6 px-8">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-8 bg-blue-500 rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
                                 <div>
                                    <p className="text-xs font-black text-secondary">{ref.trackingCode}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 flex items-center gap-1">
                                       <Clock className="w-3 h-3 text-blue-400" /> {format(new Date(ref.createdAt), 'dd MMM, HH:mm')}
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-6 px-8">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                                    {ref.patient?.fullName?.charAt(0) || 'P'}
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-secondary">{ref.patient?.fullName}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">UID: {ref.patient?.patientCode || 'N/A'}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-6 px-8">
                              <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                    <Building2 className="w-3.5 h-3.5 text-rose-400" />
                                    <p className="text-[11px] font-black text-secondary uppercase truncate max-w-[120px]">{ref.originFacility || 'Origin Unknown'}</p>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                                    <p className="text-[11px] font-black text-secondary uppercase truncate max-w-[120px]">{ref.destinationFacility || 'Dest. Pending'}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-6 px-8">
                              <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(ref.status)}`}>
                                 {ref.status}
                              </span>
                           </td>
                           <td className="py-6 px-8">
                              <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${ref.priority === 'CRITICAL' ? 'bg-red-500 animate-pulse' : ref.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                 <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{ref.priority || 'NORMAL'}</p>
                              </div>
                           </td>
                           <td className="py-6 px-8 text-right">
                              <div className="flex justify-end gap-2">
                                 <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                 </Button>
                                 <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                    <Edit className="w-4 h-4 text-gray-400" />
                                 </Button>
                                 <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-rose-400" />
                                 </Button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  )
}
