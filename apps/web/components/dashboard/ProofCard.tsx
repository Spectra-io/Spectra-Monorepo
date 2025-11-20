'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Flag, Fingerprint, CheckCircle2, Clock, ExternalLink } from 'lucide-react'

interface ProofCardProps {
  type: 'age' | 'nationality' | 'identity'
  title: string
  icon: React.ReactNode
  hash?: string
  status: 'generated' | 'pending' | 'error'
  createdAt?: Date
}

const iconMap = {
  age: Calendar,
  nationality: Flag,
  identity: Fingerprint,
}

export function ProofCard({ type, title, icon, hash, status, createdAt }: ProofCardProps) {
  const IconComponent = iconMap[type]

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full group cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-all">
              <IconComponent className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg text-gray-100 group-hover:text-purple-300 transition-colors">
                {title}
              </CardTitle>
            </div>
            {status === 'generated' && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            {status === 'pending' && (
              <Clock className="w-5 h-5 text-yellow-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'generated' && hash && (
            <>
              <div>
                <p className="text-xs text-gray-500 mb-2">Proof Hash:</p>
                <code className="text-xs bg-gray-800/50 p-2 rounded block overflow-x-auto font-mono text-purple-300">
                  {hash.substring(0, 16)}...
                </code>
              </div>
              {createdAt && (
                <p className="text-xs text-gray-500">
                  Created: {createdAt.toLocaleDateString()}
                </p>
              )}
              <button className="w-full text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 transition-colors">
                View Details
                <ExternalLink className="w-4 h-4" />
              </button>
            </>
          )}
          {status === 'pending' && (
            <div className="flex items-center gap-2 text-yellow-500">
              <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Generating...</span>
            </div>
          )}
          {status === 'error' && (
            <div className="text-red-400 text-sm">
              Error generating proof
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

