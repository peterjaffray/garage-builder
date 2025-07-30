import React from "react";
import { StepComponentProps } from "../../types/formTypes";

const LoftTypeStep: React.FC<StepComponentProps> = ({
  formData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const loftTypes = [
    {
      value: "loft",
      label: "Loft",
      description: "Open mezzanine level with railing",
      features: "Accessible by stairs or ladder, open to below",
      image: `${import.meta.env.VITE_BASE_URL}Loft.jpg`,
    },
    {
      value: "attic",
      label: "Attic",
      description: "Enclosed storage space with pull-down stairs",
      features: "Maximum storage, accessed via ladder",
      image: `${import.meta.env.VITE_BASE_URL}Attic.jpg`,
    },
  ] as const;

  const handleSelect = (type: "loft" | "attic") => {
    onUpdate({ loftType: type });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Loft or Attic Type</h2>

      <div className="space-y-4">
        {loftTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => handleSelect(type.value as "loft" | "attic")}
            className={`w-full p-5 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
              formData.loftType === type.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={type.image}
                alt={`${type.label} loft or attic type`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-bold text-lg">{type.label}</div>
              <div className="text-gray-600 mt-1">{type.description}</div>
              <div className="text-sm text-blue-600 mt-2">
                • {type.features}
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

export default LoftTypeStep;
