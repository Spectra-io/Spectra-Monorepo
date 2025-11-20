'use client'

import { useState, useRef } from 'react'
import { Camera } from 'react-camera-pro'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { extractDNIData, analyzeImageQuality, validateExtractedData } from './MockOCR'
import { CameraCaptureProps, CaptureState } from './types'
import { Camera as CameraIcon, RotateCcw, Check, X, Loader2, AlertTriangle } from 'lucide-react'

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

  // Handle camera error
  const handleCameraError = (error: any) => {
    console.error('Camera error:', error)
    setCameraError('Cannot access camera. Please check permissions.')
    onError?.('Cannot access camera')
  }

  // If camera error, show error message
  if (cameraError) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="py-12">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-100">
              Camera Not Available
            </h3>
            <p className="text-gray-400 mb-4">
              {cameraError}
            </p>
            {onCancel && (
              <Button onClick={onCancel} variant="outline">
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <CameraIcon className="w-6 h-6" />
            Capture Your ID
          </CardTitle>
          <p className="text-sm text-gray-400">
            Place your ID within the frame and ensure good lighting
          </p>
        </CardHeader>

        <CardContent>
          {/* Camera View */}
          {!state.hasPhoto && (
            <div className="relative">
              {/* Camera Component */}
              <div className="relative rounded-lg overflow-hidden bg-black aspect-[4/3]">
                <Camera
                  ref={camera}
                  aspectRatio={4 / 3}
                  errorMessages={{
                    noCameraAccessible: 'No camera available',
                    permissionDenied: 'Camera permission denied',
                    switchCamera: 'Cannot switch camera',
                    canvas: 'Canvas not supported'
                  }}
                  onError={handleCameraError}
                />

                {/* Overlay: Document guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-purple-500 border-dashed rounded-lg w-[80%] h-[70%] flex items-center justify-center">
                    <p className="text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                      Place ID here
                    </p>
                  </div>
                </div>
              </div>

              {/* Capture Button */}
              <div className="mt-6 flex gap-3 justify-center">
                <Button
                  onClick={handleCapture}
                  size="lg"
                  className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700"
                >
                  <CameraIcon className="w-8 h-8" />
                </Button>
                {onCancel && (
                  <Button
                    onClick={onCancel}
                    variant="outline"
                    size="lg"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Photo Preview */}
          {state.hasPhoto && state.photoDataUrl && !extractedData && (
            <div>
              <img
                src={state.photoDataUrl}
                alt="Captured ID"
                className="w-full rounded-lg mb-4"
              />

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  disabled={state.isProcessing}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleProcess}
                  disabled={state.isProcessing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {state.isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Process
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Extracted Data */}
          {extractedData && (
            <div className="space-y-4">
              <div className="bg-green-900/20 border-2 border-green-500/50 rounded-lg p-4 mb-4">
                <p className="text-green-400 font-medium text-center">
                  ✓ Document processed successfully
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold mb-3 text-gray-100">Extracted Data:</h3>

                <DataField label="Name" value={extractedData.nombre} />
                <DataField label="Last Name" value={extractedData.apellido} />
                <DataField label="DNI" value={extractedData.dni} />
                <DataField label="Date of Birth" value={extractedData.fechaNacimiento} />
                <DataField label="Nationality" value={extractedData.nacionalidad} />
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Data
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper component for displaying data fields
function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-700">
      <span className="text-gray-400 text-sm">{label}:</span>
      <span className="font-medium text-gray-100">{value}</span>
    </div>
  )
}
