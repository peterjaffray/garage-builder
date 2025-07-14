export interface GarageFormData {
  // Step 1: Garage Size
  width?: number;
  length?: number;
  
  // Step 2: Wall Height
  wallHeight?: '8' | '9' | '10';
  
  // Step 3: Interior Finish
  interiorFinish?: 'finished' | 'unfinished';
  
  // Step 4: Wall/Ceiling Material (conditional on finished)
  wallCeilingMaterial?: 'drywall' | 'trusscore';
  
  // Step 5: Attic Storage
  atticStorage?: 'yes' | 'no';
  
  // Step 6: Loft or Attic Type (conditional on attic storage)
  loftType?: 'loft' | 'attic';
  
  // Step 7: Roof Design
  roofDesign?: 'gable1' | 'gable2' | 'dutchGable1' | 'dummyDutchGable1' | 'cottage';
  
  // Step 8: Build Request
  buildRequest?: 'yes' | 'no';
  
  // Customer Info (final step)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  message?: string;
}

export interface FormStep {
  id: string;
  label: string;
  component: React.ComponentType<StepComponentProps>;
  dependsOn?: (data: GarageFormData) => boolean;
}

export interface StepComponentProps {
  formData: GarageFormData;
  onUpdate: (data: Partial<GarageFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}