'use client'

import { useState, useRef } from 'react'
import { Camera } from 'react-camera-pro'
import { Button } from '@/components/ui/button'
import { extractDNIData, analyzeImageQuality, validateExtractedData } from './MockOCR'
import { CameraCaptureProps, CaptureState } from './types'
import { Camera as CameraIcon, RotateCcw, Check, Loader2, AlertTriangle, ScanLine } from 'lucide-react'

export default function CameraCapture({ onCapture, onError, onCancel }: CameraCaptureProps) {
  const camera = useRef<any>(null)

  const [state, setState] = useState<CaptureState>({
    isCapturing: false,
    hasPhoto: false,
    photoDataUrl: null,
    isProcessing: false,
    documentDetected: false
  })

  const [extractedData, setExtractedData] = useState<any>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Capture photo
  const handleCapture = () => {
    if (camera.current) {
      try {
        const photo = camera.current.takePhoto()
        setState(prev => ({
          ...prev,
          hasPhoto: true,
          photoDataUrl: photo,
          isCapturing: false
        }))
      } catch (error) {
        console.error('Error capturing photo:', error)
        onError?.('Failed to capture photo. Please try again.')
      }
    }
  }

  // Retake photo
  const handleRetake = () => {
    setState({
      isCapturing: false,
      hasPhoto: false,
      photoDataUrl: null,
      isProcessing: false,
      documentDetected: false
    })
    setExtractedData(null)
  }

  // Process photo and extract data
  const handleProcess = async () => {
    if (!state.photoDataUrl) return

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      // 1. Analyze image quality
      const qualityCheck = analyzeImageQuality(state.photoDataUrl)

      if (qualityCheck.quality === 'poor') {
        throw new Error(qualityCheck.message + (qualityCheck.issues ? ': ' + qualityCheck.issues.join(', ') : ''))
      }

      // 2. Extract DNI data (Mock OCR)
      const ocrResult = await extractDNIData(state.photoDataUrl)

      if (!ocrResult.success || !ocrResult.data) {
        throw new Error(ocrResult.error || 'Failed to extract data from image')
      }

      // 3. Validate extracted data
      const validation = validateExtractedData(ocrResult.data)

      if (!validation.valid) {
        throw new Error('Invalid data: ' + validation.errors.join(', '))
      }

      // 4. Success - update state
      setExtractedData(ocrResult.data)

      setState(prev => ({
        ...prev,
        isProcessing: false,
        documentDetected: true
      }))
    } catch (error) {
      setState(prev => ({ ...prev, isProcessing: false }))
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      onError?.(errorMessage)

      // Auto-retry after 2 seconds
      setTimeout(handleRetake, 2000)
    }
  }

  // Confirm and send data
  const handleConfirm = () => {
    if (extractedData) {
      onCapture(extractedData)
    }
  }

  // If camera error, show error message
  if (cameraError) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-100">
            Camera Not Available
          </h3>
          <p className="text-gray-400 mb-6">
            {cameraError}
          </p>
          {onCancel && (
            <Button onClick={onCancel} variant="outline" className="border-gray-700">
              Go Back
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Camera View */}
      {!state.hasPhoto && (
        <div className="space-y-6">
          {/* Instruction - centered above camera */}
          <div className="text-center">
            <p className="text-gray-300 text-lg font-medium flex items-center justify-center gap-2">
              <ScanLine className="w-5 h-5 text-purple-400" />
              Place your ID within the frame and ensure good lighting
            </p>
          </div>

          {/* Camera Container */}
          <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-gray-800 shadow-2xl">
            {/* Camera Component */}
            <div className="aspect-[4/3]">
              <Camera
                ref={camera}
                aspectRatio={4 / 3}
                errorMessages={{
                  noCameraAccessible: 'No camera available',
                  permissionDenied: 'Camera permission denied',
                  switchCamera: 'Cannot switch camera',
                  canvas: 'Canvas not supported'
                }}
              />
            </div>

            {/* Overlay: Document guide frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Corner markers for document area */}
              <div className="relative w-[85%] h-[75%]">
                {/* Top-left corner */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-lg" />
                {/* Top-right corner */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-lg" />
                {/* Bottom-left corner */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-lg" />
                {/* Bottom-right corner */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-lg" />

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    Place ID here
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Main CTA Button */}
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={handleCapture}
              size="lg"
              className="w-full max-w-md bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-purple-600/25 transition-all hover:shadow-purple-600/40"
            >
              <CameraIcon className="w-6 h-6 mr-3" />
              Capture Your ID
            </Button>

            {onCancel && (
              <Button
                onClick={onCancel}
                variant="ghost"
                className="text-gray-400 hover:text-gray-300"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Photo Preview */}
      {state.hasPhoto && state.photoDataUrl && !extractedData && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 text-lg font-medium">
              Review your captured photo
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl">
            <img
              src={state.photoDataUrl}
              alt="Captured ID"
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleRetake}
              variant="outline"
              size="lg"
              disabled={state.isProcessing}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl py-5"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Photo
            </Button>
            <Button
              onClick={handleProcess}
              size="lg"
              disabled={state.isProcessing}
              className="bg-purple-600 hover:bg-purple-700 rounded-xl py-5 shadow-lg shadow-purple-600/25"
            >
              {state.isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Process Document
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Extracted Data */}
      {extractedData && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-900/20 border-2 border-green-500/50 rounded-xl p-4">
            <p className="text-green-400 font-semibold text-center flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Document processed successfully
            </p>
          </div>

          {/* Data Card */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-100 text-lg mb-4">Extracted Information</h3>

            <DataField label="Name" value={extractedData.nombre} />
            <DataField label="Last Name" value={extractedData.apellido} />
            <DataField label="DNI" value={extractedData.dni} />
            <DataField label="Date of Birth" value={extractedData.fechaNacimiento} />
            <DataField label="Nationality" value={extractedData.nacionalidad} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleRetake}
              variant="outline"
              size="lg"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl py-5"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Photo
            </Button>
            <Button
              onClick={handleConfirm}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 rounded-xl py-5 shadow-lg shadow-purple-600/25"
            >
              <Check className="w-5 h-5 mr-2" />
              Confirm & Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper component for displaying data fields
function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-100">{value}</span>
    </div>
  )
}
