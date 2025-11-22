'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Wallet, CheckCircle2, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
// Demo mode - imports removed for hardcoded wallet

interface WalletConnectProps {
  onConnect: (publicKey: string) => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // DEMO MODE: Hardcoded wallet for video demo
  const DEMO_PUBLIC_KEY = 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37'

  async function handleConnect() {
    try {
      setLoading(true)
      setError(null)

      console.log('Connecting demo wallet...')

      // Simulate connection delay for realistic demo
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('Wallet connected! Public key:', DEMO_PUBLIC_KEY)

      setPublicKey(DEMO_PUBLIC_KEY)
      setConnected(true)
      onConnect(DEMO_PUBLIC_KEY)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Connection failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20"
        >
          <Wallet className="w-10 h-10 text-purple-400" />
        </motion.div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">
          Connect Your Stellar Wallet
        </h2>
        <p className="text-gray-400 text-lg">
          Demo Mode - Automatic Connection
        </p>
      </div>

      {error && (
        <div className="border rounded-lg p-4 flex items-start gap-3 bg-red-900/20 border-red-500/30">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        </div>
      )}

      {!connected ? (
        <div className="space-y-4">
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-400" />
              <p className="text-sm font-semibold text-gray-200">
                Demo Wallet Ready
              </p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              This demo uses a pre-configured Stellar testnet wallet for showcase purposes.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed text-xs">
              Address: {DEMO_PUBLIC_KEY.slice(0, 8)}...{DEMO_PUBLIC_KEY.slice(-8)}
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleConnect}
              disabled={loading}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-medium"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Wallet Connected</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Public Key:</p>
            <p className="font-mono text-sm text-gray-300 break-all bg-gray-800/50 p-3 rounded">
              {publicKey}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
