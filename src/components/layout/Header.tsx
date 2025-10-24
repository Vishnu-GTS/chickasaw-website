import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full">
      <div className="mx-auto">
        <div className="bg-white  shadow-sm border border-gray-300">
          <div className="flex justify-between items-center h-16 px-4 sm:px-6">
            {/* Left - Logo and Title */}
            <div
              className="flex items-center cursor-pointer space-x-2 sm:space-x-3"
              onClick={() => navigate("/")}
            >
              <img
                src={logoImage}
                alt="Chickasaw Nation Logo"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                Chickasaw Basic
              </h1>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Button
                variant="none"
                className="text-gray-600 text-sm hover:text-gray-800 p-0 h-auto"
                onClick={() => navigate("/about")}
              >
                About Chickasaw Nation
              </Button>
              <Button
                variant="none"
                className="text-gray-600 text-sm hover:text-gray-800 p-0 h-auto"
                onClick={() => navigate("/credits")}
              >
                Credits
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Separate Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
};

export default Header;
