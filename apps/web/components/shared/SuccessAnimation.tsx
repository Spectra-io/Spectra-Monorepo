'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface SuccessAnimationProps {
  message?: string
}

export function SuccessAnimation({ message = 'Success!' }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <CheckCircle2 className="w-16 h-16 text-green-500" />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-300"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}

