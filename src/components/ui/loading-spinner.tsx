import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "#D3191C",
  text,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center">
        <Loader2
          className={`${sizeClasses[size]} animate-spin`}
          style={{ color }}
        />
        {text && (
          <span className="mt-2 text-gray-600 text-sm font-medium">{text}</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
