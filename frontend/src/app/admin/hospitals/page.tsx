'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Building2, Activity, MapPin, Loader2 } from 'lucide-react'
import { hospitalsService, systemSetupService } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Region, District } from '@/types'
import HospitalForm from '@/components/features/system-setup/HospitalForm'

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    regionId: '',
    districtId: '',
    beds: 0,
    erReady: true,
    status: 'Available',
    color: 'green',
    isActive: true,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [hospRes, regRes, distRes] = await Promise.all([
        hospitalsService.getAll(),
        systemSetupService.getRegions(),
        systemSetupService.getDistricts()
      ])
      setHospitals(hospRes)
      setRegions(regRes)
      setDistricts(distRes)
    } catch (error) {
      console.error('Failed to load hospitals:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (hospital?: any) => {
    setEditingData(hospital || null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingData) {
        await hospitalsService.update(editingData.id, data)
        toast.success('Hospital updated successfully')
      } else {
        await hospitalsService.create(data)
        toast.success('Hospital added successfully')
      }
      fetchData()
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save hospital')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hospital?')) {
      try {
        await hospitalsService.delete(id)
        toast.success('Hospital deleted successfully')
        fetchData()
      } catch (error) {
        toast.error('Failed to delete hospital')
      }
    }
  }

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const inputCls = "w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Hospitals Directory</h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
              Manage operational medical facilities
            </p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20"
        >
          <Plus className="w-4 h-4" /> Add Hospital
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input 
              type="text" 
              placeholder="Search hospitals..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-black text-gray-500">
                  <th className="p-4">Facility Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHospitals.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-sm text-gray-900">{h.name}</td>
                    <td className="p-4 text-xs font-bold text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {h.region?.name || 'N/A'} - {h.district?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-500">
                      <div className="flex items-center gap-3">
                        <span>{h.beds} Beds</span>
                        {h.erReady && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-wider text-[9px]">ER READY</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                        h.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        h.status === 'Full' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(h)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm text-gray-500 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(h.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 border border-transparent hover:border-rose-200 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredHospitals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 font-bold text-sm">
                      No hospitals found in directory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <HospitalForm 
            initialData={editingData || undefined}
            regions={regions}
            districts={districts}
            loading={false}
            onCancel={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  )
}
