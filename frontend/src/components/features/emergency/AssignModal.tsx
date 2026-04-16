import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  User, 
  UserPlus, 
  CheckCircle, 
  Trash2, 
  Filter,
  Loader2,
  HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { emergencyRequestsService } from '@/lib/api';
import { EmergencyRequest, Ambulance, Employee } from '@/types';

interface AssignModalProps {
  request: EmergencyRequest;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignModal: React.FC<AssignModalProps> = ({ request, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingUnits, setIsFetchingUnits] = useState(false);
  const [availableAmbulances, setAvailableAmbulances] = useState<Ambulance[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<Employee[]>([]);
  const [availableNurses, setAvailableNurses] = useState<Employee[]>([]);
  
  const [assignmentParams, setAssignmentParams] = useState({
    ambulanceId: '',
    driverId: '',
    nurseId: '',
  });

  const fetchUnits = async () => {
    try {
      setIsFetchingUnits(true);
      const [ambulances, drivers, nurses] = await Promise.all([
        emergencyRequestsService.getAvailableAmbulances(),
        emergencyRequestsService.getAvailableDrivers(),
        emergencyRequestsService.getAvailableNurses()
      ]);
      setAvailableAmbulances(ambulances);
      setAvailableDrivers(drivers);
      setAvailableNurses(nurses);
      
      // Auto-select first available if none selected
      if (drivers.length > 0 && !assignmentParams.driverId) {
        setAssignmentParams(prev => ({ 
          ...prev, 
          driverId: drivers[0].id,
          ambulanceId: drivers[0].assignedAmbulanceId || ''
        }));
      }
    } catch (err) {
      console.error('Failed to fetch available units:', err);
    } finally {
      setIsFetchingUnits(false);
    }
  };

  useEffect(() => {
    fetchUnits();
    const interval = setInterval(fetchUnits, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async () => {
    if (!assignmentParams.driverId) {
      return alert('Please select a driver');
    }

    const selectedDriver = availableDrivers.find(d => d.id === assignmentParams.driverId);
    const ambulanceId = selectedDriver?.assignedAmbulanceId || assignmentParams.ambulanceId;

    if (!ambulanceId) {
      return alert('No ambulance assigned. Please select an ambulance or a driver with an assigned ambulance.');
    }

    try {
      setIsSubmitting(true);
      await emergencyRequestsService.assignAmbulance(
        request.id,
        ambulanceId,
        assignmentParams.driverId,
        assignmentParams.nurseId
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(`Assignment failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDriver = availableDrivers.find(d => d.id === assignmentParams.driverId);
  const selectedNurse = availableNurses.find(n => n.id === assignmentParams.nurseId);

  return (
    <div className="fixed inset-0 bg-[#0F172A]/95 flex justify-center items-center z-[110] transition-all duration-500 p-4">
      <div className="bg-[#F8FAFC] w-full max-w-[950px] border-4 border-[#1E293B] shadow-[0_0_50px_rgba(30,41,59,0.8)] overflow-hidden flex flex-col h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#1E293B] p-6 flex items-center justify-between border-b-4 border-[#EF4444]">
          <div className="flex items-center gap-4">
            <div className="bg-[#EF4444] p-3 border border-red-300">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-widest uppercase italic leading-none">Execute Unit Assignment</h2>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject Code</span>
                <span className="text-[12px] font-black text-white bg-blue-600 px-2 leading-tight uppercase border border-blue-400">{request.trackingCode}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bg-gray-800 border-2 border-gray-600 p-2 hover:bg-red-600 hover:border-red-400 text-white transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-white custom-scrollbar">
          
          {/* Smart Suggestion Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500" />
              <h3 className="text-[11px] font-black text-[#1E293B] uppercase tracking-[0.2em]">Tactical Suggestion</h3>
            </div>
            <div className="bg-[#F8FAFC] border-2 border-blue-200 p-6 relative overflow-hidden group rounded-lg">
              <Truck className="absolute -bottom-10 -right-10 w-48 h-48 text-blue-100 opacity-50 rotate-12 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-3xl font-black text-[#1E293B] uppercase tracking-tighter">
                      {selectedDriver?.assignedAmbulance?.ambulanceNumber || 'SEARCHING...'}
                    </h4>
                    <span className="bg-green-100 text-green-700 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-green-300">Available Asset</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-1 inline-block">Primary Operator</p>
                    <p className="font-black text-[#1E293B] text-lg">
                      {selectedDriver ? `${selectedDriver.firstName} ${selectedDriver.lastName}` : 'No driver selected'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase tracking-widest bg-white p-4 border-2 border-gray-200 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-gray-400">Destination</p>
                    <p className="text-red-600 truncate max-w-[150px]">{request.pickupLocation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400">Priority</p>
                    <p className="text-black">{request.priority}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Driver Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500" />
                <h3 className="text-[11px] font-black text-[#1E293B] uppercase tracking-[0.2em] flex-1">Select Driver</h3>
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {isFetchingUnits && availableDrivers.length === 0 ? (
                  <div className="h-24 flex items-center justify-center font-black text-gray-400 uppercase tracking-widest text-[10px]">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Scanning grid...
                  </div>
                ) : availableDrivers.length === 0 ? (
                  <div className="h-24 flex items-center justify-center font-black text-red-400 uppercase tracking-widest text-[10px]">
                    No drivers available
                  </div>
                ) : availableDrivers.map(driver => (
                  <div
                    key={driver.id}
                    onClick={() => setAssignmentParams(prev => ({ ...prev, driverId: driver.id, ambulanceId: driver.assignedAmbulanceId || prev.ambulanceId }))}
                    className={`p-4 border-2 transition-all cursor-pointer relative bg-white ${assignmentParams.driverId === driver.id
                        ? 'border-blue-600 shadow-inner bg-blue-50'
                        : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#1E293B] flex items-center justify-center border-2 border-gray-400">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-wide">{driver.firstName} {driver.lastName}</h4>
                        <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">
                          {driver.assignedAmbulance ? `Vehicle: ${driver.assignedAmbulance.ambulanceNumber}` : 'No vehicle assigned'}
                        </p>
                      </div>
                      {assignmentParams.driverId === driver.id && (
                        <div className="bg-blue-600 w-8 h-8 flex items-center justify-center border border-blue-400">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nurse/Medic Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500" />
                <h3 className="text-[11px] font-black text-[#1E293B] uppercase tracking-[0.2em] flex-1">Select Nurse / medic</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {isFetchingUnits && availableNurses.length === 0 ? (
                  <div className="h-24 flex items-center justify-center font-black text-gray-400 uppercase tracking-widest text-[10px]">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Scanning grid...
                  </div>
                ) : availableNurses.length === 0 ? (
                  <div className="h-24 flex items-center justify-center font-black text-gray-400 uppercase tracking-widest text-[10px]">
                    No nurses available
                  </div>
                ) : availableNurses.map(nurse => (
                  <div
                    key={nurse.id}
                    onClick={() => setAssignmentParams(prev => ({ ...prev, nurseId: nurse.id === prev.nurseId ? '' : nurse.id }))}
                    className={`p-4 border-2 transition-all cursor-pointer relative bg-white ${assignmentParams.nurseId === nurse.id
                        ? 'border-emerald-600 shadow-inner bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#064E3B] flex items-center justify-center border-2 border-emerald-400">
                        <HeartPulse className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-wide">{nurse.firstName} {nurse.lastName}</h4>
                        <p className="text-[10px] font-black text-emerald-600 mt-1 uppercase tracking-widest">
                          Certified Responder
                        </p>
                      </div>
                      {assignmentParams.nurseId === nurse.id && (
                        <div className="bg-emerald-600 w-8 h-8 flex items-center justify-center border border-emerald-400">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1E293B] p-6 border-t-4 border-gray-700 flex justify-between items-center">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex flex-col">
            <span>READY FOR DEPLOYMENT</span>
            <span className="text-blue-400">{selectedDriver?.assignedAmbulance?.ambulanceNumber || 'V-TBD'} / {selectedDriver?.firstName || 'O-TBD'}</span>
          </div>
          <div className="flex gap-4">
            <Button onClick={onClose} className="px-8 h-12 bg-transparent text-white font-black text-sm uppercase tracking-widest border-2 border-gray-600 hover:bg-gray-700 rounded-none">
              Abort
            </Button>
            <Button
              onClick={handleAssign}
              disabled={isSubmitting || !assignmentParams.driverId}
              className="px-8 h-12 bg-[#EF4444] hover:bg-[#DC2626] text-white font-black text-sm uppercase tracking-widest border-b-4 border-[#991B1B] rounded-none active:translate-y-1 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Confirm Dispatch'}
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #E2E8F0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1E293B;
        }
      `}</style>
    </div>
  );
};

export default AssignModal;
