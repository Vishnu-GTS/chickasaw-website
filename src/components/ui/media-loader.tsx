import React, { useState } from "react";
import LoadingSpinner from "./loading-spinner";

interface MediaLoaderProps {
  src: string;
  type: "audio" | "video";
  className?: string;
  onError?: (error: string) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  autoPlay?: boolean;
  controls?: boolean;
}

const MediaLoader: React.FC<MediaLoaderProps> = ({
  src,
  type,
  className = "",
  onError,
  onLoadStart,
  onCanPlay,
  autoPlay = false,
  controls = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    onLoadStart?.();
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    onCanPlay?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage("Failed to load media file");
    onError?.(errorMessage);
  };

  if (hasError) {
    return (
      <div className="text-red-600 text-center p-4">
        <p>Unable to load {type} file</p>
        <p className="text-sm text-gray-500 mt-2">URL: {src}</p>
        <p className="text-sm text-gray-500">
          This might be due to CORS restrictions or the file not being
          accessible.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
          <LoadingSpinner size="md" text={`Loading ${type}...`} />
        </div>
      )}
      {type === "audio" ? (
        <audio
          src={src}
          controls={controls}
          autoPlay={autoPlay}
          className={`w-full ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity ${className}`}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
        />
      ) : (
        <video
          src={src}
          controls={controls}
          autoPlay={autoPlay}
          className={`w-full max-h-96 ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity ${className}`}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default MediaLoader;
