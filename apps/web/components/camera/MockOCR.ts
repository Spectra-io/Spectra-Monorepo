/**
 * Mock OCR - Simulates DNI data extraction
 * In production, this would use Tesseract.js or Google Vision API
 */

import { MockDNIData } from '@zk-identity/types'
import { MockDataGenerator } from '@/lib/MockDataGenerator'
import { OCRResult } from './types'

/**
 * Extract DNI data from image (Mock implementation)
 * Simulates OCR processing with realistic delay
 */
export async function extractDNIData(imageDataUrl: string): Promise<OCRResult> {
  // Simulate processing delay (300-800ms)
  const delay = Math.random() * 500 + 300
  await new Promise(resolve => setTimeout(resolve, delay))

  try {
    // Generate mock data
    const data = await MockDataGenerator.generate()

    // Simulate 95% success rate
    const success = Math.random() > 0.05

    if (!success) {
      return {
        success: false,
        error: 'Could not extract data from image. Please try again with better lighting.'
      }
    }

    return {
      success: true,
      data,
      confidence: 0.85 + Math.random() * 0.15 // 85-100% confidence
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during OCR'
    }
  }
}

/**
 * Analyze image quality
 * Checks if image is suitable for OCR
 */
export function analyzeImageQuality(imageDataUrl: string): {
  quality: 'good' | 'poor'
  message: string
  issues?: string[]
} {
  // In production, this would analyze:
  // - Contrast
  // - Brightness
  // - Sharpness
  // - Document detection

  // Simulate 80% good quality
  const isGood = Math.random() > 0.2

  if (isGood) {
    return {
      quality: 'good',
      message: 'Image quality is good. Processing...'
    }
  } else {
    const issues = []
    const rand = Math.random()

    if (rand < 0.33) {
      issues.push('Image is too dark')
    } else if (rand < 0.66) {
      issues.push('Image is blurry')
    } else {
      issues.push('Document not fully visible')
    }

    return {
      quality: 'poor',
      message: 'Image quality is poor. Please try again.',
      issues
    }
  }
}

/**
 * Validate extracted DNI data
 */
export function validateExtractedData(data: MockDNIData): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate DNI format
  if (!MockDataGenerator.validateDNI(data.dni)) {
    errors.push('Invalid DNI format')
  }

  // Validate age (must be 18+)
  if (!MockDataGenerator.validateAge(data.fechaNacimiento)) {
    errors.push('Must be 18 years or older')
  }

  // Validate nationality
  if (data.nacionalidad !== 'Argentina') {
    errors.push('Only Argentine IDs are supported')
  }

  // Validate required fields
  if (!data.nombre || data.nombre.trim().length === 0) {
    errors.push('Name is required')
  }

  if (!data.apellido || data.apellido.trim().length === 0) {
    errors.push('Last name is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
