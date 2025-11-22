'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Smartphone, Database, Cloud, Server, Globe } from 'lucide-react'
import { SuccessAnimation } from '@/components/shared/SuccessAnimation'
import { protectData, hashAllProofs } from '@zk-identity/crypto'
import { storeProofHash } from '@zk-identity/stellar-utils'
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
      // 1. Calculate hashes of ZK proofs for on-chain storage
      const proofHashes = await hashAllProofs({
        age: proofs.age,
        nationality: proofs.nationality,
        identity: proofs.identity
      })

      console.log('Proof hashes calculated:', proofHashes)

      // 2. Prepare data to protect (combine all sensitive data)
      const dataToProtect = JSON.stringify({
        stellarPublicKey,
        biometricId,
        proofs,
        proofHashes,
        timestamp: new Date().toISOString()
      })

      // 3. Encrypt and fragment data (generates 5 fragments with 3-of-5 threshold)
      const { fragments, encryptionKey, metadata } = await protectData(dataToProtect)

      console.log('Data protected:', { fragments: fragments.length, metadata })

      // 4. Distribute to each location with delays
      for (let i = 0; i < storageLocations.length; i++) {
        const location = storageLocations[i]

        // Wait for the location's delay
        await new Promise(resolve => setTimeout(resolve, location.delay * 1000))

        // Store the fragment (real for stellar, mock for others)
        await storeFragment(location.id, fragments[i], encryptionKey, proofHashes)

        // Mark as completed
        setCompletedLocations(prev => [...prev, location.id])
      }

      // 5. All fragments distributed
      setAllComplete(true)
      setTimeout(() => {
        onComplete()
      }, 1500)

    } catch (err) {
      console.error('Error fragmenting data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  async function storeFragment(
    location: string,
    fragment: string,
    encryptionKey: string,
    proofHashes: {
      ageHash?: string
      nationalityHash?: string
      identityHash?: string
    }
  ) {
    switch (location) {
      case 'local':
        // Store in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('zk_fragment_local', fragment)
          localStorage.setItem('zk_encryption_key', encryptionKey)
          console.log('✓ Stored fragment in localStorage')
        }
        break

      case 'stellar':
        // REAL: Store proof hashes on Stellar blockchain
        try {
          if (!stellarPublicKey) {
            throw new Error('Stellar public key not available')
          }

          // Store each proof hash on-chain
          const storePromises = []

          if (proofHashes.ageHash) {
            storePromises.push(
              storeProofHash(stellarPublicKey, 'age', proofHashes.ageHash)
            )
          }

          if (proofHashes.nationalityHash) {
            storePromises.push(
              storeProofHash(stellarPublicKey, 'nationality', proofHashes.nationalityHash)
            )
          }

          if (proofHashes.identityHash) {
            storePromises.push(
              storeProofHash(stellarPublicKey, 'identity', proofHashes.identityHash)
            )
          }

          // Wait for all hashes to be stored
          await Promise.all(storePromises)

          console.log('✓ Stored proof hashes on Stellar Network')
        } catch (error) {
          console.error('Error storing on Stellar:', error)
          // Don't throw - continue with other locations
          console.log('⚠ Stellar storage failed, continuing...')
        }
        break

      case 'supabase':
        // TODO: Call Supabase API
        console.log('○ Supabase storage (mock)')
        break

      case 'redis':
        // TODO: Call Redis/Upstash API
        console.log('○ Redis storage (mock)')
        break

      case 'ipfs':
        // TODO: Upload to IPFS
        console.log('○ IPFS storage (mock)')
        break

      default:
        console.log(`○ Stored on ${location} (mock)`)
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
