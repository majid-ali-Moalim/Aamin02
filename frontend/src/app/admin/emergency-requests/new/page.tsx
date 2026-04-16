// app/admin/emergency-requests/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Phone,
  MapPin,
  Clock,
  User,
  Truck,
  UserPlus,
  Activity,
  Shield,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Wind,
  Building2,
  ArrowLeft,
  Users,
  FileText,
  Navigation,
  AlertOctagon,
  ClipboardList,
  PhoneCall,
  Flag,
  Timer,
  LocateFixed,
  HeartPulse,
  CheckCircle,
  Info,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  emergencyRequestsService,
  patientsService,
  systemSetupService,
  ambulancesService,
  employeesService,
  hospitalsService
} from '@/lib/api';
import {
  Priority,
  RequestSource,
  Patient,
  IncidentCategory,
  Region,
  District,
  Ambulance,
  Employee,
} from '@/types';

export default function NewEmergencyRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [trackingTime, setTrackingTime] = useState('00:00:00');
  const [startTime] = useState(Date.now());

  // Master Data
  const [patients, setPatients] = useState<Patient[]>([]);
  const [categories, setCategories] = useState<IncidentCategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [drivers, setDrivers] = useState<Employee[]>([]);
  const [nurses, setNurses] = useState<Employee[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dispatch' | 'hospital' | 'resources'>('dispatch');

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    priority: Priority.CRITICAL,
    incidentCategoryId: '',
    requestSource: RequestSource.PHONE_CALL,
    regionId: '',
    districtId: '',
    pickupLocation: '',
    destination: '',
    destinationHospitalId: '',
    callerName: '',
    callerPhone: '',
    symptoms: '',
    pickupLandmark: '',
    destinationLandmark: '',
    patientCondition: '',
    consciousStatus: 'Conscious',
    breathingStatus: 'Normal',
    bleedingStatus: 'None',
    needsOxygen: false,
    needsStretcher: false,
    notes: '',
    manualDispatchNotes: '',
    ambulanceId: '',
    driverId: '',
    nurseId: '',
    newPatient: {
      fullName: '',
      age: '',
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      phone: '',
      alternatePhone: '',
      nationalityType: 'LOCAL' as const,
      country: 'Somalia',
      maritalStatus: 'UNKNOWN' as const,
    },
  });

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Date.now() - startTime;
      const h = Math.floor(diff / 3600000)
        .toString()
        .padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, '0');
      setTrackingTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Fetch Master Data
  useEffect(() => {
    const loadMasterData = async () => {
      setLoading(true);
      try {
        const [
          patientsRes,
          categoriesRes,
          regionsRes,
          districtsRes,
          ambulancesRes,
          driversRes,
          nursesRes,
          hospitalsRes,
        ] = await Promise.all([
          patientsService.getAll(),
          systemSetupService.getIncidentCategories(),
          systemSetupService.getRegions(),
          systemSetupService.getDistricts(),
          emergencyRequestsService.getAvailableAmbulances(),
          emergencyRequestsService.getAvailableDrivers(),
          emergencyRequestsService.getAvailableNurses(),
          hospitalsService.getAll(),
        ]);
        setPatients(patientsRes);
        setCategories(categoriesRes);
        setRegions(regionsRes);
        setDistricts(districtsRes);
        setAmbulances(ambulancesRes);
        setDrivers(driversRes);
        setNurses(nursesRes);
        setHospitals(hospitalsRes);
      } catch (err) {
        console.error('Failed to load master data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMasterData();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewPatient && (!formData.newPatient.fullName || !formData.newPatient.phone)) {
      return alert('Patient Name and Phone are mandatory');
    }
    if (!isNewPatient && !formData.patientId) {
      return alert('Existing Patient selection is required');
    }
    if (!formData.pickupLocation) {
      return alert('Pickup Location is required');
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        newPatient: isNewPatient
          ? {
              ...formData.newPatient,
              age: formData.newPatient.age ? parseInt(formData.newPatient.age) : undefined,
            }
          : undefined,
      };
      await emergencyRequestsService.create(payload);
      router.push('/admin/emergency-requests');
    } catch (error: any) {
      console.error('Dispatch error details:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown dispatch error';
      alert(`Failed to dispatch: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgeChange = (ageVal: string) => {
    const age = parseInt(ageVal);
    let dob = formData.newPatient.dateOfBirth;
    if (!isNaN(age) && age >= 0) {
      const year = new Date().getFullYear() - age;
      dob = `${year}-01-01`;
    }
    setFormData({
      ...formData,
      newPatient: { ...formData.newPatient, age: ageVal, dateOfBirth: dob },
    });
  };

  const handleDobChange = (dobVal: string) => {
    let age = formData.newPatient.age;
    if (dobVal) {
      const birthDate = new Date(dobVal);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      age = calculatedAge.toString();
    }
    setFormData({
      ...formData,
      newPatient: { ...formData.newPatient, dateOfBirth: dobVal, age },
    });
  };

  // Live hospital data securely pulled from the backend replacing static mock

  return (
    <div className="ecr-overlay">
    <div className="ecr-popup">
      {/* ========== HEADER ========== */}
      <header className="bg-gradient-to-r from-[#C62828] to-[#E53935] text-white sticky top-0 z-50 shadow-2xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* ← BACK ARROW */}
            <button
              type="button"
              onClick={() => router.back()}
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 transition-all duration-200 active:scale-90"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
                New Emergency Case
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal animate-pulse">LIVE</span>
              </h1>
              <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest">
                Aamin Ambulance Dispatch System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase opacity-60 tracking-wider">Tracking Time</span>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 shadow-inner">
                <Timer className="w-3.5 h-3.5" />
                <span className="text-xl font-black font-mono tracking-wider">{trackingTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#C62828]" />
              </div>
              <div className="text-xs font-bold">
                <div>Admin Console</div>
                <div className="text-[9px] opacity-70">Dispatcher: Ali Hassan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="bg-black/20 backdrop-blur-sm px-6 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Tracking Code: <span className="text-white/90 font-mono">EMR-2024-{Math.floor(Math.random() * 10000)}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Dispatch Time: <span className="text-white/90">{new Date().toLocaleString()}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="w-3.5 h-3.5" />
              <span>Incident ID: <span className="text-white/90 font-mono">INC-{Math.floor(Date.now() / 1000)}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>System Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>5 Units Available</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto">
        <form id="dispatchForm" onSubmit={handleCreateRequest} className="space-y-6">
          {/* ========== QUICK ACTION TABS ========== */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('dispatch')}
              className={`px-6 py-3 font-black text-xs uppercase tracking-wider rounded-t-lg transition-all ${
                activeTab === 'dispatch'
                  ? 'bg-white text-[#C62828] border-t-2 border-l border-r border-gray-200 border-b-0 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dispatch Console
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hospital')}
              className={`px-6 py-3 font-black text-xs uppercase tracking-wider rounded-t-lg transition-all ${
                activeTab === 'hospital'
                  ? 'bg-white text-[#C62828] border-t-2 border-l border-r border-gray-200 border-b-0 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Hospital Status
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-3 font-black text-xs uppercase tracking-wider rounded-t-lg transition-all ${
                activeTab === 'resources'
                  ? 'bg-white text-[#C62828] border-t-2 border-l border-r border-gray-200 border-b-0 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Fleet Management
            </button>
          </div>

          <div className="space-y-6">
            {/* ========== ROW 1: PATIENT + EMERGENCY ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PATIENT INFORMATION CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="font-black text-gray-700 uppercase tracking-wider text-sm">
                      Patient Information
                    </h2>
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    HIPAA Compliant
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setIsNewPatient(true)}
                      className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
                        isNewPatient
                          ? 'bg-[#1E293B] text-white shadow-lg'
                          : 'text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      New Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNewPatient(false)}
                      className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
                        !isNewPatient
                          ? 'bg-[#1E293B] text-white shadow-lg'
                          : 'text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Existing Patient
                    </button>
                  </div>

                  {isNewPatient ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Patient legal name"
                          value={formData.newPatient.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newPatient: { ...formData.newPatient, fullName: e.target.value },
                            })
                          }
                          className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                          Gender
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                newPatient: { ...formData.newPatient, gender: 'MALE' },
                              })
                            }
                            className={`h-12 flex items-center justify-center gap-2 border rounded-xl font-bold transition-all ${
                              formData.newPatient.gender === 'MALE'
                                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            <User className="w-4 h-4" /> Male
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                newPatient: { ...formData.newPatient, gender: 'FEMALE' },
                              })
                            }
                            className={`h-12 flex items-center justify-center gap-2 border rounded-xl font-bold transition-all ${
                              formData.newPatient.gender === 'FEMALE'
                                ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm'
                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            <User className="w-4 h-4" /> Female
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                          Age / DOB
                        </label>
                        <div className="flex h-12 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                          <input
                            type="number"
                            placeholder="Age"
                            value={formData.newPatient.age}
                            onChange={(e) => handleAgeChange(e.target.value)}
                            className="w-1/2 bg-transparent px-4 font-bold outline-none text-center"
                          />
                          <span className="bg-gray-200 px-3 flex items-center text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                            Yrs
                          </span>
                          <input
                            type="date"
                            value={formData.newPatient.dateOfBirth}
                            onChange={(e) => handleDobChange(e.target.value)}
                            className="w-1/2 bg-transparent px-2 font-bold outline-none text-[11px]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                          Blood Group
                        </label>
                        <select
                          value={formData.newPatient.bloodType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newPatient: { ...formData.newPatient, bloodType: e.target.value },
                            })
                          }
                          className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select</option>
                          <option value="O_POSITIVE">O+</option>
                          <option value="O_NEGATIVE">O-</option>
                          <option value="A_POSITIVE">A+</option>
                          <option value="A_NEGATIVE">A-</option>
                          <option value="B_POSITIVE">B+</option>
                          <option value="B_NEGATIVE">B-</option>
                          <option value="AB_POSITIVE">AB+</option>
                          <option value="AB_NEGATIVE">AB-</option>
                        </select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex h-12 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-100">
                          <span className="bg-gray-200 px-4 flex items-center text-[11px] font-black text-blue-800 border-r border-gray-200">
                            +252
                          </span>
                          <input
                            type="text"
                            placeholder="61XXXXXXX"
                            value={formData.newPatient.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                newPatient: { ...formData.newPatient, phone: e.target.value },
                              })
                            }
                            className="w-full bg-transparent px-4 font-bold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Search Patient Registry
                      </label>
                      <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
                        <select
                          value={formData.patientId}
                          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                          className="w-full h-12 pl-12 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none appearance-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">-- Select existing patient --</option>
                          {patients.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.fullName} ({p.phone})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wide">
                          Loading patient data will auto-fill medical history
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* EMERGENCY DETAILS CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                      <AlertOctagon className="w-4 h-4 text-red-600" />
                    </div>
                    <h2 className="font-black text-gray-700 uppercase tracking-wider text-sm">
                      Emergency Details
                    </h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-red-500 uppercase">CRITICAL PRIORITY</span>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Incident Category
                      </label>
                      <select
                        value={formData.incidentCategoryId}
                        onChange={(e) =>
                          setFormData({ ...formData, incidentCategoryId: e.target.value })
                        }
                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: Priority.CRITICAL, label: 'CRIT', color: 'bg-red-600', text: 'text-white', icon: AlertTriangle },
                          { id: Priority.HIGH, label: 'HIGH', color: 'bg-orange-500', text: 'text-white', icon: Flag },
                          { id: Priority.MEDIUM, label: 'MED', color: 'bg-yellow-400', text: 'text-gray-800', icon: Clock },
                          { id: Priority.LOW, label: 'LOW', color: 'bg-green-500', text: 'text-white', icon: CheckCircle },
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: p.id })}
                            className={`flex flex-col items-center justify-center py-2.5 rounded-xl font-black uppercase tracking-tighter transition-all duration-300 ${
                              formData.priority === p.id
                                ? `${p.color} ${p.text} shadow-lg scale-105`
                                : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'
                            }`}
                          >
                            <p.icon className={`w-4 h-4 mb-0.5 ${formData.priority === p.id ? 'opacity-100' : 'opacity-40'}`} />
                            <span className="text-[9px]">{p.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" /> Condition Summary
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe main patient condition, symptoms, and injury mechanism..."
                      value={formData.patientCondition}
                      onChange={(e) => setFormData({ ...formData, patientCondition: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Conscious
                      </label>
                      <select
                        value={formData.consciousStatus}
                        onChange={(e) => setFormData({ ...formData, consciousStatus: e.target.value })}
                        className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-2 font-bold text-xs focus:ring-2 focus:ring-blue-100"
                      >
                        <option>Conscious</option>
                        <option>Semi-Conscious</option>
                        <option>Unconscious</option>
                        <option>Agitated</option>
                        <option>Sedated</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Breathing
                      </label>
                      <select
                        value={formData.breathingStatus}
                        onChange={(e) => setFormData({ ...formData, breathingStatus: e.target.value })}
                        className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-2 font-bold text-xs focus:ring-2 focus:ring-blue-100"
                      >
                        <option>Normal</option>
                        <option>Difficult</option>
                        <option>Labored</option>
                        <option>O2 Dependency</option>
                        <option>Arrest</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Bleeding
                      </label>
                      <select
                        value={formData.bleedingStatus}
                        onChange={(e) => setFormData({ ...formData, bleedingStatus: e.target.value })}
                        className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-2 font-bold text-xs focus:ring-2 focus:ring-blue-100"
                      >
                        <option>None</option>
                        <option>Mild</option>
                        <option>Moderate</option>
                        <option>Major</option>
                        <option>Uncontrolled</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Triage
                      </label>
                      <select className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-2 font-bold text-xs focus:ring-2 focus:ring-blue-100">
                        <option>P1 - Immediate</option>
                        <option>P2 - Delayed</option>
                        <option>P3 - Minor</option>
                        <option>P4 - Expectant</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== ROW 2: PICKUP LOCATION + HOSPITAL STATUS ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PICKUP LOCATION CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="font-black text-gray-700 uppercase tracking-wider text-sm">
                      Pickup Location
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Region
                      </label>
                      <select
                        value={formData.regionId}
                        onChange={(e) =>
                          setFormData({ ...formData, regionId: e.target.value, districtId: '' })
                        }
                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select Region</option>
                        {regions.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        District
                      </label>
                      <select
                        value={formData.districtId}
                        onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                        disabled={!formData.regionId}
                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold disabled:opacity-50 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select District</option>
                        {districts
                          .filter((d) => d.regionId === formData.regionId)
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="Building or landmark"
                        value={formData.pickupLocation}
                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                        <User className="w-3 h-3" /> Caller Name
                      </label>
                      <input
                        type="text"
                        placeholder="Caller full name"
                        value={formData.callerName}
                        onChange={(e) => setFormData({ ...formData, callerName: e.target.value })}
                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" /> Caller Phone
                      </label>
                      <div className="flex h-12 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-100">
                        <span className="bg-gray-200 px-3 flex items-center text-[10px] font-black text-blue-800">
                          +252
                        </span>
                        <input
                          type="text"
                          placeholder="61XXXXXXX"
                          value={formData.callerPhone}
                          onChange={(e) => setFormData({ ...formData, callerPhone: e.target.value })}
                          className="w-full bg-transparent px-4 font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-800 uppercase">GPS Coordinates</span>
                    </div>
                    <button type="button" className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1">
                      <LocateFixed className="w-3 h-3" /> Get Current Location
                    </button>
                  </div>
                </div>
              </div>

              {/* HOSPITAL STATUS CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <h2 className="font-black text-gray-700 uppercase tracking-wider text-sm">
                      Hospital Status & Selection
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {hospitals.map((h, i) => (
                    <div
                      key={h.id}
                      onClick={() => setFormData({ ...formData, destinationHospitalId: h.id, destination: h.name })}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        formData.destinationHospitalId === h.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full bg-${h.color || 'blue'}-500`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-sm text-gray-800">{h.name}</p>
                            {h.erReady && (
                              <span className="text-[8px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                ER Ready
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-[9px] text-gray-500 uppercase tracking-tight">{h.region?.name || 'N/A'}</p>
                            <p className="text-[9px] font-bold text-gray-600">{h.beds} beds available</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                          h.status === 'Available'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : h.status === 'Full'
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : 'bg-orange-100 text-orange-700 border-orange-200'
                        }`}
                      >
                        {h.status === 'Available' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : h.status === 'Full' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {h.status}
                      </div>
                    </div>
                  ))}
                  {hospitals.length === 0 && (
                    <div className="w-full mt-2 py-8 border-2 border-dashed border-gray-200 rounded-xl text-[11px] font-black text-gray-400 uppercase tracking-wider flex items-center justify-center">
                      No hospitals found in directory
                    </div>
                  )}
                  <button
                    type="button"
                    className="w-full mt-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Request Alternative Hospital
                  </button>
                </div>
              </div>
            </div>

            {/* ========== ROW 3: RESOURCES + SUPPORT ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* RESOURCE ASSIGNMENT CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Truck className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h2 className="font-black text-gray-700 uppercase tracking-wider text-sm">
                      Resource Assignment
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Ambulance Unit
                      </label>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded tracking-tighter uppercase">
                        {ambulances.length} units ready
                      </span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                      {ambulances.length === 0 && (
                        <div className="flex-1 flex items-center justify-center h-20 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-[10px] text-gray-400 font-black uppercase tracking-wider">
                          No units available
                        </div>
                      )}
                      {ambulances.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => setFormData({ ...formData, ambulanceId: a.id })}
                          className={`min-w-[150px] p-3 border-2 rounded-xl cursor-pointer transition-all flex-shrink-0 ${
                            formData.ambulanceId === a.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-inner scale-[0.98]'
                              : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Truck className={`w-7 h-7 ${formData.ambulanceId === a.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
                              <span className="text-[8px] font-black text-green-600 uppercase">Active</span>
                            </div>
                          </div>
                          <p className="font-black text-sm text-gray-900 leading-none">{a.ambulanceNumber}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            {a.region?.name || 'In Station'}
                          </p>
                          <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-green-500 rounded-full" />
                          </div>
                          <p className="text-[8px] font-bold text-gray-400 mt-1">Fuel: 75%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                        <User className="w-3 h-3" /> Driver
                      </label>
                      <select
                        value={formData.driverId}
                        onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select Driver</option>
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.firstName} {d.lastName}
                          </option>
                        ))}
                      </select>
                      {formData.driverId && (
                        <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-blue-200 font-black text-blue-800 text-xs uppercase shadow-sm">
                            {drivers.find((d) => d.id === formData.driverId)?.firstName?.charAt(0)}
                          </div>
                          <p className="font-black text-xs text-blue-900 flex-1 leading-none">
                            {drivers.find((d) => d.id === formData.driverId)?.firstName}{' '}
                            {drivers.find((d) => d.id === formData.driverId)?.lastName}
                          </p>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                        <HeartPulse className="w-3 h-3" /> Medic / Nurse
                      </label>
                      <select
                        value={formData.nurseId}
                        onChange={(e) => setFormData({ ...formData, nurseId: e.target.value })}
                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select Nurse/Medic</option>
                        {nurses.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.firstName} {n.lastName}
                          </option>
                        ))}
                      </select>
                      {formData.nurseId && (
                        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-xl">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-red-200 font-black text-red-800 text-xs uppercase shadow-sm">
                            {nurses.find((n) => n.id === formData.nurseId)?.firstName?.charAt(0)}
                          </div>
                          <p className="font-black text-xs text-red-900 flex-1 leading-none">
                            {nurses.find((n) => n.id === formData.nurseId)?.firstName}{' '}
                            {nurses.find((n) => n.id === formData.nurseId)?.lastName}
                          </p>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SUPPORT REQUIREMENTS CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                    </div>
                    <h2 className="font-black text-gray-700 uppercase tracking-wider text-sm">
                      Support Requirements
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer group hover:border-teal-300 transition-all">
                      <div
                        onClick={() => setFormData({ ...formData, needsOxygen: !formData.needsOxygen })}
                        className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          formData.needsOxygen
                            ? 'bg-teal-600 border-teal-600'
                            : 'bg-white border-gray-300 group-hover:border-teal-400'
                        }`}
                      >
                        {formData.needsOxygen && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <span className="font-black text-gray-700 uppercase text-xs tracking-wider block flex items-center gap-1">
                          <Wind className="w-3.5 h-3.5" /> Oxygen Tank
                        </span>
                        <span className="text-[9px] text-gray-400">Supplemental O2 required</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer group hover:border-teal-300 transition-all">
                      <div
                        onClick={() => setFormData({ ...formData, needsStretcher: !formData.needsStretcher })}
                        className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          formData.needsStretcher
                            ? 'bg-teal-600 border-teal-600'
                            : 'bg-white border-gray-300 group-hover:border-teal-400'
                        }`}
                      >
                        {formData.needsStretcher && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <span className="font-black text-gray-700 uppercase text-xs tracking-wider block flex items-center gap-1">
                          <HeartPulse className="w-3.5 h-3.5" /> Stretcher
                        </span>
                        <span className="text-[9px] text-gray-400">Patient transport bed</span>
                      </div>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Mission Special Notes
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Special instructions for the dispatch team, patient notes, or scene information..."
                      value={formData.manualDispatchNotes}
                      onChange={(e) => setFormData({ ...formData, manualDispatchNotes: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-bold outline-none resize-none focus:bg-white focus:ring-2 focus:ring-blue-100 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== ACTION FOOTER ========== */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-10 text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Case Priority: {formData.priority}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${formData.ambulanceId ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span>Assignment: {formData.ambulanceId ? 'Unit Assigned' : 'Awaiting Unit'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>ETA: Calculating...</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => router.back()}
                className="h-14 px-8 bg-white border-2 border-gray-200 text-gray-700 font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-14 px-8 bg-[#1E293B] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#0F172A] transition-all shadow-md"
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                form="dispatchForm"
                disabled={isSubmitting}
                className="h-14 px-10 bg-gradient-to-r from-[#C62828] to-[#E53935] text-white font-black uppercase tracking-wider text-base rounded-xl hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    Dispatch Now
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span>Case Status: <span className="text-orange-500">PENDING</span></span>
              <span>Assignment Status: <span className={formData.ambulanceId ? 'text-green-500' : 'text-red-500'}>
                {formData.ambulanceId ? 'ASSIGNED' : 'NOT ASSIGNED'}
              </span></span>
              <span>Active Session: <span className="text-blue-500">LIVE</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>System Synchronized</span>
            </div>
          </div>
        </form>
      </main>

      <style jsx global>{`
        /* ===== FULL-SCREEN POPUP OVERLAY ===== */
        .ecr-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: ecr-fade-in 0.3s ease-out;
        }

        .ecr-popup {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: #F0F2F5;
          overflow-y: auto;
          overflow-x: hidden;
          animation: ecr-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        @keyframes ecr-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes ecr-slide-up {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Smooth scroll inside popup */
        .ecr-popup::-webkit-scrollbar {
          width: 8px;
        }
        .ecr-popup::-webkit-scrollbar-track {
          background: transparent;
        }
        .ecr-popup::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.15);
          border-radius: 10px;
        }
        .ecr-popup::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.25);
        }

        /* Custom scrollbar for horizontal lists */
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }

        /* Disable body scroll when popup is open */
        body {
          overflow: hidden !important;
        }
      `}</style>
    </div>
    </div>
  );
}