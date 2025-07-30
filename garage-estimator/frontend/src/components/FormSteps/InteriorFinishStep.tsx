import React from "react";
import { StepComponentProps } from "../../types/formTypes";

const InteriorFinishStep: React.FC<StepComponentProps> = ({
  formData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const finishOptions = [
    {
      value: "finished",
      label: "Finished Interior",
      description: "Includes drywall or Trusscore walls and ceiling",
      image: `${import.meta.env.VITE_BASE_URL}FinishedInterior.jpg`,
    },
    {
      value: "unfinished",
      label: "Unfinished Interior",
      description: "Exposed framing and insulation",
      image: `${import.meta.env.VITE_BASE_URL}UnfinishedInterior.jpg`,
    },
  ] as const;

  const handleSelect = (finish: "finished" | "unfinished") => {
    onUpdate({ interiorFinish: finish });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Interior Finish</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {finishOptions.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              handleSelect(option.value as "finished" | "unfinished")
            }
            className={`h-full p-6 border-2 rounded-lg text-center transition-all flex flex-col ${
              formData.interiorFinish === option.value
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-300 hover:border-gray-400 hover:shadow-md"
            }`}
          >
            <div className="w-48 h-48 rounded-lg overflow-hidden mx-auto mb-4 flex-shrink-0">
              <img
                src={option.image}
                alt={`${option.label} interior finish`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-bold text-lg mb-2">{option.label}</div>
            <div className="text-sm text-gray-600 flex-grow flex items-end justify-center">
              {option.description}
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

export default InteriorFinishStep;
