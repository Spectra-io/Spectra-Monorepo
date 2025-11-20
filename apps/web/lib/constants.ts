// Stellar Network Configuration
export const STELLAR_CONFIG = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET',
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org',
} as const

// ZK Proof Types
export const ZK_PROOF_TYPES = {
  AGE: 'age',
  NATIONALITY: 'nationality',
  IDENTITY: 'identity',
} as const

// Fragment Storage Locations
export const FRAGMENT_LOCATIONS = {
  LOCAL: 'local',
  STELLAR: 'stellar',
  IPFS: 'ipfs',
  SUPABASE: 'supabase',
  REDIS: 'redis',
} as const

// Shamir Secret Sharing Configuration
export const SHAMIR_CONFIG = {
  totalShares: 5,
  threshold: 3,
} as const
