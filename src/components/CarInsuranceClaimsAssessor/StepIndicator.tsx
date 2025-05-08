import React from 'react';
import { Check, FileText, Camera, Brain } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { 
    name: 'Claim Information', 
    description: 'Provide basic details',
    icon: FileText
  },
  { 
    name: 'Upload Photos', 
    description: 'Document the damage',
    icon: Camera
  },
  { 
    name: 'AI Analysis', 
    description: 'Review assessment',
    icon: Brain
  },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center relative group">
                <div 
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-blue-600 text-white' 
                      : isCurrent 
                        ? 'bg-blue-100 border-2 border-blue-600 text-blue-600' 
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium ${
                    isCurrent ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {step.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                </div>
              </div>
              
              {stepNumber < totalSteps && (
                <div className="flex-1 mx-4">
                  <div 
                    className={`h-0.5 transition-all duration-500 ${
                      stepNumber < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;