import React from "react";
import { StepComponentProps } from "../../types/formTypes";

const WallHeightStep: React.FC<StepComponentProps> = ({
  formData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const heights = [
    {
      value: "8",
      label: "8 feet",
      description: "Standard height",
      image: "/8feeet.jpg",
    },
    {
      value: "9",
      label: "9 feet",
      description: "Extra headroom",
      image: "/9feet.jpg",
    },
    {
      value: "10",
      label: "10 feet",
      description: "Even more headroom",
      image: "/10feet.jpg",
    },
  ] as const;

  const handleSelect = (height: "8" | "9" | "10") => {
    onUpdate({ wallHeight: height });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Wall Height</h2>

      <div className="space-y-3">
        {heights.map((height) => (
          <button
            key={height.value}
            onClick={() => handleSelect(height.value as "8" | "9" | "10")}
            className={`w-full p-4 border-2 rounded-lg text-left transition-colors flex items-center gap-4 ${
              formData.wallHeight === height.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={height.image}
                alt={`${height.label} garage height`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold">{height.label}</div>
              <div className="text-sm text-gray-600">{height.description}</div>
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

export default WallHeightStep;
