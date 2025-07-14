import React from 'react';
import { StepComponentProps } from '../../types/formTypes';

const BuildRequestStep: React.FC<StepComponentProps> = ({ formData, onUpdate, onNext, onBack }) => {
  const options = [
    { 
      value: 'yes', 
      label: 'Yes, build it for me',
      description: 'We\'ll handle the complete construction',
      icon: '👷'
    },
    { 
      value: 'no', 
      label: 'No, materials only',
      description: 'I\'ll build it myself or hire my own contractor',
      icon: '🛠️'
    }
  ] as const;

  const handleSelect = (request: 'yes' | 'no') => {
    onUpdate({ buildRequest: request });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Would you like us to build it for you?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value as 'yes' | 'no')}
            className={`p-6 border-2 rounded-lg text-center transition-all ${
              formData.buildRequest === option.value
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
            }`}
          >
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

export default BuildRequestStep;