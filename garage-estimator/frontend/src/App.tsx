import { useState } from 'react'
import EstimateForm from './components/EstimateForm'
import EstimateList from './components/EstimateList'
import { Estimate } from './types'

function App() {
  const [estimates, setEstimates] = useState<Estimate[]>([])

  const addEstimate = (estimate: Estimate) => {
    setEstimates(prev => [...prev, estimate])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Garage Estimator App
          </h1>
          <p className="text-gray-600">
            Calculate the cost of building your dream garage
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <EstimateForm onEstimateCreated={addEstimate} />
          </div>
          <div>
            <EstimateList estimates={estimates} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 