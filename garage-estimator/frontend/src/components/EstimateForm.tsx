import React, { useState } from 'react'
import { Estimate } from '../types'

interface EstimateFormProps {
  onEstimateCreated: (data: Estimate) => void
}

const EstimateForm = ({ onEstimateCreated }: EstimateFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    width: 0,
    length: 0,
    height: 8,
    material: 'basic',
    features: [] as string[],
    message: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'width' || name === 'length' || name === 'height' ? parseFloat(value) || 0 : value
    }))
  }

  const handleFeatureChange = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      const data = await response.json()
      onEstimateCreated(data)
      alert('Estimate submitted successfully!')
    } catch (error) {
      console.error(error)
      alert('Submission failed. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="number"
        name="width"
        placeholder="Width (ft)"
        value={formData.width}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="number"
        name="length"
        placeholder="Length (ft)"
        value={formData.length}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="number"
        name="height"
        placeholder="Height (ft)"
        value={formData.height}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <select
        name="material"
        value={formData.material}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="basic">Basic</option>
        <option value="standard">Standard</option>
        <option value="premium">Premium</option>
      </select>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Features:</label>
        <div className="space-y-1">
          {['windows', 'insulation', 'electrical', 'plumbing', 'overhead_door'].map(feature => (
            <label key={feature} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
                className="mr-2"
              />
              {feature.charAt(0).toUpperCase() + feature.slice(1).replace('_', ' ')}
            </label>
          ))}
        </div>
      </div>
      <textarea
        name="message"
        placeholder="Message (optional)"
        value={formData.message}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Submitting...' : 'Submit Estimate'}
      </button>
    </form>
  )
}

export default EstimateForm
