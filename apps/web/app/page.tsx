export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            ZK Identity
          </h1>
          <p className="text-xl text-gray-600">
            Zero Knowledge Identity para Stellar Network
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <a
            href="/onboarding"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Comenzar KYC
          </a>
          <a
            href="/dashboard"
            className="block w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Ver Dashboard
          </a>
        </div>

        <div className="pt-8 text-sm text-gray-500">
          <p>Identidad privada y segura con pruebas Zero Knowledge</p>
        </div>
      </div>
    </main>
  )
}
