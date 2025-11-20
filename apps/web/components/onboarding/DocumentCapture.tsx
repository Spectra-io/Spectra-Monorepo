'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Camera, Upload, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface DocumentCaptureProps {
  onCapture: (data: any) => void
}

export function DocumentCapture({ onCapture }: DocumentCaptureProps) {
  const [captured, setCaptured] = useState(false)
  const [processing, setProcessing] = useState(false)

  async function handleCapture() {
    setProcessing(true)
    
    // Mock: Simular captura y procesamiento
    // En producción, aquí integrarías el componente de Isa: CameraCapture
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      dni: '12345678',
      fechaNacimiento: '1990-01-01',
      nacionalidad: 'Argentina',
    }
    
    setCaptured(true)
    setProcessing(false)
    onCapture(mockData)
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
          <Camera className="w-10 h-10 text-purple-400" />
        </motion.div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">
          Capture Your ID Document
        </h2>
        <p className="text-gray-400 text-lg">
          Take a clear photo of your identity document (DNI, passport, etc.)
        </p>
      </div>

      {!captured ? (
        <Card className="bg-gray-900/50 border border-gray-800 border-dashed p-8 lg:p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-32 h-48 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-600" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-gray-400">Click to capture or upload your document</p>
              <p className="text-sm text-gray-500">Make sure the document is well-lit and all text is visible</p>
            </div>
            <Button
              onClick={handleCapture}
              disabled={processing}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-medium"
            >
              {processing ? 'Processing...' : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Capture Document
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Document Captured</span>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray-400">Document processed successfully</p>
            <div className="bg-gray-800/50 p-3 rounded space-y-1">
              <p className="text-gray-300"><span className="text-gray-500">Name:</span> Juan Pérez</p>
              <p className="text-gray-300"><span className="text-gray-500">DNI:</span> 12345678</p>
              <p className="text-gray-300"><span className="text-gray-500">Nationality:</span> Argentina</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

