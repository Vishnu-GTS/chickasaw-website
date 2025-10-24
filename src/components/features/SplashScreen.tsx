import React from "react";
import { Loader2 } from "lucide-react";
import logoImage from "@/assets/logo.png";

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-white via-red-50 to-white">
      <div className="flex flex-col items-center space-y-8 animate-fade-in">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={logoImage}
              alt="Chickasaw Language Learning"
              className="w-32 h-32 object-contain drop-shadow-lg animate-pulse-slow"
            />
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-100 opacity-20 animate-ping"></div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide">
              Chickasaw
            </h1>
          </div>
        </div>

        {/* Loading Spinner with enhanced styling */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-3">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "#D3191C" }}
            />
            <span className="text-gray-700 text-base font-medium">
              Loading...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
