import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { ClaimData, UpdateClaimDataFn } from './types';
import DamageOverlay from './DamageOverlay';

interface DamagePhotoUploadProps {
  claimData: ClaimData;
  updateClaimData: UpdateClaimDataFn;
  simulateAIAnalysis: () => void;
  isProcessing: boolean;
}

const DamagePhotoUpload: React.FC<DamagePhotoUploadProps> = ({
  claimData,
  updateClaimData,
  simulateAIAnalysis,
  isProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

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

  const processFiles = (files: FileList) => {
    setUploadError(null);
    
    if (files.length === 0) return;
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const newPhotos = Array.from(files).filter(file => {
      if (!validImageTypes.includes(file.type)) {
        setUploadError('Only JPEG, PNG, and HEIC images are allowed');
        return false;
      }
      
      if (file.size > maxSize) {
        setUploadError('Image size must be less than 10MB');
        return false;
      }
      
      return true;
    }).map(file => ({
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      name: file.name,
      showOverlay: true
    }));
    
    if (newPhotos.length > 0) {
      updateClaimData({
        photos: [...claimData.photos, ...newPhotos]
      });
      
      if (claimData.photos.length === 0 && newPhotos.length > 0) {
        simulateAIAnalysis();
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removePhoto = (photoId: string) => {
    updateClaimData({
      photos: claimData.photos.filter(photo => photo.id !== photoId)
    });
  };

  const toggleOverlay = (photoId: string) => {
    updateClaimData({
      photos: claimData.photos.map(photo => 
        photo.id === photoId 
          ? { ...photo, showOverlay: !photo.showOverlay }
          : photo
      )
    });
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-lg font-medium text-gray-900 mb-4">
        Upload Damage Photos
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center transition-all duration-300 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/heic,image/heif"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Upload className="h-12 w-12 text-gray-400" />
        
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-gray-900">
            Drag and drop your photos here
          </p>
          <p className="text-xs text-gray-500 mt-1">
            or <button type="button" className="text-blue-600 hover:text-blue-700 font-medium" onClick={handleBrowseClick}>browse files</button>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG, or HEIC. Max 10MB per file.
          </p>
        </div>
      </div>
      
      {uploadError && (
        <div className="text-sm text-red-600 mt-2">
          {uploadError}
        </div>
      )}
      
      {claimData.photos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Uploaded Photos ({claimData.photos.length})
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {claimData.photos.map(photo => (
              <div key={photo.id} className="relative group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 relative">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full object-cover object-center"
                    onLoad={(e) => handleImageLoad(photo.id, e)}
                  />
                  {claimData.aiAnalysis && photo.showOverlay && imageDimensions[photo.id] && (
                    <DamageOverlay
                      damageDetails={claimData.aiAnalysis.damageDetails}
                      imageWidth={imageDimensions[photo.id].width}
                      imageHeight={imageDimensions[photo.id].height}
                    />
                  )}
                  <button
                    onClick={() => toggleOverlay(photo.id)}
                    className="absolute top-2 left-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {photo.showOverlay ? (
                      <EyeOff className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 rounded-full bg-white p-1 text-gray-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {photo.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md flex items-center">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin mr-2" />
          <span className="text-sm text-blue-700">
            Analyzing photos with AI... This may take a moment
          </span>
        </div>
      )}
      
      {claimData.photos.length === 0 && (
        <div className="text-sm text-gray-600 mt-4">
          Please upload at least one photo of the damage to proceed.
        </div>
      )}
    </div>
  );
};

export default DamagePhotoUpload;