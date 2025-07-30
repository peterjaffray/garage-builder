import React from "react";
import { GarageFormData, StepComponentProps } from "../../types/formTypes";

const RoofDesignStep: React.FC<StepComponentProps> = ({
  formData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const standardRoofs = [
    {
      value: "gable1",
      label: "Gable Style 1",
      description: "Traditional A-frame roof",
      image: `${import.meta.env.VITE_BASE_URL}GableStyle1.jpg`,
    },
    {
      value: "gable2",
      label: "Gable Style 2",
      description: "Traditional A-frame roof, peaked in alternate direction",
      image: `${import.meta.env.VITE_BASE_URL}GableStyle2.jpg`,
    },
  ];

  const premiumRoofs = [
    {
      value: "dutchGable1",
      label: "Dutch Gable",
      description: "Combination of gable and hip roof",
      image: `${import.meta.env.VITE_BASE_URL}DutchGable.jpg`,
    },
    {
      value: "dummyDutchGable1",
      label: "Dummy Dutch Gable",
      description: "Decorative Dutch gable style",
      image: `${import.meta.env.VITE_BASE_URL}DummyDutchGable.jpg`,
    },
    {
      value: "cottage",
      label: "Cottage Style",
      description: "Charming cottage-inspired roof",
      image: `${import.meta.env.VITE_BASE_URL}CottageStyle.jpg`,
    },
  ];

  const handleSelect = (design: string) => {
    onUpdate({ roofDesign: design as GarageFormData["roofDesign"] });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Roof Design</h2>

      {formData.atticStorage === "no" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Standard Designs
            </h3>
            <div className="space-y-2">
              {standardRoofs.map((roof) => (
                <button
                  key={roof.value}
                  onClick={() => handleSelect(roof.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                    formData.roofDesign === roof.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={roof.image}
                      alt={`${roof.label} roof design`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{roof.label}</div>
                    <div className="text-sm text-gray-600">
                      {roof.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Premium Designs
            </h3>
            <div className="space-y-2">
              {premiumRoofs.map((roof) => (
                <button
                  key={roof.value}
                  onClick={() => handleSelect(roof.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                    formData.roofDesign === roof.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={roof.image}
                      alt={`${roof.label} roof design`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{roof.label} ⭐</div>
                    <div className="text-sm text-gray-600">
                      {roof.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {formData.atticStorage === "yes" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Standard Designs
            </h3>
            <div className="space-y-2">
              {standardRoofs.map((roof) => (
                <button
                  key={roof.value}
                  onClick={() => handleSelect(roof.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                    formData.roofDesign === roof.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={roof.image}
                      alt={`${roof.label} roof design`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{roof.label}</div>
                    <div className="text-sm text-gray-600">
                      {roof.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Premium Designs
            </h3>
            <div className="space-y-2">
              {premiumRoofs.map((roof) => (
                <button
                  key={roof.value}
                  onClick={() => handleSelect(roof.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                    formData.roofDesign === roof.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={roof.image}
                      alt={`${roof.label} roof design`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{roof.label} ⭐</div>
                    <div className="text-sm text-gray-600">
                      {roof.description}
                    </div>
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
