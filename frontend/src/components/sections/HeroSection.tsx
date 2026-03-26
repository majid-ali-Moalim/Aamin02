import { Button } from '@/components/ui/button'
import { Phone, MapPin, Clock } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Aamin Ambulance Emergency Services
          </h1>
          <p className="text-xl mb-8 text-red-100">
            Professional emergency medical response available 24/7 in Somalia. 
            Fast, reliable, and life-saving ambulance services when you need them most.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Phone className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">24/7 Emergency</h3>
              <p className="text-red-100">Always available when you need us</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <MapPin className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Fast Response</h3>
              <p className="text-red-100">Quick arrival to your location</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Clock className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Professional Care</h3>
              <p className="text-red-100">Expert medical staff on board</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              Emergency: 888
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              Hire Ambulance
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
