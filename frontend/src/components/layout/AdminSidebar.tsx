'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  UserCheck, 
  Activity,
  FileText,
  Bell,
  Settings,
  LogOut,
  ClipboardList
} from 'lucide-react'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/ambulances', label: 'Ambulances', icon: Truck },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/patients', label: 'Patients', icon: UserCheck },
  { href: '/admin/emergency-requests', label: 'Emergency Requests', icon: Activity },
  { href: '/admin/system-setup', label: 'System Setup', icon: ClipboardList },
  { href: '/admin/referrals', label: 'Referrals', icon: FileText },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-secondary text-white h-screen fixed left-0 top-0 overflow-y-auto border-r border-white/5 shadow-xl z-30">
      <div className="p-6 border-b border-white/10 bg-black/10">
        <h1 className="text-xl font-black tracking-tight text-white flex items-center">
          <div className="bg-primary p-2 rounded-lg mr-3 shadow-lg shadow-primary/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span>AAMIN <span className="text-primary-foreground/70 font-light">ADMIN</span></span>
        </h1>
      </div>
      
      <nav className="mt-8 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-4 text-sm font-semibold transition-all duration-300 relative group ${
                isActive
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-blue-100/60 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]" />
              )}
              <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-blue-100/40 group-hover:text-white'}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-black/5">
        <Link
          href="/logout"
          className="flex items-center px-6 py-3.5 text-sm font-bold text-blue-100/40 hover:bg-destructive hover:text-white rounded-xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
          Logout
        </Link>
      </div>
    </div>
  )
}
