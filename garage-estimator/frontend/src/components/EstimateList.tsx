import { Estimate } from '../types'

interface EstimateListProps {
  estimates: Estimate[]
}

const EstimateList = ({ estimates }: EstimateListProps) => {
  if (estimates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Estimates</h2>
        <p className="text-gray-500 text-center py-8">
          No estimates created yet. Create your first estimate using the form.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Estimates</h2>
      <div className="space-y-4">
        {estimates.map((estimate) => (
          <div key={estimate.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">
                Estimate #{estimate.id}
              </h3>
              <span className="text-2xl font-bold text-green-600">
                ${estimate.total_cost.toLocaleString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>
                <span className="font-medium">Dimensions:</span>
                <br />
                {estimate.width}' × {estimate.length}' × {estimate.height}'
              </div>
              <div>
                <span className="font-medium">Material:</span>
                <br />
                {estimate.material.charAt(0).toUpperCase() + estimate.material.slice(1)}
              </div>
            </div>
            
            {estimate.features.length > 0 && (
              <div className="mb-3">
                <span className="font-medium text-sm text-gray-600">Features:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {estimate.features.map((feature) => (
                    <span
                      key={feature}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {feature.charAt(0).toUpperCase() + feature.slice(1).replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Created: {new Date(estimate.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EstimateList 