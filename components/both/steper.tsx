import { cn } from "@/lib/utils"; // Função utilitária para classes condicionais
import { useState } from "react";
import { FaCar, FaHome, FaPhone } from "react-icons/fa";

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

const Stepper = ({ currentStep, setCurrentStep }: { currentStep: number, setCurrentStep: (param: number) => void}) => {

  const steps: Step[] = [
    { id: 0, label: "Contato", icon: <FaPhone /> },
    { id: 1, label: "Veículo", icon: <FaCar /> },
    { id: 2, label: "Concluído", icon: <FaHome /> },
  ];

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div className="flex items-center sticky top-0 justify-between mx-auto px-4 py-6 rounded-lg">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex items-center flex-1"
        >
          {/* Ícone do passo */}
          <div
            onClick={() => handleStepClick(step.id)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full cursor-pointer",
              step.id <= currentStep
                ? "bg-[#FF6347] text-white border-[#FF6347]": "bg-white text-[#FF6347] border-[var(--input)]"
            )}
          >
            {index + 1}
          </div>

          {/* Linha de progresso */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-1 mx-2",
                step.id < currentStep ? "bg-green-600" : "bg-green-500"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
