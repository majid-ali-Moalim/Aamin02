import React, { useState } from 'react';
import { 
  XCircle, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { emergencyRequestsService } from '@/lib/api';
import { EmergencyRequest } from '@/types';

interface CancelModalProps {
  request: EmergencyRequest;
  onClose: () => void;
  onSuccess: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ request, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState('');

  const handleCancel = async () => {
    if (!reason.trim()) {
      return alert('Please provide a reason for cancellation');
    }

    try {
      setIsSubmitting(true);
      await emergencyRequestsService.cancelRequest(request.id, reason);
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(`Cancellation failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md flex justify-center items-center z-[130] p-4">
      <div className="bg-white w-full max-w-[450px] border-4 border-[#1E293B] shadow-2xl rounded-none overflow-hidden">
        <div className="bg-[#EF4444] p-4 flex items-center justify-between">
          <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Abort Mission / Terminate Request
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-red-50 p-4 border border-red-100 rounded">
            <p className="text-[11px] font-black text-red-800 uppercase tracking-widest mb-1">Warning</p>
            <p className="text-xs text-red-700 font-bold leading-relaxed">
              You are about to cancel emergency request <span className="font-black underline">{request.trackingCode}</span>. This action is irreversible and will be logged in the system audit trail.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Reason for Termination</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide detailed reason for cancellation (e.g., False alarm, Request handled by other agency, etc.)"
              className="w-full h-32 p-3 bg-gray-50 border-2 border-gray-200 focus:border-red-500 focus:ring-0 outline-none font-bold text-sm resize-none transition-colors"
              required
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t-2 border-gray-100 flex gap-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 rounded-none font-black uppercase tracking-widest text-xs h-12"
          >
            Keep Active
          </Button>
          <Button 
            onClick={handleCancel} 
            disabled={isSubmitting || !reason.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-none font-black uppercase tracking-widest text-xs h-12 border-b-4 border-red-800 active:translate-y-1 transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Confirm Cancellation'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
