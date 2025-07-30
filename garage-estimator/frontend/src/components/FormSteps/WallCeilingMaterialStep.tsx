import React from "react";
import { StepComponentProps } from "../../types/formTypes";

const WallCeilingMaterialStep: React.FC<StepComponentProps> = ({
  formData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const materials = [
    {
      value: "drywall",
      label: "Drywall",
      description: "Traditional drywall finish, painted",
      pros: "Cost-effective, smooth finish",
      image: `${import.meta.env.VITE_BASE_URL}Drywall.JPG`,
    },
    {
      value: "trusscore",
      label: "Trusscore",
      description: "PVC wall and ceiling panels",
      pros: "Water-resistant, durable, easy to clean",
      image: `${import.meta.env.VITE_BASE_URL}Trusscore.jpg`,
    },
  ] as const;

  const handleSelect = (material: "drywall" | "trusscore") => {
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
            onClick={() =>
              handleSelect(material.value as "drywall" | "trusscore")
            }
            className={`w-full p-5 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
              formData.wallCeilingMaterial === material.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={material.image}
                alt={`${material.label} wall and ceiling material`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between items-start flex-1">
              <div>
                <div className="font-bold text-lg">{material.label}</div>
                <div className="text-gray-600 mt-1">{material.description}</div>
                <div className="text-sm text-green-600 mt-2">
                  ✓ {material.pros}
                </div>
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
