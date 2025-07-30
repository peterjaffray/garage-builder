import React from 'react';
import { StepComponentProps } from '../../types/formTypes';

const CustomerInfoStep: React.FC<StepComponentProps> = ({ formData, onUpdate, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerName && formData.customerEmail) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Contact Information
      </h2>
      
      {/* Garage Inclusions Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">All garages come complete with:</h3>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>• 1 9 x 7 or 16 x 7 Garage Door</li>
            <li>• 2 48" x 36" Picture Windows (Sliders are available)</li>
            <li>• 1 Entry Door</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">All Built garages can include:</h3>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>• Concrete Pad with Sump Pit</li>
            <li>• Basic Electrical from the House including:</li>
            <li className="ml-6">- 3 Outside Light connections</li>
            <li className="ml-6">- 1 Outside GFCI Plug</li>
            <li className="ml-6">- 2 Interior Lights</li>
            <li className="ml-6">- 3 Interior Plugs</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-700 font-medium">
          Just let us know in the comments your preferences.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.customerName || ''}
            onChange={(e) => onUpdate({ customerName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus-ring"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.customerEmail || ''}
            onChange={(e) => onUpdate({ customerEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus-ring"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone (optional)
          </label>
          <input
            type="tel"
            value={formData.customerPhone || ''}
            onChange={(e) => onUpdate({ customerPhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus-ring"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (optional)
          </label>
          <textarea
            value={formData.message || ''}
            onChange={(e) => onUpdate({ message: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus-ring"
            placeholder="Any special requirements, questions, or preferences for doors, windows, electrical options?"
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-md focus:outline-none focus:ring-2 primary-button focus-ring"
        >
          Get Quote
        </button>
      </div>
    </form>
  );
};

export default CustomerInfoStep;