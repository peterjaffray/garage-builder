import React from 'react';
import { StepComponentProps } from '../../types/formTypes';

const GarageSizeStep: React.FC<StepComponentProps> = ({ formData, onUpdate, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.width && formData.length) {
      onNext();
    }
  };

  const commonSizes = [
    { width: 12, length: 20, label: "12' X 20'" },
    { width: 20, length: 20, label: "20' X 20'" },
    { width: 18, length: 24, label: "18' X 24'" },
    { width: 20, length: 30, label: "20' X 30'" },
    { width: 24, length: 24, label: "24' X 24'" },
    { width: 24, length: 32, label: "24' X 32'" },
  ];

  const handleSizeSelect = (width: number, length: number) => {
    onUpdate({ width, length });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          How large would you like your garage to be?
        </h2>
        
        {/* Common Size Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Choose a common size or enter custom dimensions below
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {commonSizes.map((size) => (
              <button
                key={`${size.width}x${size.length}`}
                type="button"
                onClick={() => handleSizeSelect(size.width, size.length)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 ${
                  formData.width === size.width && formData.length === size.length
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-8 border-2 border-current mb-2 rounded"></div>
                  <span className="font-medium">{size.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Custom Dimensions */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Or enter custom dimensions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (feet)
              </label>
              <input
                type="number"
                min="10"
                max="50"
                value={formData.width || ''}
                onChange={(e) => onUpdate({ width: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length (feet)
              </label>
              <input
                type="number"
                min="10"
                max="50"
                value={formData.length || ''}
                onChange={(e) => onUpdate({ length: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default GarageSizeStep;