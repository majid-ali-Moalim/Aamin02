import { Truck, Users, Shield, Clock, MapPin, Heart } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "Modern Fleet",
      description: "State-of-the-art ambulances equipped with advanced medical equipment"
    },
    {
      icon: Users,
      title: "Expert Staff",
      description: "Highly trained paramedics and medical professionals"
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "Comprehensive insurance coverage for all patients"
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Average response time under 15 minutes in urban areas"
    },
    {
      icon: MapPin,
      title: "Wide Coverage",
      description: "Serving all major cities and regions in Somalia"
    },
    {
      icon: Heart,
      title: "Patient Care",
      description: "Compassionate care focused on patient comfort and recovery"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Aamin Ambulance?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive emergency medical services with a focus on speed, 
            professionalism, and patient care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-red-100 rounded-lg p-4 inline-block mb-6">
                <feature.icon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
