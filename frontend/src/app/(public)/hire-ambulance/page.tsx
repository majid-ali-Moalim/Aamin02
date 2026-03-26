'use client'

import { useState } from 'react'
import Link from 'next/link'
import { emergencyRequestsService } from '@/lib/api'
import { Phone, MapPin, Calendar, Clock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function HireAmbulancePage() {
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    illness: '',
    currentLocation: '',
    pickupLocation: '',
    preferredHospital: '',
    date: '',
    time: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await emergencyRequestsService.create(formData)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h1>
            <p className="text-gray-600 mb-8">
              Your ambulance request has been successfully submitted. Our team will contact you shortly.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <p className="text-red-800 font-semibold mb-2">Emergency Hotline</p>
              <p className="text-3xl font-bold text-red-600">999</p>
              <p className="text-red-700 text-sm mt-2">Call immediately for urgent medical emergencies</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ambulance-tracking"
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Track Your Request
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 pb-12 bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hire an Ambulance</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in the details below to request an ambulance. Our team will respond promptly to your request.
          </p>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-600 text-white rounded-2xl p-6 mb-8 flex items-center space-x-4 shadow-xl">
          <Phone className="w-8 h-8 flex-shrink-0" />
          <div>
            <p className="font-semibold text-lg">Life-Threatening Emergency?</p>
            <p className="text-red-100">Call 999 immediately for urgent medical assistance</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-red-600" />
                Patient Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Enter patient's full name"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Enter contact number"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Medical Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="illness" className="block text-sm font-medium text-gray-700 mb-2">
                    Illness / Condition *
                  </label>
                  <textarea
                    id="illness"
                    name="illness"
                    value={formData.illness}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Describe the patient's condition or symptoms"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-600" />
                Location Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Location *
                  </label>
                  <input
                    type="text"
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Current location of patient"
                  />
                </div>
                <div>
                  <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Where to pick up the patient"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="preferredHospital" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Hospital
                </label>
                <select
                  id="preferredHospital"
                  name="preferredHospital"
                  value={formData.preferredHospital}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a hospital (optional)</option>
                  <option value="Mogadishu General Hospital">Mogadishu General Hospital</option>
                  <option value="Benadir Hospital">Benadir Hospital</option>
                  <option value="Kalkal Hospital">Kalkal Hospital</option>
                  <option value="Forlanini Hospital">Forlanini Hospital</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Schedule Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-red-600" />
                Schedule Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="Any additional information or special requirements"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
