'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
  ClipboardList,
  ChevronDown,
  ChevronRight,
  UserCog,
  Calendar,
  Radio,
  Shield,
  Clock,
  BarChart2,
  UserPlus,
  Shuffle,
  Stethoscope,
  Medal,
  AlertCircle,
  Trash2,
  User,
} from 'lucide-react'

const driversSubMenu = [
  { href: '/admin/drivers', label: 'All Drivers', icon: Users, exact: true },
  { href: '/admin/employees', label: 'Employee', icon: UserCog }, // Rename 'Add New Driver' -> 'Employee'
  { href: '/admin/drivers/assignments', label: 'Driver Assignments', icon: Shuffle },
  { href: '/admin/drivers/shifts', label: 'Shift & Availability', icon: Calendar },
  { href: '/admin/drivers/dispatch', label: 'Dispatch Activity', icon: Radio },
  { href: '/admin/drivers/compliance', label: 'License & Compliance', icon: Shield },
  { href: '/admin/drivers/attendance', label: 'Attendance & Logs', icon: Clock },
  { href: '/admin/drivers/performance', label: 'Performance & Reports', icon: BarChart2 },
]

const employeesSubMenu = [
  { href: '/admin/employees', label: 'All Employees', icon: Users, exact: true },
  { href: '/admin/employees/add?role=driver', label: 'Add New Driver', icon: UserPlus },
  { href: '/admin/employees/add?role=dispatcher', label: 'Add New Dispatcher', icon: UserPlus },
  { href: '/admin/employees/add?role=nurse', label: 'Add New Nurse', icon: UserPlus },
  { href: '/admin/employees/add?role=admin', label: 'Add New Admin', icon: UserPlus },
  { href: '/admin/permissions', label: 'Roles & Permissions', icon: Shield },
  { href: '/admin/system-setup', label: 'Departments', icon: LayoutDashboard },
  { href: '/admin/drivers/shifts', label: 'Shift & Scheduling', icon: Clock },
]

const topMenuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/ambulances', label: 'Ambulances', icon: Truck },
]

const bottomMenuItems = [
  { href: '/admin/patients', label: 'Patients', icon: UserCheck },
  { href: '/admin/emergency-requests', label: 'Emergency Requests', icon: Activity },
  { href: '/admin/referrals', label: 'Referrals', icon: FileText },
  { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart2 },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell, badge: 8 },
  { href: '/admin/system-setup', label: 'Settings & Access', icon: Settings },
]

const nursesSubMenu = [
  { label: 'All Nurses', href: '/admin/nurses', icon: Users },
  { label: 'Assignments', href: '/admin/nurses/assignments', icon: Shuffle },
  { label: 'Shift & Availability', href: '/admin/nurses/shifts', icon: Clock },
  { label: 'Patient Care Records', href: '/admin/nurses/records', icon: FileText },
  { label: 'Medical Certifications', href: '/admin/nurses/licenses', icon: Medal },
  { label: 'Performance & Reports', href: '/admin/nurses/performance', icon: BarChart2 },
  { label: 'Incident Reports', href: '/admin/nurses/incidents', icon: AlertCircle },
]

