// Re-export hashing helpers from the biometric component implementation
// This wrapper preserves the absolute import path `@/lib/HashingUtils`
export { generateUniqueIdentifier, sha256, generateSalt, sha256WithSalt, verifyHashWithSalt, arrayBufferToHex, hexToArrayBuffer } from '../components/biometric/HashingUtils'
