import React from 'react';
import { DamageDetail } from './types';

interface DamageOverlayProps {
  damageDetails: DamageDetail[];
  imageWidth: number;
  imageHeight: number;
}

const DamageOverlay: React.FC<DamageOverlayProps> = ({
  damageDetails,
  imageWidth,
  imageHeight
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor':
        return 'rgba(34, 197, 94, 0.5)';
      case 'moderate':
        return 'rgba(234, 179, 8, 0.5)';
      case 'severe':
        return 'rgba(239, 68, 68, 0.5)';
      default:
        return 'rgba(107, 114, 128, 0.5)';
    }
  };

  const getSeverityStroke = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor':
        return '#16a34a';
      case 'moderate':
        return '#ca8a04';
      case 'severe':
        return '#dc2626';
      default:
        return '#4b5563';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        width={imageWidth}
        height={imageHeight}
        viewBox={`0 0 ${imageWidth} ${imageHeight}`}
        className="absolute top-0 left-0"
      >
        {damageDetails.map((detail, index) => {
          const x = (index % 2) * (imageWidth / 2) + 50;
          const y = Math.floor(index / 2) * (imageHeight / 3) + 50;
          const width = 100;
          const height = 60;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={getSeverityColor(detail.severity)}
                stroke={getSeverityStroke(detail.severity)}
                strokeWidth="2"
                rx="4"
              />
              <foreignObject
                x={x}
                y={y + height + 5}
                width={width}
                height="40"
              >
                <div className="bg-white px-2 py-1 rounded-md shadow-sm text-xs">
                  <p className="font-medium text-gray-900">{detail.location}</p>
                  <p className="text-gray-600">{detail.damageType}</p>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DamageOverlay;