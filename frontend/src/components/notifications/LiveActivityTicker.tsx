'use client'

import React, { useState, useEffect } from 'react'
import { Activity, AlertCircle, TrendingUp } from 'lucide-react'
import { notificationsService } from '@/lib/api'
import Link from 'next/link'

export default function LiveActivityTicker() {
  const [latestAlert, setLatestAlert] = useState<any>(null)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const recent = await notificationsService.getRecent()
        if (recent && recent.length > 0) {
          // Find the most recent EMERGENCY or CRITICAL alert
          const critical = recent.find((n: any) => n.priority === 'CRITICAL' || n.type === 'EMERGENCY')
          setLatestAlert(critical || recent[0])
        }
      } catch (err) {
        console.error('Ticker fetch error:', err)
      }
    }

    fetchLatest()
    const interval = setInterval(fetchLatest, 15000) // 15s refresh
    return () => clearInterval(interval)
  }, [])

  if (!latestAlert) return null

  return (
    <div className="hidden lg:flex items-center gap-3 bg-gray-50/80 px-4 py-1.5 rounded-full border border-gray-100/50 animate-in fade-in slide-in-from-left duration-700">
      <div className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
          latestAlert.priority === 'CRITICAL' ? 'bg-red-400' : 'bg-blue-400'
        }`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          latestAlert.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-500'
        }`}></span>
      </div>
      
      <div className="flex items-center gap-2 overflow-hidden max-w-[300px]">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
          {latestAlert.type}:
        </span>
        <Link 
          href={latestAlert.actionUrl || `/admin/notifications?id=${latestAlert.id}`}
          className="text-[11px] font-bold text-gray-700 truncate hover:text-red-600 transition-colors"
        >
          {latestAlert.title}: {latestAlert.message}
        </Link>
      </div>
      
      <TrendingUp className="w-3 h-3 text-gray-300 ml-1" />
    </div>
  )
}
