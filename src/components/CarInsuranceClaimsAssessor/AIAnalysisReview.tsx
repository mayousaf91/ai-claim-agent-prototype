import React, { useState } from 'react';
import { ClaimData, DamageDetail } from './types';
import { ShieldCheck, AlertTriangle, AlertCircle, DollarSign, Clock, Car, Save, Edit2, Eye, EyeOff } from 'lucide-react';
import DamageOverlay from './DamageOverlay';

interface AIAnalysisReviewProps {
  claimData: ClaimData;
  updateClaimData: (data: Partial<ClaimData>) => void;
}

const AIAnalysisReview: React.FC<AIAnalysisReviewProps> = ({ claimData, updateClaimData }) => {
  const { aiAnalysis, photos } = claimData;
  const [editingDamageId, setEditingDamageId] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<DamageDetail>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});

  if (!aiAnalysis) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Analysis Available</h3>
        <p className="mt-1 text-sm text-gray-500">Please upload photos in the previous step.</p>
      </div>
    );
  }

  const handleImageLoad = (photoId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    setImageDimensions(prev => ({
      ...prev,
      [photoId]: {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
    }));
  };

  const toggleOverlay = (photoId: string) => {
    updateClaimData({
      photos: photos.map(photo => 
        photo.id === photoId 
          ? { ...photo, showOverlay: !photo.showOverlay }
          : photo
      )
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor':
        return 'text-green-500 bg-green-50';
      case 'moderate':
        return 'text-yellow-500 bg-yellow-50';
      case 'severe':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'severe':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleEdit = (index: number, detail: DamageDetail) => {
    setEditingDamageId(index);
    setEditedValues(detail);
  };

  const handleSave = (index: number) => {
    if (!aiAnalysis.damageDetails) return;

    const updatedDetails = [...aiAnalysis.damageDetails];
    updatedDetails[index] = { ...updatedDetails[index], ...editedValues };

    const totalCost = updatedDetails.reduce((sum, detail) => sum + detail.estimatedCost, 0);

    updateClaimData({
      aiAnalysis: {
        ...aiAnalysis,
        damageDetails: updatedDetails,
        repairEstimate: totalCost
      }
    });

    setEditingDamageId(null);
    setEditedValues({});
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleInputChange = (field: keyof DamageDetail, value: string | number) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: field === 'estimatedCost' ? Number(value) : value
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-lg font-medium text-gray-900 mb-4">
        AI Damage Assessment
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {photos.map(photo => (
          <div key={photo.id} className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-w-1 aspect-h-1">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover"
                onLoad={(e) => handleImageLoad(photo.id, e)}
              />
              {photo.showOverlay && imageDimensions[photo.id] && (
                <DamageOverlay
                  damageDetails={aiAnalysis.damageDetails}
                  imageWidth={imageDimensions[photo.id].width}
                  imageHeight={imageDimensions[photo.id].height}
                />
              )}
            </div>
            <button
              onClick={() => toggleOverlay(photo.id)}
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              {photo.showOverlay ? (
                <EyeOff className="h-4 w-4 text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-600" />
              )}
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <p className="text-sm truncate">{photo.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-medium text-blue-900">Detailed Damage Analysis</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(aiAnalysis.damageSeverity)}`}>
            {getSeverityIcon(aiAnalysis.damageSeverity)}
            <span className="ml-1 capitalize">{aiAnalysis.damageSeverity} Overall Damage</span>
          </span>
        </div>

        <div className="space-y-4">
          {aiAnalysis.damageDetails.map((detail, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm relative">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Car className="h-5 w-5 text-gray-400 mr-2" />
                    {editingDamageId === index ? (
                      <input
                        type="text"
                        value={editedValues.location || detail.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="text-sm font-medium text-gray-900 border rounded px-2 py-1"
                      />
                    ) : (
                      <h4 className="text-sm font-medium text-gray-900">{detail.location}</h4>
                    )}
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(detail.severity)}`}>
                      {getSeverityIcon(detail.severity)}
                      <span className="ml-1 capitalize">{detail.severity}</span>
                    </span>
                  </div>

                  {editingDamageId === index ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-500">Damage Type</label>
                        <input
                          type="text"
                          value={editedValues.damageType || detail.damageType}
                          onChange={(e) => handleInputChange('damageType', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Severity</label>
                        <select
                          value={editedValues.severity || detail.severity}
                          onChange={(e) => handleInputChange('severity', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        >
                          <option value="minor">Minor</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Estimated Cost ($)</label>
                        <input
                          type="number"
                          value={editedValues.estimatedCost || detail.estimatedCost}
                          onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Notes</label>
                        <textarea
                          value={editedValues.notes || detail.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Type:</span> {detail.damageType}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Cost:</span> ${detail.estimatedCost.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Confidence:</span> {(detail.confidenceScore * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">AI Reasoning:</span> {detail.aiReasoning}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {detail.notes}
                      </p>
                    </>
                  )}
                </div>

                <div className="ml-4">
                  {editingDamageId === index ? (
                    <button
                      onClick={() => handleSave(index)}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(index, detail)}
                      className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Total Estimated Cost</h4>
              <p className="text-2xl font-bold text-gray-900">
                ${aiAnalysis.repairEstimate.toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Estimated Repair Time</h4>
              <p className="text-2xl font-bold text-gray-900">{aiAnalysis.estimatedRepairTime} days</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Overall AI Confidence</h4>
              <p className="text-2xl font-bold text-gray-900">{(aiAnalysis.overallConfidence * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          This assessment is based on AI analysis of the provided photos. All estimates can be adjusted and will be reviewed by our claims team.
        </p>
      </div>

      {isSaved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeIn">
          Changes saved successfully
        </div>
      )}
    </div>
  );
};

export default AIAnalysisReview;