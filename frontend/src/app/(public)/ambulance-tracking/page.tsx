'use client'

import { useState } from 'react'
import { Search, MapPin, Clock, Phone, User, Truck, CheckCircle, AlertCircle, Activity } from 'lucide-react'

export default function AmbulanceTrackingPage() {
  const [trackingCode, setTrackingCode] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [trackingData, setTrackingData] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!trackingCode.trim()) {
      setError('Please enter a tracking code')
      return
    }

    setIsTracking(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock tracking data
      setTrackingData({
        id: 'AAM-123456',
        status: 'ON_THE_WAY',
        patientName: 'Ahmed Mohamed',
        phoneNumber: '+252 61 234 5678',
        pickupLocation: 'Hodan District, Mogadishu',
        destination: 'Mogadishu General Hospital',
        assignedAmbulance: 'AAM-001',
        driverName: 'Mohamed Hassan',
        driverPhone: '+252 61 345 6789',
        estimatedArrival: '15 minutes',
        requestTime: '10:30 AM',
        priority: 'HIGH',
        timeline: [
          {
            time: '10:30 AM',
            status: 'REQUEST_RECEIVED',
            description: 'Emergency request received and processed'
          },
          {
            time: '10:32 AM',
            status: 'AMBULANCE_DISPATCHED',
            description: 'Ambulance AAM-001 dispatched to location'
          },
          {
            time: '10:35 AM',
            status: 'ON_THE_WAY',
            description: 'Ambulance is en route to pickup location'
          }
        ]
      })
    } catch (err) {
      setError('Tracking code not found. Please check and try again.')
    } finally {
      setIsTracking(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800'
      case 'ON_THE_WAY':
        return 'bg-purple-100 text-purple-800'
      case 'ARRIVED':
        return 'bg-green-100 text-green-800'
      case 'PATIENT_PICKED':
        return 'bg-indigo-100 text-indigo-800'
      case 'REACHED_HOSPITAL':
        return 'bg-teal-100 text-teal-800'
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'REQUEST_RECEIVED':
        return <CheckCircle className="w-5 h-5" />
      case 'AMBULANCE_DISPATCHED':
        return <Truck className="w-5 h-5" />
      case 'ON_THE_WAY':
        return <Activity className="w-5 h-5" />
      case 'ARRIVED':
        return <MapPin className="w-5 h-5" />
      case 'PATIENT_PICKED':
        return <User className="w-5 h-5" />
      case 'REACHED_HOSPITAL':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="pt-16 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ambulance Tracking
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Track your ambulance request in real-time. Enter your tracking code to get 
              live updates on your emergency service status.
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label htmlFor="trackingCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Tracking Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="trackingCode"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="e.g., AAM-123456"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-lg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Your tracking code was provided when you requested the ambulance
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isTracking}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isTracking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    <span>Track Ambulance</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingData && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Status Card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Status */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Current Status</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                      {trackingData.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tracking ID</p>
                      <p className="text-lg font-semibold text-gray-900">{trackingData.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Priority</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(trackingData.priority)}`}>
                        {trackingData.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Arrival</p>
                      <p className="text-lg font-semibold text-red-600">{trackingData.estimatedArrival}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Request Time</p>
                      <p className="text-lg font-semibold text-gray-900">{trackingData.requestTime}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Patient Name</p>
                      <p className="text-lg font-semibold text-gray-900">{trackingData.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-900">{trackingData.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                      <p className="text-lg font-semibold text-gray-900">{trackingData.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Destination</p>
                      <p className="text-lg font-semibold text-gray-900">{trackingData.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Request Timeline</h3>
                  <div className="space-y-4">
                    {trackingData.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900">
                              {event.status.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-500">{event.time}</p>
                          </div>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Ambulance Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Truck className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-bold text-gray-900">Ambulance</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Vehicle ID</p>
                      <p className="font-semibold text-gray-900">{trackingData.assignedAmbulance}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-bold text-gray-900">Driver</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{trackingData.driverName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{trackingData.driverPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-600">999</p>
                        <p className="text-sm text-red-700">24/7 Emergency Hotline</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Live Tracking</h3>
                  <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">Live Map View</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              If you're having trouble tracking your ambulance or need immediate assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Hotline</h3>
              <p className="text-gray-600 mb-4">For immediate assistance and tracking support</p>
              <p className="text-2xl font-bold text-red-600">999</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Code</h3>
              <p className="text-gray-600 mb-4">Make sure you're entering the correct tracking code</p>
              <p className="text-sm text-gray-500">Format: AAM-123456</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wait Patiently</h3>
              <p className="text-gray-600 mb-4">Our team is working to reach you as quickly as possible</p>
              <p className="text-sm text-gray-500">Average response: 15 minutes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
