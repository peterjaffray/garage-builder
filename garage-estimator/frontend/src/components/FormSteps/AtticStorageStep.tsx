import React from 'react';
import { StepComponentProps } from '../../types/formTypes';

const AtticStorageStep: React.FC<StepComponentProps> = ({ formData, onUpdate, onNext, onBack }) => {
  const options = [
    { 
      value: 'yes', 
      label: 'Add Attic Storage',
      description: 'Extra storage space above the garage',
      icon: '📦'
    },
    { 
      value: 'no', 
      label: 'No Attic Storage',
      description: 'Standard ceiling height throughout',
      icon: '❌'
    }
  ] as const;

  const handleSelect = (storage: 'yes' | 'no') => {
    onUpdate({ atticStorage: storage });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Attic Storage
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value as 'yes' | 'no')}
            className={`p-6 border-2 rounded-lg text-center transition-all ${
              formData.atticStorage === option.value
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
            }`}
          >
            {/* Placeholder image */}
            <div className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-4xl mb-3">{option.icon}</div>
            <div className="font-bold text-lg">{option.label}</div>
            <div className="text-sm text-gray-600 mt-2">{option.description}</div>
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

export default AtticStorageStep;