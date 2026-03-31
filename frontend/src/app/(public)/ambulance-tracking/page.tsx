'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Clock, Phone, User, Truck, CheckCircle, AlertCircle, Activity, Loader2, Navigation, Heart, Shield } from 'lucide-react'
import { emergencyRequestsService } from '@/lib/api'
import { format } from 'date-fns'

export default function AmbulanceTrackingPage() {
  const [trackingCode, setTrackingCode] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [trackingData, setTrackingData] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError('')
    
    if (!trackingCode.trim()) {
      setError('Please enter your unique tracking code')
      return
    }

    setIsTracking(true)

    try {
      const data = await emergencyRequestsService.getByTrackingCode(trackingCode.trim().toUpperCase())
      setTrackingData(data)
      if (!data) {
         setError('No active request found with this code. Please verify and try again.')
      }
    } catch (err: any) {
      console.error('Tracking error:', err)
      setError(err.response?.data?.message || 'Unable to retrieve tracking details. Please ensure the code is correct.')
      setTrackingData(null)
    } finally {
      setIsTracking(false)
    }
  }

  const getStatusStep = (status: string) => {
    const steps = ['PENDING', 'ASSIGNED', 'DISPATCHED', 'ON_SCENE', 'TRANSPORTING', 'ARRIVED_HOSPITAL', 'COMPLETED']
    return steps.indexOf(status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'ASSIGNED': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'DISPATCHED': return 'text-indigo-600 bg-indigo-50 border-indigo-200'
      case 'ON_SCENE': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'TRANSPORTING': return 'text-teal-600 bg-teal-50 border-teal-200'
      case 'ARRIVED_HOSPITAL': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'COMPLETED': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const steps = [
    { id: 'PENDING', label: 'Requested', icon: Clock },
    { id: 'ASSIGNED', label: 'Assigned', icon: User },
    { id: 'DISPATCHED', label: 'En Route', icon: Truck },
    { id: 'ON_SCENE', label: 'At Scene', icon: MapPin },
    { id: 'TRANSPORTING', label: 'In Transit', icon: Activity },
    { id: 'ARRIVED_HOSPITAL', label: 'Hospital', icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-12">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-red-50/50 to-transparent pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-bold mb-4 border border-red-200 animate-pulse">
            <Activity className="w-4 h-4" />
            <span>Aamin Live Tracking System</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Track Emergency <span className="text-red-600">Real-Time</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Monitor the status of your ambulance request with our high-precision dispatch tracking engine.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Navigation className="w-32 h-32 text-red-600" />
          </div>
          
          <form onSubmit={handleTrack} className="relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  placeholder="Enter Tracking Code (e.g. AAM-XXXXX)"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-xl font-bold tracking-wider placeholder:font-medium placeholder:text-gray-400 transition-all placeholder:tracking-normal"
                />
              </div>
              <button
                type="submit"
                disabled={isTracking}
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-3xl font-black text-lg shadow-xl shadow-red-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
              >
                {isTracking ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Track Unit'}
              </button>
            </div>
            {error && (
              <div className="mt-6 flex items-center space-x-2 text-red-600 font-bold bg-red-50 p-4 rounded-2xl border border-red-100">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-400 font-semibold flex items-center justify-center md:justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Secure encrypted tracking. Only you can access your status updates.
            </p>
          </form>
        </div>

        {/* Tracking Details */}
        {trackingData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            
            {/* Status Timeline Card */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
               <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Request Progress</h2>
                    <p className="text-gray-400 font-bold text-sm tracking-widest mt-1">CODE: {trackingData.trackingCode}</p>
                  </div>
                  <div className={`px-6 py-2 rounded-2xl border font-black text-sm tracking-widest uppercase ${getStatusColor(trackingData.status)}`}>
                    {trackingData.status.replace('_', ' ')}
                  </div>
               </div>

               {/* Modern Timeline Stepper */}
               <div className="relative pb-4">
                  <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 rounded-full hidden md:block" />
                  <div 
                    className="absolute top-6 left-0 h-1 bg-red-600 rounded-full transition-all duration-1000 hidden md:block" 
                    style={{ width: `${(getStatusStep(trackingData.status) / (steps.length - 1)) * 100}%` }}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative">
                    {steps.map((step, idx) => {
                      const isActive = getStatusStep(trackingData.status) >= idx
                      const isCurrent = getStatusStep(trackingData.status) === idx
                      return (
                        <div key={step.id} className="flex flex-col items-center text-center group">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 border-2 ${
                            isActive 
                              ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' 
                              : 'bg-white border-gray-100 text-gray-300'
                          } ${isCurrent ? 'ring-4 ring-red-100 ring-offset-2 animate-bounce-subtle' : ''}`}>
                            <step.icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                          </div>
                          <p className={`mt-4 text-xs font-black uppercase tracking-widest transition-colors ${
                            isActive ? 'text-red-700' : 'text-gray-300'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                 {/* Mission Details */}
                 <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                       <Heart className="w-12 h-12 text-red-100" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                       <Navigation className="w-6 h-6 mr-3 text-red-600" />
                       Service Details
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Pickup Point</p>
                             <p className="text-lg font-bold text-gray-900 flex items-start">
                                <MapPin className="w-5 h-5 mr-3 text-red-500 mt-0.5 flex-shrink-0" />
                                {trackingData.pickupLocation}
                             </p>
                             {trackingData.pickupLandmark && (
                               <p className="text-sm text-gray-400 font-medium ml-8 mt-1 italic">Near: {trackingData.pickupLandmark}</p>
                             )}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Destination</p>
                             <p className="text-lg font-bold text-gray-900 flex items-start">
                                <Navigation className="w-5 h-5 mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                {trackingData.destination || 'TBD (En Route Evaluation)'}
                             </p>
                          </div>
                       </div>
                       
                       <div className="space-y-6">
                          <div className="flex gap-10">
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Priority</p>
                                <span className={`inline-flex items-center px-4 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                                   trackingData.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' : 
                                   trackingData.priority === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                   'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                   {trackingData.priority}
                                </span>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Request Time</p>
                                <p className="text-lg font-black text-gray-900">{format(new Date(trackingData.createdAt), 'hh:mm a')}</p>
                             </div>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Patient Name</p>
                             <p className="text-lg font-bold text-gray-900 flex items-center">
                                <User className="w-5 h-5 mr-3 text-gray-400" />
                                {trackingData.patient?.fullName || 'Anonymous Service'}
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Request Log */}
                 {trackingData.statusLogs && trackingData.statusLogs.length > 0 && (
                   <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8">
                     <h3 className="text-xl font-black text-gray-900 mb-8">Activity History</h3>
                     <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                        {trackingData.statusLogs.map((log: any, idx: number) => (
                          <div key={log.id} className="relative pl-8 flex items-start gap-4 group">
                             <div className={`absolute left-0 top-1.5 w-[24px] h-[24px] rounded-full border-4 border-white z-10 transition-colors ${
                               idx === 0 ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'bg-gray-200'
                             }`} />
                             <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 group-hover:border-red-100 transition-all">
                                <div className="flex justify-between items-center mb-1">
                                   <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">Status Updated: {log.toStatus.replace('_', ' ')}</p>
                                   <p className="text-[10px] font-black text-gray-400">{format(new Date(log.createdAt), 'hh:mm a')}</p>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">{log.notes || `The request status has been moved to ${log.toStatus}`}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                   </div>
                 )}
              </div>

              {/* Right Column: Asset Details */}
              <div className="space-y-8">
                 {/* Unit Info */}
                 <div className="bg-[#1E293B] rounded-[2.5rem] shadow-2xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-all duration-700">
                       <Truck className="w-24 h-24 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-black text-white/50 uppercase tracking-[0.25em] mb-6">Assigned Asset</h3>
                    
                    {!trackingData.ambulance ? (
                      <div className="flex flex-col items-center py-6 text-center">
                         <Loader2 className="w-10 h-10 animate-spin text-white/20 mb-4" />
                         <p className="text-lg font-bold text-white/80">Pending Asset Assignment</p>
                         <p className="text-sm text-white/40 mt-1">Dispatcher is locating the nearest unit.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-3xl font-black tracking-tight">{trackingData.ambulance.ambulanceNumber}</p>
                               <div className="h-1 w-12 bg-red-500 mt-2" />
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl">
                               <Truck className="w-8 h-8 text-red-500" />
                            </div>
                         </div>
                         
                         <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                               <span className="text-white/40 text-xs font-black uppercase tracking-widest">Plate Number</span>
                               <span className="font-bold tracking-wider">{trackingData.ambulance.plateNumber}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                               <span className="text-white/40 text-xs font-black uppercase tracking-widest">Driver</span>
                               <span className="font-bold">{trackingData.driver ? `${trackingData.driver.firstName} ${trackingData.driver.lastName}` : 'Deploying Crew'}</span>
                            </div>
                            {trackingData.driver?.phone && (
                              <div className="flex justify-between items-center">
                                 <span className="text-white/40 text-xs font-black uppercase tracking-widest">Comms</span>
                                 <a href={`tel:${trackingData.driver.phone}`} className="flex items-center text-red-400 font-bold hover:text-red-300 transition-colors">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {trackingData.driver.phone}
                                 </a>
                              </div>
                            )}
                         </div>
                         
                         <div className="mt-4 pt-6">
                            <button className="w-full bg-white text-[#1E293B] py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-black/20">
                               Contact Dispatch Center
                            </button>
                         </div>
                      </div>
                    )}
                 </div>

                 {/* Safety Advice */}
                 <div className="bg-red-50 rounded-[2.5rem] border border-red-100 p-8">
                    <h3 className="text-lg font-black text-red-900 mb-4 flex items-center">
                       <AlertCircle className="w-5 h-5 mr-3" />
                       While you wait...
                    </h3>
                    <ul className="space-y-4">
                       {[
                         { text: "Stay calm and keep the patient in a stable position", icon: Heart },
                         { text: "Ensure the street address is visible if possible", icon: MapPin },
                         { text: "Gather patient identification and medical documents", icon: Shield },
                         { text: "Free up any access points for the medical team", icon: Navigation }
                       ].map((item, idx) => (
                         <li key={idx} className="flex items-start text-sm text-red-700 font-medium">
                            <div className="p-1.5 bg-red-100 rounded-lg mr-3 mt-0.5">
                               <item.icon className="w-3.5 h-3.5" />
                            </div>
                            {item.text}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
            </div>

          </div>
        )}

        {/* Informational Footer */}
        {!trackingData && !isTracking && (
           <div className="grid md:grid-cols-3 gap-6 mt-12 animate-in fade-in duration-1000 delay-300">
              <div className="bg-white/60 p-6 rounded-[2rem] border border-white/50 backdrop-blur-sm shadow-xl shadow-black/5 text-center">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Navigation className="w-6 h-6 text-red-600" />
                 </div>
                 <h4 className="text-sm font-black text-gray-900 uppercase mb-2">Live GPS</h4>
                 <p className="text-xs text-gray-400 font-medium">We use real-time GPS coordinates for unit tracking.</p>
              </div>
              <div className="bg-white/60 p-6 rounded-[2rem] border border-white/50 backdrop-blur-sm shadow-xl shadow-black/5 text-center">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Shield className="w-6 h-6 text-blue-600" />
                 </div>
                 <h4 className="text-sm font-black text-gray-900 uppercase mb-2">Encrypted Data</h4>
                 <p className="text-xs text-gray-400 font-medium">Patient privacy is protected with AES-256 encryption.</p>
              </div>
              <div className="bg-white/60 p-6 rounded-[2rem] border border-white/50 backdrop-blur-sm shadow-xl shadow-black/5 text-center">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Activity className="w-6 h-6 text-emerald-600" />
                 </div>
                 <h4 className="text-sm font-black text-gray-900 uppercase mb-2">24/7 Monitoring</h4>
                 <p className="text-xs text-gray-400 font-medium">Our central dispatch monitors every mission live.</p>
              </div>
           </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
