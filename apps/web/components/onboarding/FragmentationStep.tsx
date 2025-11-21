'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Smartphone, Database, Cloud, Server, Globe } from 'lucide-react'
import { SuccessAnimation } from '@/components/shared/SuccessAnimation'
import { protectData } from '@zk-identity/crypto'
import { useIdentityStore } from '@/store/useIdentityStore'

interface FragmentationStepProps {
  onComplete: () => void
}

const storageLocations = [
  { id: 'local', name: 'Local Browser', icon: Smartphone, delay: 0.5 },
  { id: 'stellar', name: 'Stellar Network', icon: Globe, delay: 1 },
  { id: 'supabase', name: 'Supabase', icon: Database, delay: 1.5 },
  { id: 'redis', name: 'Redis', icon: Server, delay: 2 },
  { id: 'ipfs', name: 'IPFS', icon: Cloud, delay: 2.5 },
]

export function FragmentationStep({ onComplete }: FragmentationStepProps) {
  const [completedLocations, setCompletedLocations] = useState<string[]>([])
  const [allComplete, setAllComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { stellarPublicKey, biometricId, proofs } = useIdentityStore()

  useEffect(() => {
    fragmentAndDistribute()
  }, [])

  async function fragmentAndDistribute() {
    try {
      // 1. Prepare data to protect (combine all sensitive data)
      const dataToProtect = JSON.stringify({
        stellarPublicKey,
        biometricId,
        proofs,
        timestamp: new Date().toISOString()
      })

      // 2. Encrypt and fragment data (generates 5 fragments with 3-of-5 threshold)
      const { fragments, encryptionKey, metadata } = await protectData(dataToProtect)

      console.log('Data protected:', { fragments: fragments.length, metadata })

      // 3. Simulate distribution to each location with delays
      for (let i = 0; i < storageLocations.length; i++) {
        const location = storageLocations[i]

        // Wait for the location's delay
        await new Promise(resolve => setTimeout(resolve, location.delay * 1000))

        // Simulate storing the fragment
        await storeFragment(location.id, fragments[i], encryptionKey)

        // Mark as completed
        setCompletedLocations(prev => [...prev, location.id])
      }

      // 4. All fragments distributed
      setAllComplete(true)
      setTimeout(() => {
        onComplete()
      }, 1500)

    } catch (err) {
      console.error('Error fragmenting data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  async function storeFragment(location: string, fragment: string, encryptionKey: string) {
    // Mock storage - in production, these would be real API calls
    switch (location) {
      case 'local':
        // Store in localStorage or IndexedDB
        if (typeof window !== 'undefined') {
          localStorage.setItem('zk_fragment_local', fragment)
          localStorage.setItem('zk_encryption_key', encryptionKey)
        }
        break

      case 'stellar':
        // Would call: await storeDataEntry(stellarPublicKey, 'zk_fragment', fragment.substring(0, 64))
        console.log('Stored fragment on Stellar (mock)')
        break

      case 'supabase':
        // Would call Supabase API
        console.log('Stored fragment on Supabase (mock)')
        break

      case 'redis':
        // Would call Redis/Upstash API
        console.log('Stored fragment on Redis (mock)')
        break

      case 'ipfs':
        // Would upload to IPFS
        console.log('Stored fragment on IPFS (mock)')
        break

      default:
        console.log(`Stored fragment on ${location}`)
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-300">Error fragmenting data: {error}</p>
        </div>
      </div>
    )
  }

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
          {storageLocations.map((location, index) => {
            const isCompleted = completedLocations.includes(location.id)
            const isProcessing = completedLocations.length === index && !isCompleted

            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
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
                    transition={{ duration: location.delay }}
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
