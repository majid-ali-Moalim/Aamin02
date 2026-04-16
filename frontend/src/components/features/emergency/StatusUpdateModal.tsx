import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Clock,
  Shield,
  Truck,
  MapPin,
  UserCheck,
  Navigation,
  Building2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { emergencyRequestsService } from '@/lib/api';
import { EmergencyRequest } from '@/types';
import StatusBadge from './StatusBadge';

interface StatusUpdateModalProps {
  request: EmergencyRequest;
  onClose: () => void;
  onSuccess: () => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ request, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDING': return 'ASSIGNED';
      case 'ASSIGNED': return 'ON_THE_WAY';
      case 'ON_THE_WAY': return 'ARRIVED';
      case 'ARRIVED': return 'PICKED_UP';
      case 'PICKED_UP': return 'TRANSPORTING';
      case 'TRANSPORTING': return 'AT_HOSPITAL';
      case 'AT_HOSPITAL': return 'COMPLETED';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(request.status);

  if (!nextStatus) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[120]">
        <div className="bg-white p-6 rounded-lg text-center max-w-sm">
          <p className="font-bold text-gray-800 mb-4">No further status updates available for this case.</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      await emergencyRequestsService.updateStatus(request.id, nextStatus);
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(`Update failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md flex justify-center items-center z-[120] p-4">
      <div className="bg-white w-full max-w-[500px] border-4 border-[#1E293B] shadow-2xl rounded-none flex flex-col">
        <div className="bg-[#1E293B] p-4 flex items-center justify-between">
          <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Advance Mission Status
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Status</p>
            <div className="flex justify-center">
              <StatusBadge status={request.status} size="lg" />
            </div>
          </div>

          <div className="flex justify-center flex-col items-center gap-4">
             <div className="w-1 h-12 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500 animate-[status-path_2s_infinite]" />
             </div>
             <ArrowRight className="w-8 h-8 text-blue-500 rotate-90" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Next Protocol State</p>
            <div className="flex justify-center">
              <StatusBadge status={nextStatus} size="lg" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 border border-blue-100 rounded text-center">
            <p className="text-xs font-bold text-blue-800">
              Confirming this action will broadcast the status update to the entire fleet and hospital networks.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex gap-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 rounded-none font-black uppercase tracking-widest text-xs h-12"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-none font-black uppercase tracking-widest text-xs h-12 border-b-4 border-blue-800 active:translate-y-1 transition-all"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Confirm Update'}
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes status-path {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default StatusUpdateModal;
