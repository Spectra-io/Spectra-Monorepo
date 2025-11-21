/**
 * Camera Component Types
 */

import { MockDNIData } from '@zk-identity/types'

export interface CameraCaptureProps {
  onCapture: (data: MockDNIData) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

export interface CaptureState {
  isCapturing: boolean
  hasPhoto: boolean
  photoDataUrl: string | null
  isProcessing: boolean
  documentDetected: boolean
}

export interface OCRResult {
  success: boolean
  data?: MockDNIData
  error?: string
  confidence?: number
}

export type { MockDNIData }
