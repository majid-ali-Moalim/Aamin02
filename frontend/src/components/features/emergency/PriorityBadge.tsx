import React from 'react';
import { 
  AlertTriangle, 
  Flag, 
  Clock, 
  CheckCircle,
  AlertOctagon
} from 'lucide-react';

interface PriorityBadgeProps {
  priority: string;
  size?: 'sm' | 'md' | 'lg';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return { 
          bg: 'bg-red-600 border-red-800 animate-pulse', 
          text: 'text-white', 
          icon: AlertOctagon, 
          label: 'CRITICAL' 
        };
      case 'HIGH':
        return { 
          bg: 'bg-orange-600 border-orange-800', 
          text: 'text-white', 
          icon: Flag, 
          label: 'HIGH' 
        };
      case 'MEDIUM':
        return { 
          bg: 'bg-yellow-500 border-yellow-700', 
          text: 'text-white', 
          icon: Clock, 
          label: 'MEDIUM' 
        };
      case 'LOW':
        return { 
          bg: 'bg-green-600 border-green-800', 
          text: 'text-white', 
          icon: CheckCircle, 
          label: 'LOW' 
        };
      default:
        return { 
          bg: 'bg-gray-500 border-gray-700', 
          text: 'text-white', 
          icon: AlertTriangle, 
          label: priority 
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[9px] gap-1',
    md: 'px-2.5 py-1 text-[10px] gap-1.5',
    lg: 'px-3.5 py-1.5 text-[11px] gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`flex items-center font-black uppercase tracking-widest border rounded shadow-md ${config.bg} ${config.text} ${sizeStyles[size]}`}>
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </div>
  );
};

export default PriorityBadge;
