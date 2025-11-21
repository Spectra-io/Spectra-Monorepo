'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useIdentityStore } from '@/store/useIdentityStore'
import { Header } from '@/components/Header'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { WalletConnect } from '@/components/onboarding/WalletConnect'
import { DocumentCapture } from '@/components/onboarding/DocumentCapture'
import { BiometricStep } from '@/components/onboarding/BiometricStep'
import { ZKProofGeneration } from '@/components/onboarding/ZKProofGeneration'
import { FragmentationStep } from '@/components/onboarding/FragmentationStep'
import { Card } from '@/components/ui/card'

const STEPS = [
  { id: 1, title: 'Wallet', icon: '🔗' },
  { id: 2, title: 'Document', icon: '📷' },
  { id: 3, title: 'Biometric', icon: '👆' },
  { id: 4, title: 'ZK Proofs', icon: '🔐' },
  { id: 5, title: 'Fragment', icon: '🧩' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [dniData, setDniData] = useState<any>(null)
  const {
    setStellarPublicKey,
    setBiometricId,
    setKycStep,
    setProof,
    completeKyc,
  } = useIdentityStore()

  const handleWalletConnect = (publicKey: string) => {
    setStellarPublicKey(publicKey)
    setKycStep('document')
    setCurrentStep(2)
  }

  const handleDocumentCapture = (data: any) => {
    setDniData(data)
    setKycStep('biometric')
    setCurrentStep(3)
  }

  const handleBiometricCapture = (bioId: string) => {
    setBiometricId(bioId)
    setKycStep('zk-generation')
    setCurrentStep(4)
  }

  const handleProofGeneration = () => {
    // Mock: Generar pruebas ZK
    setProof('age', '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''))
    setProof('nationality', '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''))
    setProof('identity', '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''))
    setCurrentStep(5)
  }

  const handleFragmentationComplete = () => {
    completeKyc()
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Header />
      <section className="relative overflow-hidden px-5 pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-purple-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.25),transparent_60%)]"></div>
        <div className="relative max-w-4xl mx-auto">
          {/* Step Indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-900/50 border border-gray-800 p-6 lg:p-8">
                {currentStep === 1 && (
                  <WalletConnect onConnect={handleWalletConnect} />
                )}

                {currentStep === 2 && (
                  <DocumentCapture onCapture={handleDocumentCapture} />
                )}

                {currentStep === 3 && (
                  <BiometricStep
                    userId={dniData?.dni ?? ''}
                    userName={dniData ? `${dniData.nombre} ${dniData.apellido}` : ''}
                    onCapture={handleBiometricCapture}
                  />
                )}

                {currentStep === 4 && (
                  <ZKProofGeneration onComplete={handleProofGeneration} />
                )}

                {currentStep === 5 && (
                  <FragmentationStep onComplete={handleFragmentationComplete} />
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}
