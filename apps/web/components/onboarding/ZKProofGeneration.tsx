'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { SuccessAnimation } from '@/components/shared/SuccessAnimation'

interface ZKProofGenerationProps {
  onComplete: () => void
}

const proofs = [
  { id: 'age', name: 'Age Proof', description: 'Proving you are over 18' },
  { id: 'nationality', name: 'Nationality Proof', description: 'Proving your nationality' },
  { id: 'identity', name: 'Identity Proof', description: 'Proving unique identity' },
]

export function ZKProofGeneration({ onComplete }: ZKProofGenerationProps) {
  const [completedProofs, setCompletedProofs] = useState<string[]>([])
  const [allComplete, setAllComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (completedProofs.length < proofs.length) {
        const nextProof = proofs[completedProofs.length]
        setCompletedProofs([...completedProofs, nextProof.id])
      } else if (!allComplete) {
        setAllComplete(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [completedProofs, allComplete, onComplete])

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
          {proofs.map((proof, index) => {
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
                  {isProcessing && (
                    <motion.div
                      className="h-2 bg-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                    />
                  )}
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

