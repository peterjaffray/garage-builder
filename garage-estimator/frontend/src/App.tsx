import { useState, useEffect } from 'react'
import MultiStepForm from './components/MultiStepForm'

function App() {
  const [apiMessage, setApiMessage] = useState<string>('')

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/hello`)
      .then(res => res.json())
      .then(data => setApiMessage(data.message))
      .catch(err => console.error('Failed to fetch from API:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Garage Builder Estimator
          </h1>
          <p className="text-gray-600">
            Design your custom garage and get an instant quote
          </p>
          {apiMessage && (
            <p className="text-sm text-green-600 mt-2">
              API Status: {apiMessage}
            </p>
          )}
        </header>

        <MultiStepForm />
      </div>
    </div>
  )
}

export default App 