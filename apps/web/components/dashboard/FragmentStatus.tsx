'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, Smartphone, Database, Cloud, Server, Globe } from 'lucide-react'

interface FragmentStatusProps {
  fragments?: Array<{
    location: string
    status: 'stored' | 'pending' | 'error'
  }>
}

const locationIcons = {
  'Local Browser': Smartphone,
  'Stellar Network': Globe,
  'Supabase': Database,
  'Redis': Server,
  'IPFS': Cloud,
}

const defaultFragments = [
  { location: 'Local Browser', status: 'stored' as const },
  { location: 'Stellar Network', status: 'stored' as const },
  { location: 'Supabase', status: 'stored' as const },
  { location: 'Redis', status: 'stored' as const },
  { location: 'IPFS', status: 'stored' as const },
]

export function FragmentStatus({ fragments = defaultFragments }: FragmentStatusProps) {
  return (
    <div className="space-y-4">
      {fragments.map((fragment, index) => {
        const Icon = locationIcons[fragment.location as keyof typeof locationIcons] || Database
        
        return (
          <motion.div
            key={fragment.location}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-purple-500/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-100">{fragment.location}</p>
                <p className="text-xs text-gray-500">Fragment stored</p>
              </div>
            </div>
            <div>
              {fragment.status === 'stored' && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              {fragment.status === 'pending' && (
                <Clock className="w-5 h-5 text-yellow-500" />
              )}
              {fragment.status === 'error' && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

