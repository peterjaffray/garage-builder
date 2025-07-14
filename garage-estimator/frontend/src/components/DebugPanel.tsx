import React, { useState } from 'react';
import { GarageFormData } from '../types/formTypes';

interface DebugPanelProps {
  formData: GarageFormData;
  currentStep: number;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ formData, currentStep }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Toggle Debug Panel"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </button>

      {/* Drawer */}
      <div
        className={`fixed bottom-0 right-0 z-40 bg-white shadow-2xl border-l border-t border-gray-200 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '400px', maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Debug Panel</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 60px)' }}>
          {/* Current Step */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Current Step</h4>
            <div className="bg-blue-50 p-2 rounded">
              <span className="text-blue-700">Step {currentStep + 1}</span>
            </div>
          </div>

          {/* Form Data */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Form Data</h4>
            <div className="space-y-2">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-2 rounded">
                  <span className="font-medium text-gray-600">{key}:</span>{' '}
                  <span className="text-gray-800">
                    {value || <span className="text-gray-400 italic">not set</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw JSON */}
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Raw JSON</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};