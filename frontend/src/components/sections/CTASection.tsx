import { Button } from '@/components/ui/button'
import { Phone, ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="bg-red-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Need Emergency Medical Assistance?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Don't wait in critical situations. Our emergency response team is ready 
            to provide immediate medical assistance 24/7.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <Phone className="w-12 h-12 mr-4" />
              <div className="text-left">
                <p className="text-2xl font-bold">Emergency Hotline</p>
                <p className="text-3xl font-mono">888</p>
              </div>
            </div>
            <p className="text-red-100">
              Available 24 hours a day, 7 days a week
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              Call Now: 888
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              Hire Ambulance Online
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
