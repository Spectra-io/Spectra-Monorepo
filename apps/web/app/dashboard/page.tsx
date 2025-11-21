'use client'

import { motion } from 'framer-motion'
import { useIdentityStore } from '@/store/useIdentityStore'
import { Header } from '@/components/Header'
import { ProofCard } from '@/components/dashboard/ProofCard'
import { FragmentStatus } from '@/components/dashboard/FragmentStatus'
import { StellarAccount } from '@/components/dashboard/StellarAccount'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Flag, Fingerprint, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const {
    stellarPublicKey,
    kycCompleted,
    proofs,
    reset,
  } = useIdentityStore()

  const handleDisconnect = () => {
    reset()
    router.push('/')
  }

  if (!kycCompleted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-x-hidden">
        <Header />
        <section className="relative overflow-hidden px-5 pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-purple-900/20 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.25),transparent_60%)]"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Shield className="w-20 h-20 mx-auto text-purple-400" />
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-100">
                Complete KYC First
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                You need to complete the KYC process to access your dashboard and ZK proofs.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Link href="/onboarding">Start KYC Process</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-x-hidden">
      <Header />
      <section className="relative overflow-hidden px-5 pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-purple-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.25),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-100 mb-4">
              My ZK Identity
            </h1>
            <p className="text-lg text-gray-400">
              Manage your Zero Knowledge proofs and identity verification
            </p>
          </motion.div>

          {/* ZK Proofs Grid */}
          <div className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-100 mb-6">
              Zero Knowledge Proofs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProofCard
                type="age"
                title="Age Proof"
                icon={<Calendar />}
                hash={proofs.age}
                status={proofs.age ? 'generated' : 'pending'}
                createdAt={proofs.age ? new Date() : undefined}
              />
              <ProofCard
                type="nationality"
                title="Nationality Proof"
                icon={<Flag />}
                hash={proofs.nationality}
                status={proofs.nationality ? 'generated' : 'pending'}
                createdAt={proofs.nationality ? new Date() : undefined}
              />
              <ProofCard
                type="identity"
                title="Identity Proof"
                icon={<Fingerprint />}
                hash={proofs.identity}
                status={proofs.identity ? 'generated' : 'pending'}
                createdAt={proofs.identity ? new Date() : undefined}
              />
            </div>
          </div>

          {/* Stellar Account and Fragments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StellarAccount
              publicKey={stellarPublicKey}
              onDisconnect={handleDisconnect}
            />

            <Card className="bg-gray-900/50 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Fragment Storage Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FragmentStatus />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
