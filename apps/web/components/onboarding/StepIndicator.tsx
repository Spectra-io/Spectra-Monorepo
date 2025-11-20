'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: Array<{ id: number; title: string; icon?: string }>
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8 lg:mb-12">
      {/* Progress Line */}
      <div className="relative hidden lg:block">
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-800 -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between items-start lg:items-center relative">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isPending = step.id > currentStep

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <motion.div
                className={`relative w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center font-bold text-lg lg:text-xl transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : isCurrent
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-110'
                    : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                }`}
                whileHover={isCurrent ? { scale: 1.15 } : {}}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 lg:w-7 lg:h-7" />
                ) : (
                  step.id
                )}
              </motion.div>
              <span
                className={`mt-2 text-xs lg:text-sm text-center max-w-[80px] lg:max-w-none ${
                  isCurrent
                    ? 'text-purple-400 font-semibold'
                    : isCompleted
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

