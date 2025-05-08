import React from 'react';
import { ClaimData, UpdateClaimDataFn } from './types';
import FormField from './FormField';

interface ClaimInformationFormProps {
  claimData: ClaimData;
  updateClaimData: UpdateClaimDataFn;
}

const ClaimInformationForm: React.FC<ClaimInformationFormProps> = ({ 
  claimData, 
  updateClaimData 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateClaimData({ [name]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-lg font-medium text-gray-900 mb-4">
        Enter Your Claim Details
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <FormField
          label="Claim Number"
          name="policyNumber"
          type="text"
          value={claimData.policyNumber}
          onChange={handleChange}
          placeholder="Enter your claim number"
          required
        />
        
        <p className="mt-2 text-sm text-gray-500">
          Your claim number can be found in your insurance documents or recent correspondence.
        </p>
      </div>
    </div>
  );
};

export default ClaimInformationForm;