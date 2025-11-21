/**
 * Stellar Network utilities for ZK Identity
 * Helper functions for interacting with Stellar Network and Freighter wallet
 */

import * as StellarSdk from '@stellar/stellar-sdk'

// Stellar server instance (Testnet)
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org')

// Network passphrase (Testnet)
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET

/**
 * Connect to Freighter wallet
 * @returns Public key of connected wallet
 */
export async function connectWallet(): Promise<string> {
  try {
    // Check if Freighter is installed
    if (!window.freighter) {
      throw new Error('Freighter wallet not installed. Please install Freighter extension.')
    }

    // Check if Freighter API is available
    const { isConnected } = await window.freighter.isConnected()

    if (!isConnected) {
      throw new Error('Freighter wallet not connected')
    }

    // Request access to public key
    const publicKey = await window.freighter.getPublicKey()

    if (!publicKey) {
      throw new Error('Failed to get public key from Freighter')
    }

    return publicKey
  } catch (error) {
    throw new Error(`Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get Stellar account data
 * @param publicKey - Stellar public key
 * @returns Account data
 */
export async function getAccountData(publicKey: string): Promise<any> {
  try {
    const account = await server.loadAccount(publicKey)
    return account
  } catch (error) {
    if (error instanceof Error && error.message.includes('Account not found')) {
      throw new Error('Account not found. Make sure the account is funded on testnet.')
    }
    throw new Error(`Failed to load account: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Store data entry on Stellar account
 * @param publicKey - Stellar public key
 * @param key - Data entry key (max 64 bytes)
 * @param value - Data entry value (max 64 bytes)
 * @returns Transaction result
 */
export async function storeDataEntry(
  publicKey: string,
  key: string,
  value: string
): Promise<any> {
  try {
    // Validate key and value length
    if (key.length > 64) {
      throw new Error('Data entry key too long (max 64 bytes)')
    }

    if (value.length > 64) {
      throw new Error('Data entry value too long (max 64 bytes)')
    }

    // Load account
    const account = await server.loadAccount(publicKey)

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE
    })
      .addOperation(
        StellarSdk.Operation.manageData({
          name: key,
          value: value
        })
      )
      .setTimeout(180) // 3 minutes
      .build()

    // Sign with Freighter
    if (!window.freighter) {
      throw new Error('Freighter wallet not available')
    }

    const signedXdr = await window.freighter.signTransaction(
      transaction.toXDR(),
      { network: 'TESTNET', networkPassphrase: NETWORK_PASSPHRASE }
    )

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)

    // Submit transaction
    const result = await server.submitTransaction(signedTx as StellarSdk.Transaction)

    return result
  } catch (error) {
    throw new Error(`Failed to store data entry: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Read data entry from Stellar account
 * @param publicKey - Stellar public key
 * @param key - Data entry key
 * @returns Data entry value or null if not found
 */
export async function readDataEntry(
  publicKey: string,
  key: string
): Promise<string | null> {
  try {
    const account = await server.loadAccount(publicKey)

    // Access data entries
    const dataEntries = account.data_attr

    if (!dataEntries || !dataEntries[key]) {
      return null
    }

    // Decode from base64
    const value = Buffer.from(dataEntries[key], 'base64').toString('utf8')

    return value
  } catch (error) {
    console.error('Error reading data entry:', error)
    return null
  }
}

/**
 * Store ZK proof hash on Stellar account
 * @param publicKey - Stellar public key
 * @param proofType - Type of proof
 * @param proofHash - Hash of the proof
 * @returns Transaction result
 */
export async function storeProofHash(
  publicKey: string,
  proofType: 'age' | 'nationality' | 'identity',
  proofHash: string
): Promise<any> {
  try {
    // Stellar data entry keys are max 64 bytes
    const key = `zk_${proofType}_proof`

    // If hash is too long, truncate or split
    const value = proofHash.substring(0, 64)

    return await storeDataEntry(publicKey, key, value)
  } catch (error) {
    throw new Error(`Failed to store proof hash: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Read ZK proof hash from Stellar account
 * @param publicKey - Stellar public key
 * @param proofType - Type of proof
 * @returns Proof hash or null
 */
export async function readProofHash(
  publicKey: string,
  proofType: 'age' | 'nationality' | 'identity'
): Promise<string | null> {
  const key = `zk_${proofType}_proof`
  return await readDataEntry(publicKey, key)
}

/**
 * Verify ZK proof on Soroban contract (Mock implementation for hackathon)
 * In production, this would call a real Soroban smart contract
 * @param proof - ZK proof data
 * @returns Verification result
 */
export async function verifyProofOnChain(proof: any): Promise<boolean> {
  // Mock implementation
  console.log('Verifying proof on-chain (mock):', proof)

  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Always return true for hackathon demo
  return true
}

/**
 * Check account balance
 * @param publicKey - Stellar public key
 * @returns Balance in XLM
 */
export async function getAccountBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey)

    // Find XLM balance
    const xlmBalance = account.balances.find(
      (balance: any) => balance.asset_type === 'native'
    )

    return xlmBalance ? xlmBalance.balance : '0'
  } catch (error) {
    throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Fund account on testnet (for development)
 * @param publicKey - Stellar public key
 * @returns Friendbot response
 */
export async function fundTestnetAccount(publicKey: string): Promise<any> {
  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    )

    if (!response.ok) {
      throw new Error('Failed to fund account')
    }

    return await response.json()
  } catch (error) {
    throw new Error(`Friendbot error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Type declarations for Freighter
declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<{ isConnected: boolean }>
      getPublicKey: () => Promise<string>
      signTransaction: (xdr: string, options: any) => Promise<string>
    }
  }
}
