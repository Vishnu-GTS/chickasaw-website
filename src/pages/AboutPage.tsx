import React from "react";
import heroBg from "@/assets/hero_bg.png";
import logoImage from "@/assets/logo.png";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <section className="relative h-[300px] overflow-hidden">
        {/* Background Image with Red Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(296.02deg, rgba(211, 25, 28, 0.7) 0%, rgba(191, 17, 20, 0.8) 100%)",
          }}
        />

        {/* Page Title */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            About Chickasaw Nation
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-40 h-40 ">
            <img
              src={logoImage}
              alt="Chickasaw Nation Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <p className="text-xl text-gray-800 font-medium">
            Official website of the Chickasaw Nation
          </p>

          <a
            href="https://www.chickasaw.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            https://www.chickasaw.net/
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