const notificationsSubMenu = [
  { href: '/admin/notifications', label: 'All Notifications', icon: Bell, exact: true },
  { href: '/admin/notifications?status=UNREAD', label: 'Unread Alerts', icon: Clock },
  { href: '/admin/notifications?type=EMERGENCY', label: 'Emergency Alerts', icon: Activity },
  { href: '/admin/notifications?type=STAFF', label: 'Staff Alerts', icon: User },
  { href: '/admin/notifications?type=SYSTEM', label: 'System Alerts', icon: Shield },
  { href: '/admin/notifications?type=MAINTENANCE', label: 'Maintenance Alerts', icon: Truck },
  { href: '/admin/notifications?type=REFERRAL', label: 'Referral Alerts', icon: FileText },
  { href: '/admin/notifications?status=ARCHIVED', label: 'Archived Records', icon: Trash2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const isDriversActive = pathname.startsWith('/admin/drivers')
  const isNursesActive = pathname.startsWith('/admin/nurses')
  const isNotificationsActive = pathname.startsWith('/admin/notifications')
  const isEmployeesActive = pathname.startsWith('/admin/employees') || pathname.startsWith('/admin/permissions') || pathname.startsWith('/admin/system-setup')
  
  const [driversOpen, setDriversOpen] = useState(isDriversActive)
  const [nursesOpen, setNursesOpen] = useState(isNursesActive)
  const [notificationsOpen, setNotificationsOpen] = useState(isNotificationsActive)
  const [employeesOpen, setEmployeesOpen] = useState(isEmployeesActive)

  return (
    <div className="w-64 bg-[#0F1C2E] text-white h-screen fixed left-0 top-0 flex flex-col border-r border-white/5 shadow-xl z-30">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 shrink-0">
        <h1 className="text-xl font-black tracking-tight text-white flex items-center">
          <div className="bg-red-600 p-2 rounded-lg mr-3 shadow-lg shadow-red-900/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span>Aamin <span className="text-white/40 font-light text-sm">Ambulance</span></span>
        </h1>
      </div>
      
      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-3 custom-scrollbar">
        {/* Top menu items */}
        {topMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-white/40'}`} />
              {item.label}
            </Link>
          )
        })}

        {/* Drivers Section (Collapsible) */}
        <div>
          <button
            onClick={() => setDriversOpen(!driversOpen)}
            className={`w-full flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
              isDriversActive
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <Truck className={`w-5 h-5 mr-3 ${isDriversActive ? 'text-white' : 'text-white/40'}`} />
              Drivers
            </div>
            {driversOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {driversOpen && (
            <div className="mt-1 ml-2 pl-3 border-l border-white/10 space-y-0.5">
              {driversSubMenu.map((sub) => {
                const SubIcon = sub.icon
                const isActive = pathname === sub.href
                return (
                  <Link
                    key={sub.label + sub.href}
                    href={sub.href}
                    className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-white/40 hover:bg-white/5 hover:text-white font-medium'
                    }`}
                  >
                    <SubIcon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-red-400' : 'text-white/30'}`} />
                    {sub.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Nurses Section (Collapsible) */}
        <div>
          <button
            onClick={() => setNursesOpen(!nursesOpen)}
            className={`w-full flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
              isNursesActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <Stethoscope className={`w-5 h-5 mr-3 ${isNursesActive ? 'text-white' : 'text-white/40'}`} />
              Nurses
            </div>
            {nursesOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {nursesOpen && (
            <div className="mt-1 ml-2 pl-3 border-l border-white/10 space-y-0.5">
              {nursesSubMenu.map((sub) => {
                const SubIcon = sub.icon
                const isActive = pathname === sub.href
                return (
                  <Link
                    key={sub.label + sub.href}
                    href={sub.href}
                    className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-white/40 hover:bg-white/5 hover:text-white font-medium'
                    }`}
                  >
                    <SubIcon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-blue-400' : 'text-white/30'}`} />
                    {sub.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Employees Section (Collapsible) */}
        <div>
          <button
            onClick={() => setEmployeesOpen(!employeesOpen)}
            className={`w-full flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
              isEmployeesActive
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <UserCog className={`w-5 h-5 mr-3 ${isEmployeesActive ? 'text-white' : 'text-white/40'}`} />
              Employees
            </div>
            {employeesOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {employeesOpen && (
            <div className="mt-1 ml-2 pl-3 border-l border-white/10 space-y-0.5">
              {employeesSubMenu.map((sub) => {
                const SubIcon = sub.icon
                const isActive = pathname.startsWith(sub.href.split('?')[0]) && (sub.exact ? pathname === sub.href.split('?')[0] : true)
                // Special check for exact active state with query params if needed, but simple prefix check is usually enough for sidebars
                return (
                  <Link
                    key={sub.label + sub.href}
                    href={sub.href}
                    className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-white/40 hover:bg-white/5 hover:text-white font-medium'
                    }`}
                  >
                    <SubIcon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-red-400' : 'text-white/30'}`} />
                    {sub.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Notifications Section (Collapsible) */}
        <div>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`w-full flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
              isNotificationsActive
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <Bell className={`w-5 h-5 mr-3 ${isNotificationsActive ? 'text-white' : 'text-white/40'}`} />
              Notifications
            </div>
            {notificationsOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {notificationsOpen && (
            <div className="mt-1 ml-2 pl-3 border-l border-white/10 space-y-0.5">
              {notificationsSubMenu.map((sub) => {
                const SubIcon = sub.icon
                const isActive = pathname === sub.href
                return (
                  <Link
                    key={sub.label + sub.href}
                    href={sub.href}
                    className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-white/40 hover:bg-white/5 hover:text-white font-medium'
                    }`}
                  >
                    <SubIcon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-red-400' : 'text-white/30'}`} />
                    {sub.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom menu items */}
        {bottomMenuItems.filter(item => item.label !== 'Notifications').map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-white/40'}`} />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      
      {/* Static Logout at Bottom */}
      <div className="p-4 border-t border-white/10 bg-black/40 shrink-0">
        <Link
          href="/logout"
          className="flex items-center px-3 py-3 text-sm font-bold text-white/30 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-red-500/20 transition-colors">
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
          Logout Session
        </Link>
      </div>
    </div>
  )
}
