export interface DamageDetail {
  location: string;
  damageType: string;
  severity: 'minor' | 'moderate' | 'severe';
  estimatedCost: number;
  notes: string;
  confidenceScore: number;
  aiReasoning: string;
}

export interface ClaimData {
  policyNumber: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfIncident: string;
  incidentDescription: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  damageSeverity: 'unknown' | 'minor' | 'moderate' | 'severe';
  photos: Array<{
    id: string;
    url: string;
    name: string;
    showOverlay?: boolean;
  }>;
  aiAnalysis: {
    damageDetected: boolean;
    damageSeverity: string;
    repairEstimate: number;
    damageDetails: DamageDetail[];
    estimatedRepairTime: number;
    recommendedAction: string;
    overallConfidence: number;
  } | null;
}

export type UpdateClaimDataFn = (data: Partial<ClaimData>) => void;