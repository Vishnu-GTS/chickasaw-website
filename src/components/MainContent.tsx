import React, { useState, useEffect } from "react";
import { ChevronsRight, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WordDetails from "./WordDetails";
import {
  categoryService,
  type Category,
  type SubCategory,
  type AdvancedSearchResult,
} from "@/services/api";

interface MainContentProps {
  selectedWordFromSearch?: AdvancedSearchResult | null;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedWordFromSearch,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<SubCategory | null>(null);

  // Fetch sub-categories when category is selected
  const fetchSubCategories = async (categoryId: string) => {
    try {
      setSubCategoriesLoading(true);
      const response = await categoryService.getSubCategories(categoryId);
      if (response.success) {
        setSubCategories(response.data);
      } else {
        setError("Failed to fetch sub-categories");
      }
    } catch (err) {
      setError("Error loading sub-categories. Please try again.");
      console.error("Error fetching sub-categories:", err);
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoryService.getCategories();
        if (response.success) {
          setCategories(response.data);
          // Set first category as active by default
          if (response.data.length > 0) {
            setSelectedCategory(response.data[0]._id);
          }
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error loading categories. Please try again.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch sub-categories when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  const [selectedMedia, setSelectedMedia] = useState<{
    type: "audio" | "video";
    url: string;
    filename: string;
  } | null>(null);

  // Function to preview audio
  const handlePreview = async (
    type: "audio" | "video",
    audioUrl: string,
    filename: string
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
        });
        return;
      }

      setSelectedMedia({
        type,
        url: audioUrl,
        filename,
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
      });
    }
  };

  // Handle word selection for details page
  const handleWordClick = (word: SubCategory) => {
    setSelectedWord(word);
  };

  // Handle back navigation from details page
  const handleBackToHome = () => {
    setSelectedWord(null);
  };

  // Convert AdvancedSearchResult to SubCategory format
  const convertSearchResultToSubCategory = (
    searchResult: AdvancedSearchResult
  ): SubCategory => {
    return {
      _id: searchResult._id,
      name: searchResult.name,
      chickasawAnalytical: searchResult.chickasawAnalytical,
      language: searchResult.language || searchResult.chickasawAnalytical, // fallback to analytical if language not available
      audioUrl: searchResult.mediaUrl,
      category: searchResult.category,
      mediaType: searchResult.mediaType,
      videoUrl: searchResult.video?.url || null,
      createdAt: searchResult.createdAt,
      updatedAt: searchResult.updatedAt,
      __v: searchResult.__v,
    };
  };

  // Handle search result navigation
  React.useEffect(() => {
    if (selectedWordFromSearch) {
      const convertedWord = convertSearchResultToSubCategory(
        selectedWordFromSearch
      );
      setSelectedWord(convertedWord);
    }
  }, [selectedWordFromSearch]);

  // If a word is selected, show the details page
  if (selectedWord) {
    return <WordDetails word={selectedWord} onBack={handleBackToHome} />;
  }

  return (
    <div className="bg-white  min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Category List */}
          <div className="lg:col-span-1">
            <div className="flex justify-between pb-2 px-2 items-center">
              <div className="text-xl font-medium text-gray-800">Category</div>
              <Button
                variant="ghost"
                className="text-base font-medium hover:underline transition-colors p-0 h-auto"
                style={{ color: "#D3191C" }}
              >
                See All
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
            <Card className="bg-white shadow-none px-0 rounded-xl ">
              <CardContent className="pt-0 px-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2
                      className="w-6 h-6 animate-spin"
                      style={{ color: "#D3191C" }}
                    />
                    <span className="ml-2 text-gray-600">
                      Loading categories...
                    </span>
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
                      onClick={() => setSelectedCategory(null)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">All</span>
                        <span
                          className={`text-xs ${
                            selectedCategory === null
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        >
                          All words
                        </span>
                      </div>
                    </div>

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
                        onClick={() => setSelectedCategory(category._id)}
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
          <div className="lg:col-span-2">
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
                  <div className="font-semibold text-gray-700 text-sm">
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
                    <div className="flex items-center justify-center py-8">
                      <Loader2
                        className="w-6 h-6 animate-spin"
                        style={{ color: "#D3191C" }}
                      />
                      <span className="ml-2 text-gray-600">
                        Loading words...
                      </span>
                    </div>
                  ) : subCategories.length > 0 ? (
                    subCategories.map((subCategory) => (
                      <div
                        key={subCategory._id}
                        className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => handleWordClick(subCategory)}
                      >
                        <div className="text-gray-800 font-medium text-sm">
                          {subCategory.name}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {subCategory.chickasawAnalytical}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {subCategory.language}
                        </div>
                        <div className="flex justify-end">
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
                                subCategory.name
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
            className="bg-white p-4 rounded-lg max-w-lg w-full mx-4"
          >
            <h2 className="text-lg font-bold mb-2">
              Preview: {selectedMedia.filename}
            </h2>
            {selectedMedia.type === "audio" ? (
              <audio
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full"
                onError={(e) => {
                  console.error("Audio load error:", e);
                  const target = e.target as HTMLAudioElement;
                  target.style.display = "none";
                  const errorDiv = document.createElement("div");
                  errorDiv.className = "text-red-600 text-center p-4";
                  errorDiv.innerHTML = `
                    <p>Unable to load audio file</p>
                    <p class="text-sm text-gray-500 mt-2">URL: ${selectedMedia.url}</p>
                    <p class="text-sm text-gray-500">This might be due to CORS restrictions or the file not being accessible.</p>
                  `;
                  target.parentNode?.insertBefore(errorDiv, target.nextSibling);
                }}
                onLoadStart={() => {
                  console.log("Audio loading started:", selectedMedia.url);
                }}
                onCanPlay={() => {
                  console.log("Audio can play:", selectedMedia.url);
                }}
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full"
                onError={(e) => {
                  console.error("Video load error:", e);
                }}
              />
            )}

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
