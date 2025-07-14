import React from 'react';
import { StepComponentProps } from '../../types/formTypes';

const WallCeilingMaterialStep: React.FC<StepComponentProps> = ({ formData, onUpdate, onNext, onBack }) => {
  const materials = [
    { 
      value: 'drywall', 
      label: 'Drywall',
      description: 'Traditional drywall finish, painted',
      pros: 'Cost-effective, smooth finish'
    },
    { 
      value: 'trusscore', 
      label: 'Trusscore',
      description: 'PVC wall and ceiling panels',
      pros: 'Water-resistant, durable, easy to clean'
    }
  ] as const;

  const handleSelect = (material: 'drywall' | 'trusscore') => {
    onUpdate({ wallCeilingMaterial: material });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Wall & Ceiling Material
      </h2>
      
      <div className="space-y-4">
        {materials.map((material) => (
          <button
            key={material.value}
            onClick={() => handleSelect(material.value as 'drywall' | 'trusscore')}
            className={`w-full p-5 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
              formData.wallCeilingMaterial === material.value
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
            <div className="flex justify-between items-start flex-1">
              <div>
                <div className="font-bold text-lg">{material.label}</div>
                <div className="text-gray-600 mt-1">{material.description}</div>
                <div className="text-sm text-green-600 mt-2">✓ {material.pros}</div>
              </div>
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

export default WallCeilingMaterialStep;