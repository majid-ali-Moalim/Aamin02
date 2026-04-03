import React from 'react'
import { Check } from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
}

interface DriversStepperProps {
  steps: Step[]
  currentStep: number
}

export default function DriversStepper({ steps, currentStep }: DriversStepperProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto px-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 font-bold text-xs
                    ${isActive 
                      ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-100 ring-2 ring-red-50' 
                      : isCompleted
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                </div>
                
                <div className="mt-2 text-center">
                  <p className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold whitespace-nowrap hidden sm:block opacity-60">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 h-[1px] bg-gray-100 relative -mt-8">
                   <div 
                    className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-500 ease-in-out"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                   />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
