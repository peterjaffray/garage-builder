import React from 'react';
import { StepComponentProps } from '../../types/formTypes';

const LoftTypeStep: React.FC<StepComponentProps> = ({ formData, onUpdate, onNext, onBack }) => {
  const loftTypes = [
    { 
      value: 'loft', 
      label: 'Loft',
      description: 'Open mezzanine level with railing',
      features: 'Accessible by stairs or ladder, open to below'
    },
    { 
      value: 'attic', 
      label: 'Attic',
      description: 'Enclosed storage space with pull-down stairs',
      features: 'Maximum storage, accessed via ladder'
    }
  ] as const;

  const handleSelect = (type: 'loft' | 'attic') => {
    onUpdate({ loftType: type });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Loft or Attic Type
      </h2>
      
      <div className="space-y-4">
        {loftTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => handleSelect(type.value as 'loft' | 'attic')}
            className={`w-full p-5 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
              formData.loftType === type.value
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
              <div className="font-bold text-lg">{type.label}</div>
              <div className="text-gray-600 mt-1">{type.description}</div>
              <div className="text-sm text-blue-600 mt-2">• {type.features}</div>
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

export default LoftTypeStep;