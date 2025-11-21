'use client'

import CameraCapture from '@/components/camera/CameraCapture'
import { MockDNIData } from '@zk-identity/types'

interface DocumentCaptureProps {
  onCapture: (data: MockDNIData) => void
}

export function DocumentCapture({ onCapture }: DocumentCaptureProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">
          Capture Your ID Document
        </h2>
        <p className="text-gray-400 text-lg">
          Take a clear photo of your Argentine ID (DNI)
        </p>
      </div>

      <CameraCapture
        onCapture={onCapture}
        onError={(error) => {
          console.error('Document capture error:', error)
        }}
      />
    </div>
  )
}
