// Declaraciones para '@simplewebauthn/types' con tipos adecuados
// Estas interfaces cubren los campos que usa `WebAuthnHelper.ts`.
declare module '@simplewebauthn/types' {
	export interface PublicKeyCredentialCreationOptionsJSON {
		challenge: string
		rp: {
			name: string
			id?: string
		}
		user: {
			id: string
			name: string
			displayName?: string
		}
		pubKeyCredParams?: Array<{ alg: number; type: 'public-key' }>
		timeout?: number
		attestation?: 'none' | 'indirect' | 'direct' | 'enterprise'
		authenticatorSelection?: {
			authenticatorAttachment?: 'platform' | 'cross-platform'
			requireResidentKey?: boolean
			userVerification?: 'required' | 'preferred' | 'discouraged'
		}
		excludeCredentials?: Array<{
			id: string
			type: 'public-key'
			transports?: AuthenticatorTransport[]
		}>
		extensions?: Record<string, unknown>
	}

	export interface PublicKeyCredentialRequestOptionsJSON {
		challenge: string
		rpId?: string
		allowCredentials?: Array<{
			id: string
			type: 'public-key'
			transports?: AuthenticatorTransport[]
		}>
		userVerification?: 'required' | 'preferred' | 'discouraged'
		timeout?: number
		extensions?: Record<string, unknown>
	}

	export interface RegistrationResponseJSON {
		id: string
		rawId?: string
		response: {
			attestationObject?: string
			clientDataJSON: string
			publicKey?: string
		}
		type?: string
	}

	export interface AuthenticationResponseJSON {
		id: string
		rawId?: string
		response: {
			authenticatorData?: string
			clientDataJSON: string
			signature?: string
			userHandle?: string | null
		}
		type?: string
	}
}
