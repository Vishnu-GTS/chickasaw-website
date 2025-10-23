import React from "react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo.png";

const Header: React.FC = () => {
  return (
    <header className=" w-full">
      <div className=" mx-auto ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300">
          <div className="flex justify-between items-center h-16 px-6">
            {/* Left - Logo and Title */}
            <div className="flex items-center space-x-3">
              <img
                src={logoImage}
                alt="Chickasaw Nation Logo"
                className="w-10 h-10"
              />
              <h1 className="text-2xl font-bold text-gray-800">
                Chickasaw Basic
              </h1>
            </div>

            {/* Right - Navigation Links */}
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                className="text-gray-600 text-sm hover:text-gray-800 p-0 h-auto"
              >
                About Chickasaw Nation
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 text-sm hover:text-gray-800 p-0 h-auto"
              >
                Credits
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
