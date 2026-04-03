import { Search, User, Menu } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'
import Breadcrumbs from './Breadcrumbs'
import LiveActivityTicker from '../notifications/LiveActivityTicker'

export default function AdminTopBar() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 sticky top-0 z-40 backdrop-blur-md bg-white/80">
      <div className="flex items-center justify-between h-full px-6 gap-8">
        
        {/* Left: Navigation & Status */}
        <div className="flex items-center gap-8 min-w-0">
          <Breadcrumbs />
          {/* Live Sync Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/50 shadow-sm animate-in fade-in zoom-in duration-700">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">Live Sync</span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden lg:block" />
          <LiveActivityTicker />
        </div>
        
        {/* Right: Actions & User */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Middle-Right Search (Compact) */}
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 xl:w-64 pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/10 focus:bg-white transition-all text-xs font-bold text-gray-900"
            />
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            
            <div className="h-8 w-px bg-gray-100 mx-2" />
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black tracking-widest uppercase text-gray-900 leading-none mb-0.5">Admin User</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-red-600">Chief Dispatcher</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20 group-hover:scale-105 transition-transform duration-300 border-2 border-white">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
