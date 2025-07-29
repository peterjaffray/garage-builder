import React from 'react';
import { StepComponentProps, GarageFormData } from '../../types/formTypes';

const RoofDesignStep: React.FC<StepComponentProps> = ({ formData, onUpdate, onNext, onBack }) => {
  const standardRoofs = [
    { value: 'gable1', label: 'Gable Style 1', description: 'Traditional A-frame roof' },
    { value: 'gable2', label: 'Gable Style 2', description: 'Traditional A-frame roof, peaked in alternate direction' }
  ];

  const premiumRoofs = [
    { value: 'dutchGable1', label: 'Dutch Gable', description: 'Combination of gable and hip roof' },
    { value: 'dummyDutchGable1', label: 'Dummy Dutch Gable', description: 'Decorative Dutch gable style' },
    { value: 'cottage', label: 'Cottage Style', description: 'Charming cottage-inspired roof' }
  ];


  const handleSelect = (design: string) => {
    onUpdate({ roofDesign: design as GarageFormData['roofDesign'] });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Roof Design
      </h2>
      
      {formData.atticStorage === 'no' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Standard Designs</h3>
            <div className="space-y-2">
              {standardRoofs.map((roof) => (
                <button
                  key={roof.value}
                  onClick={() => handleSelect(roof.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                    formData.roofDesign === roof.value
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
                    <div className="font-semibold">{roof.label}</div>
                    <div className="text-sm text-gray-600">{roof.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Premium Designs</h3>
            <div className="space-y-2">
              {premiumRoofs.map((roof) => (
                <button
                  key={roof.value}
                  onClick={() => handleSelect(roof.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                    formData.roofDesign === roof.value
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
                    <div className="font-semibold">{roof.label} ⭐</div>
                    <div className="text-sm text-gray-600">{roof.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {formData.atticStorage === 'yes' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Standard Designs</h3>
            <div className="space-y-2">
              {standardRoofs.map((roof) => (
                <button
                  key={roof.value}
                  onClick={() => handleSelect(roof.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                    formData.roofDesign === roof.value
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
                    <div className="font-semibold">{roof.label}</div>
                    <div className="text-sm text-gray-600">{roof.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Premium Designs</h3>
            <div className="space-y-2">
              {premiumRoofs.map((roof) => (
                <button
                  key={roof.value}
                  onClick={() => handleSelect(roof.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                    formData.roofDesign === roof.value
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
                    <div className="font-semibold">{roof.label} ⭐</div>
                    <div className="text-sm text-gray-600">{roof.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
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

export default RoofDesignStep;