'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home, LayoutDashboard } from 'lucide-react'

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  const pathSegments = pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== 'admin')
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')

  return (
    <nav className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400">
      <Link 
        href="/admin/dashboard" 
        className="hover:text-red-600 transition-colors flex items-center gap-1.5"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        Admin
      </Link>
      
      {pathSegments.length > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
      
      {pathSegments.map((segment, index) => {
        const href = `/admin/${pathSegments.slice(0, index + 1).join('/')}`
        const isLast = index === pathSegments.length - 1
        
        return (
          <React.Fragment key={href}>
            {index > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            <Link
              href={href}
              className={`transition-colors ${
                isLast ? 'text-gray-900 font-black' : 'hover:text-red-600'
              }`}
            >
              {capitalize(segment)}
            </Link>
          </React.Fragment>
        )
      })}
    </nav>
  )
}
