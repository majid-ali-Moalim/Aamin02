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
  LogOut
} from 'lucide-react'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/ambulances', label: 'Ambulances', icon: Truck },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/patients', label: 'Patients', icon: UserCheck },
  { href: '/admin/emergency-requests', label: 'Emergency Requests', icon: Activity },
  { href: '/admin/referrals', label: 'Referrals', icon: FileText },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Aamin Admin</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-600 text-white border-l-4 border-red-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Link
          href="/logout"
          className="flex items-center px-6 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Link>
      </div>
    </div>
  )
}
