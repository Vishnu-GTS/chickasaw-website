import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-4 h-auto text-left"
                onClick={() => handleNavigation("/about")}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">About Chickasaw Nation</span>
                  <span className="text-sm text-gray-500 mt-1">
                    Learn about our culture and heritage
                  </span>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-4 h-auto text-left"
                onClick={() => handleNavigation("/credits")}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Credits</span>
                  <span className="text-sm text-gray-500 mt-1">
                    Acknowledgments and contributors
                  </span>
                </div>
              </Button>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleNavigation("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
