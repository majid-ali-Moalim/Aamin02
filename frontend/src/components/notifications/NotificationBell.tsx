'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Bell, 
  Check, 
  Clock, 
  AlertCircle, 
  Activity, 
  ShieldAlert, 
  Truck, 
  User, 
  ExternalLink,
  Loader2,
  Trash2
} from 'lucide-react'
import { notificationsService } from '@/lib/api'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'ALL' | 'EMERGENCY' | 'FLEET'>('ALL')
  const [notifications, setNotifications] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const lastCheckRef = useRef<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000) // Poll every 15s for "Live" feel
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const [recent, statsData] = await Promise.all([
        notificationsService.getRecent(),
        notificationsService.getStats()
      ])
      
      // Check for new critical/emergency alerts to toast
      if (recent && recent.length > 0 && lastCheckRef.current) {
        const newOnes = recent.filter((n: any) => n.id > lastCheckRef.current! && n.status === 'UNREAD')
        newOnes.forEach((n: any) => {
          if (n.priority === 'CRITICAL' || n.type === 'EMERGENCY') {
            toast.error(`${n.title}: ${n.message}`, {
              duration: 6000,
              icon: '🚨'
            })
          }
        })
      }
      
      if (recent && recent.length > 0) {
        lastCheckRef.current = recent[0].id
      }

      setNotifications(recent || [])
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllRead()
      await fetchNotifications()
    } catch (error) {
      console.error('Error marking all read:', error)
    }
  }

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await notificationsService.markRead(id)
      await fetchNotifications()
    } catch (error) {
      console.error('Error marking read:', error)
    }
  }

  const getIcon = (type: string, priority: string) => {
    const color = priority === 'CRITICAL' ? 'text-red-600' : 'text-gray-400'
    switch (type) {
      case 'EMERGENCY': return <Activity className={`w-4 h-4 ${color}`} />
      case 'STAFF': return <User className={`w-4 h-4 ${color}`} />
      case 'AMBULANCE': return <Truck className={`w-4 h-4 ${color}`} />
      case 'MAINTENANCE': return <Truck className={`w-4 h-4 ${color}`} />
      case 'COMPLIANCE': return <ShieldAlert className={`w-4 h-4 ${color}`} />
      case 'REFERRAL': return <ExternalLink className={`w-4 h-4 ${color}`} />
      case 'PATIENT_CARE': return <Activity className={`w-4 h-4 ${color}`} />
      default: return <Bell className={`w-4 h-4 ${color}`} />
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'ALL') return true
    if (activeTab === 'EMERGENCY') return n.type === 'EMERGENCY'
    if (activeTab === 'FLEET') return n.type === 'AMBULANCE' || n.type === 'MAINTENANCE'
    return true
  })

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-900 transition-all hover:bg-gray-100 rounded-xl"
      >
        <Bell className="w-6 h-6" />
        {stats?.unread > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
            {stats.unread > 9 ? '9+' : stats.unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-blue-900/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-black text-gray-900 flex items-center text-sm">
              Alert Center
              {stats?.unread > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">
                  {stats.unread} NEW
                </span>
              )}
            </h3>
            <button 
              onClick={handleMarkAllRead}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-50">
            {(['ALL', 'EMERGENCY', 'FLEET'] as const).map((tab) => (
              <button
                key={tab}
                onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                className={`flex-1 py-3 text-[10px] font-black tracking-widest uppercase transition-all ${
                  activeTab === tab 
                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50/20' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {filteredNotifications.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 flex gap-3 hover:bg-gray-50 transition-colors relative group cursor-pointer ${
                      item.status === 'UNREAD' ? 'bg-blue-50/20' : ''
                    } ${item.priority === 'CRITICAL' ? 'border-l-4 border-red-600' : ''}`}
                  >
                    <div className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      item.priority === 'CRITICAL' ? 'bg-red-50 animate-pulse' : 'bg-gray-50'
                    }`}>
                      {getIcon(item.type, item.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`font-black text-xs truncate ${item.priority === 'CRITICAL' ? 'text-red-700' : 'text-gray-900'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed font-bold">{item.message}</p>
                      
                      <div className="mt-3 flex items-center gap-2">
                         {item.status === 'UNREAD' && (
                           <button 
                             onClick={(e) => handleMarkRead(item.id, e)}
                             className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 shadow-sm transition-all"
                           >
                             Dismiss
                           </button>
                         )}
                         <Link 
                           href={item.actionUrl || `/admin/notifications?id=${item.id}`}
                           onClick={() => setIsOpen(false)}
                           className="px-2 py-1 bg-red-600 rounded-lg text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1 hover:bg-red-700 shadow-lg shadow-red-900/10 transition-all"
                         >
                           {item.type === 'EMERGENCY' ? 'Dispatch' : 'View Action'} <ExternalLink className="w-2 h-2" />
                         </Link>
                      </div>
                    </div>

                    {item.status === 'UNREAD' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute right-3 top-3" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-10 h-10 text-gray-100 mx-auto mb-3" />
                <p className="text-gray-400 font-bold text-xs">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <Link 
            href="/admin/notifications"
            onClick={() => setIsOpen(false)}
            className="p-4 border-t border-gray-50 flex items-center justify-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            Manage All Alerts
            <Check className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
