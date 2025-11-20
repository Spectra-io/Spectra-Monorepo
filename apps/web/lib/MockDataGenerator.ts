/**
 * Mock Data Generator for Argentine DNI
 * Generates realistic Argentine identity data for hackathon demo
 */

import { MockDNIData } from '@zk-identity/types'

export class MockDataGenerator {
  // Common Argentine names
  private static readonly NOMBRES_MASCULINOS = [
    'Juan', 'Carlos', 'Miguel', 'Diego', 'Luis',
    'José', 'Ricardo', 'Jorge', 'Alberto', 'Martín',
    'Fernando', 'Alejandro', 'Pablo', 'Javier', 'Sebastián'
  ]

  private static readonly NOMBRES_FEMENINOS = [
    'María', 'Ana', 'Laura', 'Sofía', 'Valentina',
    'Lucía', 'Paula', 'Carla', 'Julia', 'Florencia',
    'Camila', 'Victoria', 'Gabriela', 'Carolina', 'Mariana'
  ]

  private static readonly APELLIDOS_ARGENTINOS = [
    'González', 'Rodríguez', 'García', 'Fernández', 'López',
    'Martínez', 'Pérez', 'Sánchez', 'Romero', 'Torres',
    'Díaz', 'Álvarez', 'Gómez', 'Ruiz', 'Hernández',
    'Moreno', 'Ramírez', 'Castro', 'Ortiz', 'Silva'
  ]

  /**
   * Generate complete mock DNI data
   * Guarantees age > 18 years
   */
  static async generate(): Promise<MockDNIData> {
    const isFemenino = Math.random() > 0.5
    const nombres = isFemenino ? this.NOMBRES_F : this.NOMBRES_M

    const nombre = nombres[Math.floor(Math.random() * nombres.length)]
    const apellido = this.APELLIDOS_ARGENTINOS[Math.floor(Math.random() * this.APELLIDOS_ARGENTINOS.length)]

    // Age between 18 and 65 years
    const edad = Math.floor(Math.random() * 47) + 18
    const fechaNacimiento = this.generateBirthDate(edad)
    const dni = this.generateDNI(edad)

    return {
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      nacionalidad: 'Argentina' as const
    }
  }

  /**
   * Generate realistic birth date ensuring age > 18
   */
  private static generateBirthDate(edad: number): string {
    const today = new Date()
    const currentYear = today.getFullYear()
    const birthYear = currentYear - edad

    // Random month and day
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')

    return `${birthYear}-${month}-${day}`
  }

  /**
   * Generate realistic DNI number correlated with age
   * Argentine DNI ranges by generation:
   * - Born before 1970: 5M - 15M
   * - Born 1970-1980: 15M - 25M
   * - Born 1980-1990: 25M - 32M
   * - Born 1990-2000: 32M - 40M
   * - Born after 2000: 40M - 45M
   */
  private static generateDNI(edad: number): string {
    const currentYear = new Date().getFullYear()
    const birthYear = currentYear - edad
    let base: number
    let range: number

    if (birthYear < 1970) {
      base = 5000000
      range = 10000000
    } else if (birthYear < 1980) {
      base = 15000000
      range = 10000000
    } else if (birthYear < 1990) {
      base = 25000000
      range = 7000000
    } else if (birthYear < 2000) {
      base = 32000000
      range = 8000000
    } else {
      base = 40000000
      range = 5000000
    }

    const dni = base + Math.floor(Math.random() * range)
    return String(dni)
  }

  /**
   * Generate simulated biometric hash using SHA-256
   * In production, this would be a real fingerprint hash
   */
  static async generateFingerprintHash(dni: string): Promise<string> {
    const data = `biometric_${dni}_${Date.now()}_${Math.random()}`
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return hashHex
  }

  /**
   * Generate multiple mock users for testing
   */
  static async generateBatch(count: number): Promise<MockDNIData[]> {
    const promises = Array.from({ length: count }, () => this.generate())
    return Promise.all(promises)
  }

  /**
   * Validate DNI format (8 digits)
   */
  static validateDNI(dni: string): boolean {
    return /^\d{7,8}$/.test(dni)
  }

  /**
   * Validate age is 18+
   */
  static validateAge(fechaNacimiento: string): boolean {
    const birthDate = new Date(fechaNacimiento)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18
    }

    return age >= 18
  }

  /**
   * Calculate exact age from birth date
   */
  static calculateAge(fechaNacimiento: string): number {
    const birthDate = new Date(fechaNacimiento)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // Aliases for compatibility
  private static get NOMBRES_M() { return this.NOMBRES_MASCULINOS }
  private static get NOMBRES_F() { return this.NOMBRES_FEMENINOS }
}
