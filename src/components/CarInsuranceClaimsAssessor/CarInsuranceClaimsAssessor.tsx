import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import StepIndicator from './StepIndicator';
import ClaimInformationForm from './ClaimInformationForm';
import DamagePhotoUpload from './DamagePhotoUpload';
import AIAnalysisReview from './AIAnalysisReview';
import { ClaimData } from './types';

const initialClaimData: ClaimData = {
  policyNumber: '',
  fullName: '',
  email: '',
  phone: '',
  dateOfIncident: '',
  incidentDescription: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  damageSeverity: 'unknown',
  photos: [],
  aiAnalysis: null
};

const CarInsuranceClaimsAssessor: React.FC = () => {
  const [step, setStep] = useState(1);
  const [claimData, setClaimData] = useState<ClaimData>(initialClaimData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateClaimData = (data: Partial<ClaimData>) => {
    setClaimData(prev => ({ ...prev, ...data }));
  };

  const simulateAIAnalysis = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const aiResult = {
        damageDetected: true,
        damageSeverity: Math.random() > 0.5 ? 'severe' : 'moderate',
        repairEstimate: Math.floor(Math.random() * 3000) + 1000,
        damageDetails: [
          {
            location: 'Front Bumper',
            damageType: 'Impact Damage',
            severity: 'severe',
            estimatedCost: 800,
            confidenceScore: 0.92,
            aiReasoning: 'Deep impact patterns and material deformation consistent with frontal collision',
            notes: 'Deep impact damage with visible cracking'
          },
          {
            location: 'Hood',
            damageType: 'Dent',
            severity: 'moderate',
            estimatedCost: 500,
            confidenceScore: 0.87,
            aiReasoning: 'Multiple impact points with paint damage signature typical of hail or debris',
            notes: 'Multiple dents with paint damage'
          },
          {
            location: 'Left Headlight',
            damageType: 'Broken',
            severity: 'severe',
            estimatedCost: 400,
            confidenceScore: 0.95,
            aiReasoning: 'Complete fracture pattern detected with internal component exposure',
            notes: 'Complete replacement needed'
          },
          {
            location: 'Front Grille',
            damageType: 'Structural Damage',
            severity: 'moderate',
            estimatedCost: 300,
            confidenceScore: 0.89,
            aiReasoning: 'Mesh deformation and mounting point stress indicators visible',
            notes: 'Partial replacement recommended'
          }
        ],
        estimatedRepairTime: Math.floor(Math.random() * 10) + 5,
        recommendedAction: 'repair',
        overallConfidence: 0.91
      };
      
      updateClaimData({ 
        aiAnalysis: aiResult,
        damageSeverity: aiResult.damageSeverity as 'minor' | 'moderate' | 'severe'
      });
      
      setIsProcessing(false);
    }, 2000);
  };

  const handleSubmitClaim = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Claim submitted successfully! Our team will review your claim and contact you shortly.');
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ClaimInformationForm 
            claimData={claimData} 
            updateClaimData={updateClaimData} 
          />
        );
      case 2:
        return (
          <DamagePhotoUpload 
            claimData={claimData} 
            updateClaimData={updateClaimData}
            simulateAIAnalysis={simulateAIAnalysis}
            isProcessing={isProcessing}
          />
        );
      case 3:
        return (
          <AIAnalysisReview 
            claimData={claimData}
            updateClaimData={updateClaimData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Claims Assessment</h1>
          <p className="text-gray-600">Fast, accurate, and hassle-free claims processing</p>
        </div>
        
        <StepIndicator currentStep={step} totalSteps={3} />
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 transition-all duration-300 transform hover:shadow-xl">
          {renderStep()}
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
              step === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Previous
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 2 && isProcessing}
              className={`flex items-center px-4 py-2 rounded-md bg-blue-600 text-white transition-all duration-200 ${
                (step === 2 && isProcessing)
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-blue-700 shadow-md'
              }`}
            >
              Next
              <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitClaim}
              disabled={isSubmitting}
              className={`flex items-center px-6 py-2 rounded-md bg-green-600 text-white transition-all duration-200 ${
                isSubmitting
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-green-700 shadow-md'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarInsuranceClaimsAssessor;