'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { CheckCircle, Globe, User, Phone, Calendar, MapPin, Navigation, Landmark, MessageSquare, Languages, AlertTriangle, Truck } from 'lucide-react'
import { emergencyRequestsService, systemSetupService } from '@/lib/api'

// Simple interface mapping
export default function HireAmbulancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [caseId, setCaseId] = useState('')

  const [regions, setRegions] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  
  const [stations, setStations] = useState<any[]>([])
  const [ambulances, setAmbulances] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [nurses, setNurses] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      isPatient: '',
      callerName: '',
      callerPhone: '',
      callerRelationship: '',
      patientName: '',
      gender: '',
      estimatedAge: '',
      dateOfBirth: '',
      bloodGroup: '',
      medicalStatus: '',
      hospitalStatus: '',
      nationalityType: '',
      country: '',
      emergencyType: '',
      conditionDescription: '',
      consciousStatus: '',
      breathingStatus: '',
      regionId: '',
      districtId: '',
      areaId: '',
      landmarkDescription: '',
      additionalDirections: '',
      preferredLanguage: '',
      specialInstructions: '',
      requestType: 'EMERGENCY',
      consent: false,
      stationId: '',
      ambulanceId: '',
      driverId: '',
      nurseId: ''
    }
  })

  const watchedIsPatient = watch('isPatient')
  const watchedNationality = watch('nationalityType')
  const watchedRegionId = watch('regionId')
  const watchedDistrictId = watch('districtId')
  const watchedConsent = watch('consent')

  // Load Regions and Dispatch Availability
  useEffect(() => {
    systemSetupService.getRegions().then(setRegions).catch(console.error)
    systemSetupService.getStations().then(setStations).catch(console.error)
    emergencyRequestsService.getAvailableAmbulances().then(setAmbulances).catch(console.error)
    emergencyRequestsService.getAvailableDrivers().then(setDrivers).catch(console.error)
    emergencyRequestsService.getAvailableNurses().then(setNurses).catch(console.error)
  }, [])

  // Load Districts when Region changes
  useEffect(() => {
    if (watchedRegionId) {
      systemSetupService.getDistricts(watchedRegionId).then(setDistricts).catch(console.error)
      setValue('districtId', '')
      setValue('areaId', '')
    } else {
      setDistricts([])
    }
  }, [watchedRegionId, setValue])

  // Load Areas when District changes
  useEffect(() => {
    if (watchedDistrictId) {
      systemSetupService.getAreas(watchedDistrictId).then(setAreas).catch(console.error)
      setValue('areaId', '')
    } else {
      setAreas([])
    }
  }, [watchedDistrictId, setValue])

  const onSubmit = async (data: any) => {
    if (!watchedConsent) {
      toast.error('You must consent to proceed')
      return
    }

    setLoading(true)
    try {
      // Map form based on YES/NO logic
      const finalCallerName = data.isPatient === 'YES' ? data.patientName : (data.callerName || 'Unknown Caller')
      const finalRelationship = data.isPatient === 'YES' ? 'SELF' : (data.callerRelationship || 'OTHER')
      
      const finalGender = data.isPatient === 'YES' ? 'UNKNOWN' : (data.gender === 'Other' ? 'UNKNOWN' : data.gender || 'UNKNOWN')
      const finalAge = data.isPatient === 'YES' ? 0 : (Number(data.estimatedAge) || 0)
      const finalCountry = data.nationalityType === 'LOCAL' ? 'Somalia' : (data.country || 'Unknown')

      const payload = {
        callerName: finalCallerName,
        callerPhone: data.callerPhone,
        callerAltPhone: '', 
        callerRelationship: finalRelationship,

        newPatient: {
          fullName: data.patientName,
          gender: finalGender,
          age: finalAge,
          maritalStatus: 'UNKNOWN',
          nationalityType: data.nationalityType,
          country: finalCountry,
          phone: data.callerPhone
        },

        patientCondition: data.conditionDescription,
        consciousStatus: data.consciousStatus,
        breathingStatus: data.breathingStatus,
        priority: 'HIGH', // Default priority or extract from logic if needed

        regionId: data.regionId,
        districtId: data.districtId,
        areaId: data.areaId,
        pickupLocation: data.landmarkDescription,
        pickupLandmark: data.landmarkDescription,
        notes: `Directions: ${data.additionalDirections || 'N/A'}\nLanguage: ${data.preferredLanguage}\nSpecial Instructions: ${data.specialInstructions || 'None'}\nRequest Type: ${data.requestType}`,

        ambulanceId: data.ambulanceId,
        driverId: data.driverId,
        nurseId: data.nurseId,
        
        requestSource: 'ONLINE'
      }

      const response = await emergencyRequestsService.create(payload)
      setCaseId(response.trackingCode)
      setSuccess(true)
      toast.success('Ambulance request created successfully!')
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded p-8 shadow text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Transmitted</h1>
          <p className="text-gray-600 mb-6 font-medium">Your emergency protocol has been logged into the Aamin Command System.</p>

          <div className="bg-red-50 rounded p-6 mb-6">
            <p className="text-sm font-bold text-red-600 uppercase mb-1">System Case Record</p>
            <p className="text-2xl font-black text-red-700">{caseId}</p>
          </div>

          <button onClick={() => router.push('/')} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded shadow">
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Ambulance Availability Status */}
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700">🚑 Ambulance Available</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 border border-gray-300 space-y-6">
          
          {/* STEP 1: Identity */}
          <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">🧩 STEP 1: Identity (Core Control)</h2>
            <label className="block font-medium text-gray-700 mb-2">Are you the patient?*</label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="YES" {...register('isPatient')} className="w-5 h-5 text-blue-600" required />
                <span className="text-gray-800">Yes, I am the patient</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="NO" {...register('isPatient')} className="w-5 h-5 text-blue-600" required />
                <span className="text-gray-800">No, I am requesting for someone else</span>
              </label>
            </div>
          </section>

          {/* STEP 2: Patient Information */}
          <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">🧍 STEP 2: Patient Information</h2>
            
            {watchedIsPatient === 'YES' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Patient Name*</label>
                  <input {...register('patientName')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Phone Number*</label>
                  <input {...register('callerPhone')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Date of Birth*</label>
                  <input type="date" {...register('dateOfBirth')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Blood Group*</label>
                  <select {...register('bloodGroup')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Medical Status*</label>
                  <select {...register('medicalStatus')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                    <option value="">Select Medical Status</option>
                    <option value="STABLE">Stable</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="SERIOUS">Serious</option>
                    <option value="FAIR">Fair</option>
                  </select>
                </div>
              </div>
            )}

            {watchedIsPatient === 'NO' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">👤 Caller Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Caller Name*</label>
                      <input {...register('callerName')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Relationship to Patient*</label>
                      <select {...register('callerRelationship')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                        <option value="">Select</option>
                        <option value="FAMILY">Family</option>
                        <option value="FRIEND">Friend</option>
                        <option value="WITNESS">Witness</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">🧍 Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block mb-1 font-medium text-gray-700">Patient Name*</label>
                      <input {...register('patientName')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Gender*</label>
                      <select {...register('gender')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Estimated Age*</label>
                      <input type="number" {...register('estimatedAge')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Date of Birth*</label>
                      <input type="date" {...register('dateOfBirth')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Blood Group*</label>
                      <select {...register('bloodGroup')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Phone Number*</label>
                      <input {...register('callerPhone')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Medical Status*</label>
                      <select {...register('medicalStatus')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                        <option value="">Select Medical Status</option>
                        <option value="STABLE">Stable</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="SERIOUS">Serious</option>
                        <option value="FAIR">Fair</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* STEP 3: Nationality */}
          <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">🌍 STEP 3: Nationality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Nationality Type*</label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="LOCAL" {...register('nationalityType')} className="w-5 h-5 text-blue-600" required />
                    <span className="text-gray-800">Local (Somali Citizen 🇸🇴)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="INTERNATIONAL" {...register('nationalityType')} className="w-5 h-5 text-blue-600" required />
                    <span className="text-gray-800">International 🌍</span>
                  </label>
                </div>
              </div>
              
              {watchedNationality === 'INTERNATIONAL' && (
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Country* (Dropdown)</label>
                  <select {...register('country')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                    <option value="">Select Country</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* STEP 4: Emergency Details */}
          <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">🚨 STEP 4: Emergency Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">Emergency Type*</label>
                <select {...register('emergencyType')} className="w-full md:w-1/2 border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                  <option value="">Select Type</option>
                  <option value="ACCIDENT">Accident</option>
                  <option value="CARDIAC">Heart Problem</option>
                  <option value="TRAUMA">Injury</option>
                  <option value="PREGNANCY">Pregnancy</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">What happened?* (Description)</label>
                <textarea {...register('conditionDescription')} rows={3} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required></textarea>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Is the patient conscious?*</label>
                <select {...register('consciousStatus')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                  <option value="">Select</option>
                  <option value="CONSCIOUS">Yes</option>
                  <option value="UNCONSCIOUS">No</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-gray-700">Is the patient breathing?*</label>
                <select {...register('breathingStatus')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                  <option value="">Select</option>
                  <option value="NORMAL">Normal</option>
                  <option value="DIFFICULTY">Difficulty</option>
                  <option value="NOT_BREATHING">Not Breathing</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Hospital Status*</label>
                <select {...register('hospitalStatus')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                  <option value="">Select Status</option>
                  <option value="NOT_ADMITTED">Not Admitted</option>
                  <option value="ADMITTED">Admitted</option>
                  <option value="DISCHARGED">Discharged</option>
                  <option value="TRANSFERRED">Transferred</option>
                </select>
              </div>
            </div>
          </section>

          {/* STEP 5: Location Information */}
          <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">📍 STEP 5: Location Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Region*</label>
                <select {...register('regionId')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                  <option value="">Select Region</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">District*</label>
                <select {...register('districtId')} disabled={!watchedRegionId} className="w-full border border-gray-300 p-2 rounded bg-white disabled:bg-gray-100 outline-none focus:border-blue-500" required>
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Area / Sub-area*</label>
                <select {...register('areaId')} disabled={!watchedDistrictId} className="w-full border border-gray-300 p-2 rounded bg-white disabled:bg-gray-100 outline-none focus:border-blue-500" required>
                  <option value="">Select Area</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Landmark* (very important)</label>
                <input {...register('landmarkDescription')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" required />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">Additional Directions (optional)</label>
                <textarea {...register('additionalDirections')} rows={2} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500"></textarea>
              </div>
            </div>
          </section>

          {/* STEP 6: Communication */}
          <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">🌐 STEP 6: Communication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Preferred Language*</label>
                <select {...register('preferredLanguage')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                  <option value="">Select</option>
                  <option value="SOMALI">Somali</option>
                  <option value="ENGLISH">English</option>
                  <option value="ARABIC">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Special Instructions (optional)</label>
                <input {...register('specialInstructions')} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500" />
              </div>
            </div>
          </section>

          {/* STEP 7: Dispatch Assignment */}
          <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">🚑 STEP 7: Dispatch Assignment (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Station</label>
                <select {...register('stationId')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500">
                  <option value="">Auto-Assign</option>
                  {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Ambulance Unit</label>
                <select {...register('ambulanceId')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500">
                  <option value="">Select Ambulance</option>
                  {ambulances.map(a => <option key={a.id} value={a.id}>{a.ambulanceNumber} - {a.plateNumber}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Driver</label>
                <select {...register('driverId')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500">
                  <option value="">Select Driver</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.user?.username || d.phone}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Nurse</label>
                <select {...register('nurseId')} className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500">
                  <option value="">Select Nurse</option>
                  {nurses.map(n => <option key={n.id} value={n.id}>{n.user?.username || n.phone}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* STEP 8: Final */}
          <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">⚙️ STEP 8: Final Confirmation</h2>
             <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Request Type*</label>
                <select {...register('requestType')} className="w-full md:w-1/2 border border-gray-300 p-2 rounded bg-white outline-none focus:border-blue-500" required>
                  <option value="">Select Type</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="NON_EMERGENCY">Non-Emergency</option>
                </select>
              </div>
              
              <div className="flex items-start gap-3 mt-4">
                 <input
                   type="checkbox"
                   id="consentCheck"
                   {...register('consent')}
                   className="mt-1 w-5 h-5 cursor-pointer text-blue-600 border-gray-300 rounded"
                 />
                 <label htmlFor="consentCheck" className="text-sm font-medium text-gray-800 cursor-pointer">
                  ✔ I confirm this is a real emergency request
                 </label>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                👉 {loading ? 'Processing...' : 'Request Ambulance'}
              </button>
            </div>
          </section>
         </form>
       </div>
     </div>
   )
 }
