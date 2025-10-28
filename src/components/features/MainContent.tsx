import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsRight, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Skeleton, { SkeletonTableRow } from "@/components/ui/skeleton";
import MediaLoader from "@/components/ui/media-loader";
import { categoryService } from "@/services/api";
import { useCategories } from "@/contexts/CategoriesContext";
import SplashScreen from "./SplashScreen";
import type { SubCategory } from "@/types";

const MainContent: React.FC = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryData, setShowCategoryData] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "audio" | "video";
    url: string;
    filename: string;
    analytical?: string;
    humes?: string;
  } | null>(null);

  // Fetch sub-categories when category is selected
  const fetchSubCategories = async (categoryId: string) => {
    try {
      setSubCategoriesLoading(true);
      const response = await categoryService.getSubCategories(categoryId);
      if (response.success) {
        setSubCategories(response.data);
      } else {
        console.error("Failed to fetch sub-categories");
      }
    } catch (err) {
      console.error("Error loading sub-categories. Please try again.", err);
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  // Set first category as active by default when categories are loaded (desktop only)
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]._id);
    }
  }, [categories, selectedCategory]);

  // Handle category selection for mobile
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setShowCategoryData(true);
  };

  // Handle back button click
  const handleBackToCategories = () => {
    setShowCategoryData(false);
  };

  // Fetch sub-categories when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  // Show splash screen while loading categories
  if (loading) {
    return <SplashScreen />;
  }

  // Function to preview audio
  const handlePreview = async (
    type: "audio" | "video",
    audioUrl: string,
    filename: string,
    analytical?: string,
    humes?: string
  ) => {
    try {
      // Test if the URL is accessible
      const response = await fetch(audioUrl, { method: "HEAD" });
      if (!response.ok) {
        console.error(
          "Audio URL not accessible:",
          response.status,
          response.statusText
        );
        // Try alternative URL format
        const fileId = audioUrl.split("/").pop();
        const alternativeUrl = `https://chickasaw-admin-one.vercel.app/api/gridfs/${fileId}`;
        console.log("Trying alternative URL:", alternativeUrl);
        setSelectedMedia({
          type,
          url: alternativeUrl,
          filename,
          analytical,
          humes,
        });
        return;
      }

      setSelectedMedia({
        type,
        url: audioUrl,
        filename,
        analytical,
        humes,
      });
    } catch (error) {
      console.error("Error testing audio URL:", error);
      // Try alternative URL format
      const fileId = audioUrl.split("/").pop();
      const alternativeUrl = `https://chickasaw-admin-one.vercel.app/api/gridfs/${fileId}`;
      console.log("Trying alternative URL:", alternativeUrl);
      setSelectedMedia({
        type,
        url: alternativeUrl,
        filename,
        analytical,
        humes,
      });
    }
  };

  return (
    <div className="bg-white  min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Category List */}
          <div
            className={`lg:col-span-1 ${
              showCategoryData ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex justify-between pb-2 px-2 items-center">
              <div className="text-xl font-medium text-gray-800">Category</div>
              <Button
                variant="none"
                className="text-base font-medium hover:underline transition-colors p-0 h-auto"
                style={{ color: "#D3191C" }}
                onClick={() => navigate("/all-categories")}
              >
                See All
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
            <Card className="bg-white shadow-none py-1.5 px-0 rounded-xl ">
              <CardContent className="pt-0 px-3">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="px-3 py-2">
                        <Skeleton height="h-6" width="w-3/4" />
                      </div>
                    ))}
                    <div className="flex items-center justify-center py-4">
                      <LoadingSpinner size="sm" text="Loading categories..." />
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 text-sm mb-2">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      style={{ borderColor: "#D3191C", color: "#D3191C" }}
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Add "All" category option */}
                    <div
                      className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                        selectedCategory === null
                          ? "text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={
                        selectedCategory === null
                          ? { backgroundColor: "#D3191C" }
                          : {}
                      }
                      onClick={() => handleCategoryClick(null)}
                    ></div>

                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                          selectedCategory === category._id
                            ? "text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={
                          selectedCategory === category._id
                            ? { backgroundColor: "#D3191C" }
                            : {}
                        }
                        onClick={() => handleCategoryClick(category._id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">
                            {category.name}
                          </span>
                          <span
                            className={`text-xs ${
                              selectedCategory === category._id
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          >
                            {category.wordCount} words
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content Details */}
          <div
            className={`lg:col-span-2 ${
              showCategoryData ? "block" : "hidden lg:block"
            }`}
          >
            {/* Back Button - Only visible on mobile */}
            <Button
              variant="ghost"
              className="lg:hidden mb-4 flex items-center gap-2 px-0 hover:bg-transparent"
              style={{ color: "#D3191C" }}
              onClick={handleBackToCategories}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Categories</span>
            </Button>

            <div className="text-xl font-medium pb-2    ">
              {selectedCategory === null
                ? "All Categories"
                : categories.find((cat) => cat._id === selectedCategory)
                    ?.name || "Select a Category"}
            </div>

            <Card className="bg-white shadow-none  rounded-lg">
              <CardContent className="pt-0">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 pb-3 border-b border-gray-200 mb-3">
                  <div className="font-semibold text-gray-700 text-sm pl-2">
                    Title
                  </div>
                  <div className="font-semibold text-gray-700 text-sm">
                    Analytical
                  </div>
                  <div className="font-semibold text-gray-700 text-sm">
                    Humes
                  </div>
                  <div className="font-semibold text-gray-700 text-sm"></div>
                </div>

                {/* Table Content */}
                <div className="space-y-2">
                  {subCategoriesLoading ? (
                    <div className="space-y-2">
                      {/* Show skeleton rows while loading */}
                      {Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonTableRow key={index} />
                      ))}
                      <div className="flex items-center justify-center py-4">
                        <LoadingSpinner size="sm" text="Loading words..." />
                      </div>
                    </div>
                  ) : subCategories.length > 0 ? (
                    subCategories.map((subCategory) => (
                      <div
                        key={subCategory._id}
                        onClick={() => navigate(`/word/${subCategory.name}`)}
                        className="grid grid-cols-4 items-center gap-4 py-2 border-b mb-0 border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="text-gray-800 font-medium text-sm pl-2">
                          {subCategory.name}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {subCategory.chickasawAnalytical}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {subCategory.language}
                        </div>
                        <div className="flex justify-center">
                          <Button
                            size="icon"
                            className="w-8 h-8 rounded-full transition-colors border-0 shadow-none"
                            style={{
                              backgroundColor: "#F7F7F7",
                            }}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              (
                                e.target as HTMLButtonElement
                              ).style.backgroundColor = "#F9FAFB";
                            }}
                            onMouseLeave={(e) => {
                              e.stopPropagation();
                              (
                                e.target as HTMLButtonElement
                              ).style.backgroundColor = "#F7F7F7";
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(
                                "audio",
                                subCategory.audioUrl,
                                subCategory.name,
                                subCategory.chickasawAnalytical,
                                subCategory.language
                              );
                            }}
                          >
                            <Play
                              className="w-4 h-4 ml-0.5 fill-current"
                              style={{ color: "#CC0000" }}
                            />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        No words found for this category.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 bg-black/50 bg-opacity-20 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="bg-white p-6 rounded-lg max-w-lg w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Word: {selectedMedia.filename}
            </h2>

            {/* Analytical and Humes Text */}
            <div className="mb-4 space-y-2">
              {selectedMedia.analytical && (
                <div>
                  <span className="font-semibold text-gray-700 text-sm">
                    Analytical:
                  </span>
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedMedia.analytical}
                  </p>
                </div>
              )}
              {selectedMedia.humes && (
                <div>
                  <span className="font-semibold text-gray-700 text-sm">
                    Humes:
                  </span>
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedMedia.humes}
                  </p>
                </div>
              )}
            </div>

            <MediaLoader
              src={selectedMedia.url}
              type={selectedMedia.type}
              autoPlay
              onError={(error) => {
                console.error("Media load error:", error);
              }}
              onLoadStart={() => {
                console.log("Media loading started:", selectedMedia.url);
              }}
              onCanPlay={() => {
                console.log("Media can play:", selectedMedia.url);
              }}
            />

            <button
              type="button"
              className="hover:cursor-pointer mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedMedia(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
