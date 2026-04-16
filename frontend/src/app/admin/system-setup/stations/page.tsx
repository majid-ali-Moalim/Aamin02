'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Warehouse, 
  Search, 
  MapPin, 
  Activity, 
  Plus, 
  Edit2, 
  Trash2, 
  Filter, 
  ArrowRight, 
  ChevronRight, 
  X,
  Loader2,
  Building2
} from 'lucide-react'
import { systemSetupService } from '@/lib/api'
import { toast } from 'react-hot-toast'
import StationForm from '@/components/features/system-setup/StationForm'
import { cn } from '@/lib/utils'

interface Station {
  id: string
  name: string
  regionId: string
  districtId: string
  address?: string
  phone?: string
  description?: string
  isActive: boolean
  region?: { name: string }
  district?: { name: string }
}

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [regions, setRegions] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Station | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [stnRes, regRes, distRes] = await Promise.all([
        systemSetupService.getStations(),
        systemSetupService.getRegions(),
        systemSetupService.getDistricts()
      ])
      setStations(stnRes)
      setRegions(regRes)
      setDistricts(distRes)
    } catch (error) {
      console.error('Failed to load stations:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.address?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRegion = !selectedRegion || s.regionId === selectedRegion
      const matchesDistrict = !selectedDistrict || s.districtId === selectedDistrict
      return matchesSearch && matchesRegion && matchesDistrict
    })
  }, [stations, searchTerm, selectedRegion, selectedDistrict])

  const handleEdit = (item: Station) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this station?')) return
    try {
      await systemSetupService.deleteStation(id)
      toast.success('Station deactivated')
      loadData()
    } catch (error) {
      toast.error('Failed to delete station')
    }
  }

  const handleSubmit = async (data: any) => {
    setLoading(true)
    try {
      if (editingItem) {
        await systemSetupService.updateStation(editingItem.id, data)
        toast.success('Station updated')
      } else {
        await systemSetupService.createStation(data)
        toast.success('Station created')
      }
      setIsModalOpen(false)
      loadData()
    } catch (error) {
      toast.error('Failed to save station')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-[0.2em] text-[10px]">
              <div className="w-8 h-[2px] bg-red-600" />
              Master Data Management
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-red-600 rounded-2xl shadow-xl shadow-red-500/20">
                <Warehouse className="w-8 h-8 text-white" />
              </div>
              Advanced Stations
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              Configure and manage ambulance stations, deployment hubs, and regional operations centers.
            </p>
          </div>

          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Station
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <Warehouse className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Stations</p>
              <p className="text-2xl font-black text-slate-900">{stations.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Units</p>
              <p className="text-2xl font-black text-emerald-600">{stations.filter(s => s.isActive).length}</p>
            </div>
          </div>
          <div className="bg-emerald-600 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-emerald-700 transition-colors">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Regional Load</p>
                <p className="text-2xl font-black text-white">{regions.length} Regions</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-emerald-100 group-hover:translate-x-2 transition-transform" />
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
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border-none text-sm font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                  value={selectedRegion}
                  onChange={(e) => { setSelectedRegion(e.target.value); setSelectedDistrict(''); }}
                  className="bg-transparent text-xs font-black uppercase tracking-widest outline-none border-none cursor-pointer"
                >
                  <option value="">All Regions</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <select 
                  value={selectedDistrict}
                  disabled={!selectedRegion}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-transparent text-xs font-black uppercase tracking-widest outline-none border-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">All Districts</option>
                  {districts.filter(d => !selectedRegion || d.regionId === selectedRegion).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                <p className="text-slate-400 font-bold text-sm animate-pulse uppercase tracking-widest">Deploying station data...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Station Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location Parent</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Operational Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Unit Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStations.map((station) => (
                    <tr key={station.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner transition-colors",
                            station.isActive ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-400"
                          )}>
                            <Warehouse className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-red-700 transition-colors">{station.name}</p>
                            <p className="text-xs font-medium text-slate-400 truncate max-w-[200px]">{station.address || 'No address provided'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-700 uppercase">{station.region?.name || '---'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="w-1 h-1 rounded-full bg-slate-300" />
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{station.district?.name || '---'}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                            station.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", station.isActive ? "bg-emerald-500" : "bg-slate-400")} />
                            {station.isActive ? 'Active HQ' : 'Inactive'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(station)}
                            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(station.id)}
                            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredStations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300">
                          <Warehouse className="w-16 h-16 opacity-20" />
                          <div>
                            <p className="text-lg font-black uppercase tracking-tighter">No Units Detected</p>
                            <p className="text-sm font-medium">Verify your filters or deploy a new station</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="animate-in fade-in zoom-in duration-300 w-full max-w-lg">
            <StationForm 
              initialData={editingItem || undefined}
              regions={regions}
              districts={districts}
              loading={loading}
              onCancel={() => setIsModalOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  )
}
