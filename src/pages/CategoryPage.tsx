import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { SkeletonTableRow } from "@/components/ui/skeleton";
import MediaLoader from "@/components/ui/media-loader";
import { categoryService } from "@/services/api";
import type { AdvancedSearchResult, SubCategory } from "@/types";
import heroBg from "@/assets/hero_bg.png";

const CategoryPage: React.FC = () => {
  const { categoryId, categoryName } = useParams<{
    categoryId: string;
    categoryName: string;
  }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<AdvancedSearchResult | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "audio" | "video";
    url: string;
    filename: string;
    analytical?: string;
    humes?: string;
  } | null>(null);
  const fetchedCategoryRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndSubCategories = async () => {
      if (!categoryId) return;

      // Prevent duplicate API calls for the same category
      if (fetchedCategoryRef.current === categoryId) {
        return;
      }

      try {
        setLoading(true);
        fetchedCategoryRef.current = categoryId;

        // Use category name from URL
        const displayCategoryName = categoryName
          ? decodeURIComponent(categoryName)
          : "Category";

        // Create category object with name from URL
        const categoryFromUrl: AdvancedSearchResult = {
          _id: categoryId,
          name: displayCategoryName,
          chickasawAnalytical: "",
          language: "",
          mediaUrl: "",
          category: {
            _id: categoryId,
            name: displayCategoryName,
            createdAt: "",
            updatedAt: "",
            __v: 0,
          },
          mediaType: "",
          type: "category",
          createdAt: "",
          updatedAt: "",
          __v: 0,
          audio: undefined,
          video: undefined,
        };
        setCategory(categoryFromUrl);

        // Fetch sub-categories
        const response = await categoryService.getSubCategories(categoryId);
        if (response.success) {
          setSubCategories(response.data);
        } else {
          setError("Failed to load category items");
        }
      } catch (err) {
        console.error("Error fetching sub-categories:", err);
        setError("Failed to load category items");
        fetchedCategoryRef.current = null; // Reset on error to allow retry
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndSubCategories();
  }, [categoryId, categoryName]);

  const handleAudioPlay = async (
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
          type: "audio",
          url: alternativeUrl,
          filename,
          analytical,
          humes,
        });
        return;
      }

      setSelectedMedia({
        type: "audio",
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
        type: "audio",
        url: alternativeUrl,
        filename,
        analytical,
        humes,
      });
    }
  };

  const handleWordClick = (subCategory: SubCategory) => {
    // Encode the word name for URL
    const encodedWordName = encodeURIComponent(subCategory.name);
    navigate(`/word/${encodedWordName}`);
  };

  const handleBackToHome = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
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

        {/* Category Title */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            {category?.name || "Category"}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackToHome}
          className="flex items-center text-sm font-medium mb-8 transition-colors duration-200 hover:underline"
          style={{ color: "#D3191C" }}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </Button>

        {/* Table Container */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden ">
          <div className="p-6">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 pb-3 border-b border-gray-200 mb-3">
              <div className="font-semibold text-gray-700 text-sm pl-2">
                Title
              </div>
              <div className="font-semibold text-gray-700 text-sm">
                Analytical
              </div>
              <div className="font-semibold text-gray-700 text-sm">Humes</div>
              <div className="font-semibold text-gray-700 text-sm"></div>
            </div>

            {/* Table Content */}
            {loading ? (
              <div className="space-y-2">
                {/* Show skeleton rows while loading */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={index} />
                ))}
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner size="md" text="Loading category items..." />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {subCategories.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-4 gap-4 py-2 mb-0 items-center border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleWordClick(item)}
                  >
                    <div className="text-gray-800 pl-2 font-medium text-sm">
                      {item.name}
                    </div>
                    <div className="text-gray-700 text-sm">
                      {item.chickasawAnalytical}
                    </div>
                    <div className="text-gray-700 text-sm">{item.language}</div>
                    <div className="flex justify-center">
                      {item.audioUrl && (
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
                            handleAudioPlay(
                              item.audioUrl,
                              item.name,
                              item.chickasawAnalytical,
                              item.language
                            );
                          }}
                        >
                          <Play
                            className="w-4 h-4 ml-0.5 fill-current"
                            style={{ color: "#CC0000" }}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!loading && subCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No items found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div
          onClick={() => {
            setSelectedMedia(null);
          }}
          className="fixed inset-0 bg-black/50 bg-opacity-20 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="bg-white p-4 rounded-lg max-w-lg w-full mx-4"
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
              onClick={() => {
                setSelectedMedia(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
