import React from "react";
import { User } from "lucide-react";
import heroBg from "@/assets/hero_bg.png";

const CreditsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <section className="relative h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden">
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
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center">
            Credits
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Speakers Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            Speakers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {[
              "JoAnn Ellis",
              "Jerry Imotichey",
              "Rose Shields Jefferson",
              "Joshua D Hinson",
            ].map((speaker, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full shrink-0 flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-red-800" />
                </div>
                <span className="text-gray-800 font-medium text-xs sm:text-sm">
                  {speaker}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chickasaw/Choctaw Hymns Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            Chickasaw/Choctaw Hymns
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {[
              "Boiling Springs Methodist Church",
              "Sheila Bennett",
              "Jeff and Betty Frazier",
              "Ron Frazier",
              "Geneva Holman",
              "Ramona Miller",
              "Craig and Shannon Parnacher",
              "Dan and June Praytor",
              "Osborne and Christine Roberts",
              "Stanley and Mary Jane Smith",
              "Darla Wolf",
            ].map((hymn, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full shrink-0 flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-red-800" />
                </div>
                <span className="text-gray-800 font-medium text-xs sm:text-sm">
                  {hymn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chipota Chikashshanompoli Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            Chipota Chikashshanompoli (Children Speaking Chickasaw) Language
            Club
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {[
              "Kelly Cooke",
              "Levi Hinson",
              "Samantha Chapman",
              "Chelsea Wedlow",
              "Jolie Morgan",
              "Chris Anglin",
              "Colton Wilson",
              "Sean Cooke",
              "Zoe Allen",
              "Kelsey Morgan",
              "Johnathon DelFrate",
              "AnnaMae Palmer",
              "Jairus Smith",
            ].map((member, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full shrink-0 flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-red-800" />
                </div>
                <span className="text-gray-800 font-medium text-xs sm:text-sm">
                  {member}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Directed by */}
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-800 text-lg sm:text-xl font-medium text-center sm:text-left">
            Directed by Rachel Wedlow, Joshua D Hinson and Mary J Smith
          </p>
        </div>

        {/* Information Paragraphs */}
        <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
          <p>
            <strong>Permission:</strong> Per the language in the originally
            executed purchase order dated 8/26/09, the Chickasaw Nation gives
            Thornton Media, Inc. the permission to help distribute the App in
            the iTunes store; the Chickasaw Nation retains ownership of the app
            and all Chickasaw recordings.
          </p>

          <p>
            <strong>Created by</strong> Thornton Media Inc. for Department of
            Chickasaw Language / Chickasaw Language Revitalization Program,
            Division of History and Culture, the Chickasaw Nation. Amanda J
            Cobb-Greetham, Administrator.
          </p>

          <p className="text-center font-medium text-sm sm:text-base">
            The Chickasaw Nation, Governor Bill Ancatubby. Copyright 2018.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
