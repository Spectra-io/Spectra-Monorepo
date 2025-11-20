'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { SuccessAnimation } from '@/components/shared/SuccessAnimation'
import { generateAllProofs } from '@zk-identity/zk-circuits'
import { useIdentityStore } from '@/store/useIdentityStore'

interface ZKProofGenerationProps {
  onComplete: () => void
  dniData?: {
    dni: string
    fechaNacimiento: string
    nacionalidad: string
  }
}

const proofSteps = [
  { id: 'age', name: 'Age Proof', description: 'Proving you are over 18' },
  { id: 'nationality', name: 'Nationality Proof', description: 'Proving your nationality' },
  { id: 'identity', name: 'Identity Proof', description: 'Proving unique identity' },
]

export function ZKProofGeneration({ onComplete, dniData }: ZKProofGenerationProps) {
  const [completedProofs, setCompletedProofs] = useState<string[]>([])
  const [allComplete, setAllComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setProof = useIdentityStore(state => state.setProof)

  useEffect(() => {
    generateProofs()
  }, [])

  async function generateProofs() {
    try {
      // Use DNI data if provided, otherwise use mock data
      const data = dniData || {
        dni: '12345678',
        fechaNacimiento: '1990-01-01',
        nacionalidad: 'Argentina'
      }

      // Simulate sequential proof generation with delays for UX
      // Age proof
      setCompletedProofs(['age'])
      const { ageProof, nationalityProof, identityProof } = await generateAllProofs(data)

      // Save age proof
      setProof('age', JSON.stringify(ageProof))
      await new Promise(resolve => setTimeout(resolve, 800))

      // Nationality proof
      setCompletedProofs(['age', 'nationality'])
      setProof('nationality', JSON.stringify(nationalityProof))
      await new Promise(resolve => setTimeout(resolve, 800))

      // Identity proof
      setCompletedProofs(['age', 'nationality', 'identity'])
      setProof('identity', JSON.stringify(identityProof))
      await new Promise(resolve => setTimeout(resolve, 800))

      // All complete
      setAllComplete(true)
      setTimeout(() => {
        onComplete()
      }, 1500)
    } catch (err) {
      console.error('Error generating proofs:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-300">Error generating proofs: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">
          Generating Zero Knowledge Proofs
        </h2>
        <p className="text-gray-400 text-lg">
          Creating cryptographic proofs without revealing your data
        </p>
      </div>

      {!allComplete ? (
        <div className="space-y-6">
          {proofSteps.map((proof, index) => {
            const isCompleted = completedProofs.includes(proof.id)
            const isProcessing = completedProofs.length === index && !isCompleted

            return (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-center gap-4">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : isProcessing ? (
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-700 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-100 mb-1">
                      {proof.name}
                    </h3>
                    <p className="text-sm text-gray-400">{proof.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <SuccessAnimation message="All proofs generated successfully!" />
      )}
    </div>
  )
}
