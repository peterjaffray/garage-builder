import React from 'react';
import { StepComponentProps } from '../../types/formTypes';

const WallHeightStep: React.FC<StepComponentProps> = ({ formData, onUpdate, onNext, onBack }) => {
  const heights = [
    { value: '8', label: "8 feet", description: "Standard height" },
    { value: '9', label: "9 feet", description: "Extra headroom" },
    { value: '10', label: "10 feet", description: "Even more headroom" }
  ] as const;

  const handleSelect = (height: '8' | '9' | '10') => {
    onUpdate({ wallHeight: height });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Select Wall Height
      </h2>
      
      <div className="space-y-3">
        {heights.map((height) => (
          <button
            key={height.value}
            onClick={() => handleSelect(height.value as '8' | '9' | '10')}
            className={`w-full p-4 border-2 rounded-lg text-left transition-colors flex items-center gap-4 ${
              formData.wallHeight === height.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {/* Placeholder image */}
            <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">{height.label}</div>
              <div className="text-sm text-gray-600">{height.description}</div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default WallHeightStep;