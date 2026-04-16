'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LucideIcon, Rocket } from 'lucide-react'

interface AdminStubPageProps {
  title: string
  description: string
  icon: LucideIcon
}

export default function AdminStubPage({ title, description, icon: Icon }: AdminStubPageProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section with branding */}
      <div className="relative mb-12 p-10 rounded-[2.5rem] bg-gradient-to-br from-red-600 via-red-700 to-red-900 overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
        <div className="absolute top-0 right-0 p-12 opacity-15">
          <Icon className="w-40 h-40 text-white stroke-[1]" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-black uppercase tracking-widest mb-6">
            <Rocket className="w-3.5 h-3.5" />
            New Module Initialized
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter drop-shadow-sm">{title}</h1>
          <p className="text-red-50/70 text-xl max-w-2xl font-light leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Main Content Card with Glass effect */}
      <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-3xl border-t border-white/40 ring-1 ring-slate-200/50">
        <CardHeader className="border-b border-slate-100 bg-slate-50/30 p-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-red-500 rounded-full" />
                Work in Progress
              </CardTitle>
              <CardDescription className="font-bold text-slate-500 mt-2 text-base">
                Engineering Team is currently building the primary data models and visual views for this feature.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-24 text-center">
          <div className="relative inline-flex mb-10">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative bg-gradient-to-tr from-slate-50 to-white w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-xl border border-slate-100 ring-1 ring-white">
              <Icon className="w-14 h-14 text-red-600 stroke-[1.5]" />
            </div>
          </div>
          
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Feature Coming Soon!</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg font-medium leading-relaxed italic">
            "Aamin's engineering department is integrating this module into the central dispatcher's mission control system. Real-time metrics and historical archives will be populated automatically shortly after the next sync."
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <div className="h-0.5 w-12 bg-slate-200 rounded-full" />
            <span className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">System Manifest Ready</span>
            <div className="h-0.5 w-12 bg-slate-200 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
