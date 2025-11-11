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
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

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

  // Function to toggle row expansion
  const handleToggleRow = (subCategoryId: string) => {
    setExpandedRowId(expandedRowId === subCategoryId ? null : subCategoryId);
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

            <Card className="bg-white shadow-none py-4  rounded-lg">
              <CardContent className="px-0 lg:px-3  pt-0">
                {/* Mobile Header - Visible only on small screens */}
                <div className="sm:hidden pb-3 border-b border-gray-200 ">
                  <div className="flex items-center justify-between px-4">
                    <div className="font-semibold text-gray-700 text-base">
                      Words
                    </div>
                    <div className="font-semibold text-gray-700 text-sm">
                      Audio
                    </div>
                  </div>
                </div>

                {/* Desktop Table Header - Hidden on mobile */}
                <div className="hidden sm:grid grid-cols-4  px-2 lg:px-6 gap-4 pb-3 border-b border-gray-200 ">
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
                <div className="space-y-2 sm:space-y-0">
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
                      <React.Fragment key={subCategory._id}>
                        {/* Mobile Layout */}
                        <div
                          className="sm:hidden py-3.5 px-4 border-b mb-0 border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => navigate(`/word/${subCategory.name}`)}
                        >
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex-1 space-y-0.5 min-w-0">
                              {/* Main title - bold and prominent */}
                              <div className="text-gray-900 font-semibold break-all text-[20px] ">
                                {subCategory.name}
                              </div>

                              {/* Analytical translation - smaller, gray */}
                              <div className="break-all text-lg">
                                <span className="text-gray-900 font-medium">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: subCategory.chickasawAnalytical,
                                    }}
                                  ></span>
                                </span>
                              </div>

                              {/* Humes translation */}
                              {subCategory.language !== "-" && (
                                <div className="break-all text-base">
                                  <span className="text-gray-500">
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: subCategory.language,
                                      }}
                                    ></span>
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3 shrink-0">
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
                                  handleToggleRow(subCategory._id);
                                }}
                              >
                                <Play
                                  className="w-4 h-4 ml-0.5 fill-current"
                                  style={{ color: "#CC0000" }}
                                />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout - Original simple format */}
                        <div
                          onClick={() => navigate(`/word/${subCategory.name}`)}
                          className="hidden sm:grid grid-cols-4  items-center gap-4 py-2 px-2 lg:px-6 border-b mb-0 border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="text-gray-800 font-medium text-sm break-word pl-2">
                            {subCategory.name}
                          </div>
                          <div
                            className="text-gray-700  break-word text-sm"
                            dangerouslySetInnerHTML={{
                              __html: subCategory.chickasawAnalytical,
                            }}
                          />
                          <div
                            className="text-gray-700 break-word text-sm"
                            dangerouslySetInnerHTML={{
                              __html: subCategory.language,
                            }}
                          />
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
                                handleToggleRow(subCategory._id);
                              }}
                            >
                              <Play
                                className="w-4 h-4 ml-0.5 fill-current"
                                style={{ color: "#CC0000" }}
                              />
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Media Player Row */}
                        {expandedRowId === subCategory._id && (
                          <div className="bg-gray-50 p-2 border-b border-gray-100">
                            <div className="space-y-3">
                              {/* Media Player */}
                              <MediaLoader
                                src={subCategory.audioUrl}
                                type="audio"
                                autoPlay
                                onError={(error) => {
                                  console.error("Media load error:", error);
                                }}
                                onLoadStart={() => {
                                  console.log(
                                    "Media loading started:",
                                    subCategory.audioUrl
                                  );
                                }}
                                onCanPlay={() => {
                                  console.log(
                                    "Media can play:",
                                    subCategory.audioUrl
                                  );
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
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
    </div>
  );
};

export default MainContent;
