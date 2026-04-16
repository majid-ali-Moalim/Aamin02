'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Activity,
  Building2,
  ArrowRight,
  Filter,
  Loader2
} from 'lucide-react'
import { systemSetupService } from '@/lib/api'
import { Region, District } from '@/types'
import RegionForm from '@/components/features/system-setup/RegionForm'
import { cn } from '@/lib/utils'

export default function AdvancedRegionsPage() {
  const router = useRouter()
  const [regions, setRegions] = useState<Region[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  
  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [regionsData, districtsData] = await Promise.all([
        systemSetupService.getRegions(),
        systemSetupService.getDistricts()
      ])
      setRegions(regionsData)
      setDistricts(districtsData)
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const getDistrictCount = (regionId: string) => {
    return districts.filter(d => d.regionId === regionId).length
  }

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (region.code && region.code.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && region.isActive) ||
                         (filterStatus === 'inactive' && !region.isActive)
    return matchesSearch && matchesStatus
  })

  const handleCreateRegion = async (data: any) => {
    try {
      setFormLoading(true)
      await systemSetupService.createRegion(data)
      toast.success('Region created successfully')
      setShowForm(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create region')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateRegion = async (data: any) => {
    try {
      setFormLoading(true)
      await systemSetupService.updateRegion(editingRegion!.id, data)
      toast.success('Region updated successfully')
      setShowForm(false)
      setEditingRegion(null)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update region')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteRegion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this region?')) return
    try {
      await systemSetupService.deleteRegion(id)
      toast.success('Region deleted successfully')
      fetchData()
    } catch (error: any) {
      toast.error('Failed to delete region')
    }
  }

  const stats = {
    total: regions.length,
    active: regions.filter(r => r.isActive).length,
    districts: districts.length
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-[0.2em] text-[10px]">
              <div className="w-8 h-[2px] bg-red-600" />
              Regional Infrastructure
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-red-600 rounded-2xl shadow-xl shadow-red-500/20">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              Advanced Regions
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              Define and manage top-level administrative territories and regional operations.
            </p>
          </div>

          <button 
            onClick={() => { setEditingRegion(null); setShowForm(true); }}
            className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Region
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Regions</p>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Status</p>
              <p className="text-2xl font-black text-emerald-600">{stats.active}</p>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors shadow-2xl shadow-slate-900/40">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sub-Entities</p>
                <p className="text-2xl font-black text-white">{stats.districts} Districts</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Filters and Table Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Toolbar */}
          <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search regions by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border-none text-sm font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-transparent text-xs font-black uppercase tracking-widest outline-none border-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data List */}
          <div className="overflow-x-auto text-slate-900">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                <p className="text-slate-400 font-bold text-sm animate-pulse uppercase tracking-widest">Fetching regional metadata...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Region Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Territory Code</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Entity Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRegions.map((region) => (
                    <tr key={region.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{region.name}</p>
                            <p className="text-xs font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              {getDistrictCount(region.id)} Districts Managed
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-mono font-black text-slate-600 group-hover:bg-white transition-colors">
                            {region.code || 'NULL'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border",
                            region.isActive 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", region.isActive ? "bg-emerald-500" : "bg-slate-300")} />
                            {region.isActive ? 'Active' : 'Archived'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setEditingRegion(region); setShowForm(true); }}
                            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRegion(region.id)}
                            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Region Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="animate-in fade-in zoom-in duration-300 w-full max-w-lg">
            <RegionForm
              initialData={editingRegion || undefined}
              onSubmit={editingRegion ? handleUpdateRegion : handleCreateRegion}
              onCancel={() => { setShowForm(false); setEditingRegion(null); }}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  )
}
