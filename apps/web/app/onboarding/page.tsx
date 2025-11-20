export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Proceso de Onboarding
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Aquí se implementará el flujo de KYC:
          </p>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            <li>Captura de documento (DNI)</li>
            <li>Captura biométrica (huella/WebAuthn)</li>
            <li>Generación de pruebas ZK</li>
            <li>Fragmentación y almacenamiento</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
