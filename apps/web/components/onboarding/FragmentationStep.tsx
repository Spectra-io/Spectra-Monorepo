'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Smartphone, Database, Cloud, Server, Globe } from 'lucide-react'
import { SuccessAnimation } from '@/components/shared/SuccessAnimation'

interface FragmentationStepProps {
  onComplete: () => void
}

const storageLocations = [
  { id: 'browser', name: 'Local Browser', icon: Smartphone, delay: 0.5 },
  { id: 'stellar', name: 'Stellar Network', icon: Globe, delay: 1 },
  { id: 'supabase', name: 'Supabase', icon: Database, delay: 1.5 },
  { id: 'redis', name: 'Redis', icon: Server, delay: 2 },
  { id: 'ipfs', name: 'IPFS', icon: Cloud, delay: 2.5 },
]

export function FragmentationStep({ onComplete }: FragmentationStepProps) {
  const [completedLocations, setCompletedLocations] = useState<string[]>([])
  const [allComplete, setAllComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (completedLocations.length < storageLocations.length) {
        const nextLocation = storageLocations[completedLocations.length]
        setTimeout(() => {
          setCompletedLocations([...completedLocations, nextLocation.id])
        }, nextLocation.delay * 1000)
      } else if (!allComplete && completedLocations.length === storageLocations.length) {
        setAllComplete(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [completedLocations, allComplete, onComplete])

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">
          Fragmenting and Distributing Data
        </h2>
        <p className="text-gray-400 text-lg">
          Your data is being encrypted and distributed across multiple secure locations
        </p>
      </div>

      {!allComplete ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storageLocations.map((location) => {
            const isCompleted = completedLocations.includes(location.id)
            const isProcessing = completedLocations.length === storageLocations.findIndex(l => l.id === location.id) && !isCompleted

            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    isCompleted 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-purple-500/10 border border-purple-500/20'
                  }`}>
                    <location.icon className={`w-5 h-5 ${
                      isCompleted ? 'text-green-400' : 'text-purple-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-100">{location.name}</h3>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isProcessing ? (
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  ) : null}
                </div>
                {isProcessing && (
                  <motion.div
                    className="h-1 bg-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5 }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <SuccessAnimation message="Data fragmented and distributed successfully!" />
      )}
    </div>
  )
}

