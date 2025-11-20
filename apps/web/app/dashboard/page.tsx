export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mis Pruebas ZK</h2>
            <p className="text-gray-600">
              Aquí se mostrarán las pruebas Zero Knowledge generadas
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Identidad Stellar</h2>
            <p className="text-gray-600">
              Información de tu cuenta Stellar vinculada
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
