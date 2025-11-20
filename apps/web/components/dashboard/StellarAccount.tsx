'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface StellarAccountProps {
  publicKey: string | null
  onDisconnect?: () => void
}

export function StellarAccount({ publicKey, onDisconnect }: StellarAccountProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!publicKey) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Stellar Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No wallet connected</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-purple-400" />
          </div>
          <CardTitle className="text-gray-100">Stellar Account</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-2">Public Key:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm bg-gray-800/50 p-3 rounded font-mono text-gray-300 break-all">
              {publicKey}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="border-gray-700 hover:bg-gray-800"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-700 hover:bg-gray-800"
            asChild
          >
            <a
              href={`https://stellar.expert/explorer/public/account/${publicKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              View on Explorer
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
          {onDisconnect && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              className="border-red-700 hover:bg-red-900/20 text-red-400 hover:text-red-300"
            >
              Disconnect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

