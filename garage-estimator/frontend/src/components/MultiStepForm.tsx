import React, { useState } from 'react';
import { GarageFormData, FormStep } from '../types/formTypes';
import GarageSizeStep from './FormSteps/GarageSizeStep';
import WallHeightStep from './FormSteps/WallHeightStep';
import InteriorFinishStep from './FormSteps/InteriorFinishStep';
import WallCeilingMaterialStep from './FormSteps/WallCeilingMaterialStep';
import AtticStorageStep from './FormSteps/AtticStorageStep';
import LoftTypeStep from './FormSteps/LoftTypeStep';
import RoofDesignStep from './FormSteps/RoofDesignStep';
import BuildRequestStep from './FormSteps/BuildRequestStep';
import CustomerInfoStep from './FormSteps/CustomerInfoStep';
import { DebugPanel } from './DebugPanel';

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<GarageFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const steps: FormStep[] = [
    { id: 'size', label: 'Garage Size', component: GarageSizeStep },
    { id: 'wallHeight', label: 'Wall Height', component: WallHeightStep },
    { id: 'finish', label: 'Interior Finish', component: InteriorFinishStep },
    { 
      id: 'material', 
      label: 'Wall Material', 
      component: WallCeilingMaterialStep,
      dependsOn: (data) => data.interiorFinish === 'finished'
    },
    { id: 'atticStorage', label: 'Attic Storage', component: AtticStorageStep },
    { 
      id: 'loftType', 
      label: 'Loft Type', 
      component: LoftTypeStep,
      dependsOn: (data) => data.atticStorage === 'yes'
    },
    { id: 'roofDesign', label: 'Roof Design', component: RoofDesignStep },
    { id: 'buildRequest', label: 'Build Request', component: BuildRequestStep },
    { id: 'customerInfo', label: 'Contact Info', component: CustomerInfoStep }
  ];

  const getActiveSteps = () => {
    return steps.filter(step => !step.dependsOn || step.dependsOn(formData));
  };

  const activeSteps = getActiveSteps();
  const currentActiveStep = activeSteps[currentStep];

  const handleUpdate = (data: Partial<GarageFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    if (currentStep === activeSteps.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, activeSteps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const requestData = {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        width: formData.width,
        length: formData.length,
        height: parseInt(formData.wallHeight || '8'),
        features: mapFeatures(formData),
        message: formData.message,
        garageConfig: formData
      };

      const response = await fetch(`${import.meta.env.BASE_URL}api/estimates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit estimate');
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit estimate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapFeatures = (data: GarageFormData): string[] => {
    const features: string[] = [];
    
    // Map actual form selections to readable features
    if (data.interiorFinish === 'finished') {
      features.push('Finished Interior');
    }
    
    if (data.wallCeilingMaterial === 'trusscore') {
      features.push('Trusscore Walls & Ceiling');
    } else if (data.wallCeilingMaterial === 'drywall') {
      features.push('Drywall Walls & Ceiling');
    }
    
    if (data.atticStorage === 'yes') {
      features.push('Attic Storage');
    }
    
    if (data.loftType) {
      features.push(`${data.loftType === 'loft' ? 'Loft' : 'Attic'} Space`);
    }
    
    if (data.roofDesign) {
      const roofLabels: Record<string, string> = {
        'gable1': 'Gable Style 1 Roof',
        'gable2': 'Gable Style 2 Roof', 
        'dutchGable1': 'Dutch Gable Roof',
        'dummyDutchGable1': 'Dummy Dutch Gable Roof',
        'cottage': 'Cottage Style Roof'
      };
      features.push(roofLabels[data.roofDesign] || 'Custom Roof Design');
    }
    
    if (data.buildRequest === 'yes') {
      features.push('Build Request');
    }
    
    return features;
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Quote Request Submitted!</h2>
          <p className="text-green-700">
            Thank you for your interest. We'll review your garage specifications and send you a detailed quote within 24 hours.
          </p>
          <button
            onClick={() => {
              setFormData({});
              setCurrentStep(0);
              setSubmitSuccess(false);
            }}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Start New Quote
          </button>
        </div>
      </div>
    );
  }

  if (!currentActiveStep) return null;

  const StepComponent = currentActiveStep.component;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {activeSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex-1 text-center text-sm ${
                index <= currentStep ? 'text-blue-600 font-semibold' : 'text-gray-400'
              }`}
            >
              {/* Show numbers on small screens, labels on larger screens */}
              <span className="block sm:hidden">{index + 1}</span>
              <span className="hidden sm:block">{step.label}</span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <StepComponent
          formData={formData}
          onUpdate={handleUpdate}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {submitError}
        </div>
      )}

      {/* Loading State */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Submitting your quote request...</p>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      <DebugPanel formData={formData} currentStep={currentStep} />
    </div>
  );
};

export default MultiStepForm;