import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Skeleton, { SkeletonTableRow } from "@/components/ui/skeleton";
import MediaLoader from "@/components/ui/media-loader";
import { categoryService } from "@/services/api";
import { normalizeChickasawHTML } from "@/utils/textNormalizer";
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
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
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
          analyticalAudioUrl: "",
          humesAudioUrl: "",
          analyticalAudio: {
            id: "",
            filename: "",
            contentType: "",
            url: "",
          },
          humesAudio: {
            id: "",
            filename: "",
            contentType: "",
            url: "",
          },
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

  // Function to toggle row expansion
  const handleToggleRow = (subCategoryId: string) => {
    setExpandedRowId(expandedRowId === subCategoryId ? null : subCategoryId);
  };

  const handleWordClick = (subCategory: SubCategory) => {
    // Encode the word name for URL
    const encodedWordName = encodeURIComponent(subCategory.name);
    navigate(
      `/word/${encodedWordName}?category=${encodeURIComponent(
        subCategory.category.name
      )}`
    );
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
      <section className="relative h-[200px] sm:h-[300px] overflow-hidden">
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
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white text-center">
            {category?.name || "Category"}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackToHome}
          className="flex items-center text-base font-semibold mb-4 sm:mb-8 transition-colors duration-200 hover:underline"
          style={{ color: "#D3191C" }}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </Button>

        {/* Mobile-First List Container */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="py-4 sm:p-6">
            {/* Mobile Header - Visible only on small screens */}
            <div className="sm:hidden pb-3 border-b border-gray-200">
              <div className="flex items-center justify-between px-4">
                <div className="font-semibold text-gray-700 text-base">
                  Words
                </div>
                <div className="font-semibold text-gray-700 text-sm">Audio</div>
              </div>
            </div>

            {/* Desktop Table - Single grid container for consistent column widths */}
            <div className="hidden sm:block">
              <div
                className="grid px-2 items-center"
                style={{ gridTemplateColumns: "auto auto auto auto" }}
              >
                {/* Desktop Table Header */}
                <div className="font-semibold text-gray-700 text-sm pl-2 h-10 items-center flex border-b border-gray-200">
                  Title
                </div>
                <div className="font-semibold text-gray-700 text-sm h-10 items-center flex border-b border-gray-200">
                  Analytical
                </div>
                <div className="font-semibold text-gray-700 text-sm h-10 items-center flex border-b border-gray-200">
                  Humes
                </div>
                <div className="font-semibold text-gray-700 text-sm h-10 items-center flex border-b border-gray-200"></div>

                {/* Table Content */}
                {loading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <React.Fragment key={index}>
                        <div className="py-2">
                          <Skeleton height="h-4" width="w-3/4" />
                        </div>
                        <div className="py-2">
                          <Skeleton height="h-4" width="w-full" />
                        </div>
                        <div className="py-2 pl-4">
                          <Skeleton height="h-4" width="w-3/4" />
                        </div>
                        <div className="py-2 flex justify-center">
                          <Skeleton height="h-8" width="w-8" />
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="col-span-4 flex items-center justify-center py-4">
                      <LoadingSpinner
                        size="md"
                        text="Loading category items..."
                      />
                    </div>
                  </>
                ) : subCategories.length > 0 ? (
                  subCategories.flatMap((item) => {
                    const rowItems = [
                      <div
                        key={`${item._id}-title`}
                        onClick={() => handleWordClick(item)}
                        className="text-gray-800 font-medium text-base break-word px-2 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      >
                        {item.name}
                      </div>,
                      <div
                        key={`${item._id}-analytical`}
                        onClick={() => handleWordClick(item)}
                        className="text-gray-700 break-word text-base chickasaw-text px-2 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        dangerouslySetInnerHTML={{
                          __html: normalizeChickasawHTML(
                            item.chickasawAnalytical
                          ),
                        }}
                      />,
                      <div
                        key={`${item._id}-humes`}
                        onClick={() => handleWordClick(item)}
                        className="text-gray-700 break-word text-base chickasaw-text px-2 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        dangerouslySetInnerHTML={{
                          __html: normalizeChickasawHTML(item.language),
                        }}
                      />,
                      <div
                        key={`${item._id}-audio`}
                        className="flex justify-center items-center py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRow(item._id);
                        }}
                      >
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
                            handleToggleRow(item._id);
                          }}
                        >
                          <Play
                            className="w-4 h-4 ml-0.5 fill-current"
                            style={{ color: "#CC0000" }}
                          />
                        </Button>
                      </div>,
                    ];

                    // Add expanded media player row if this row is expanded
                    if (expandedRowId === item._id) {
                      rowItems.push(
                        <div
                          key={`${item._id}-expanded`}
                          className="col-span-4 bg-gray-50 p-2 border-b border-gray-100"
                        >
                          <div className="space-y-3">
                            <MediaLoader
                              src={
                                (item.analyticalAudioUrl ||
                                  item.humesAudioUrl) ??
                                item.videoUrl
                              }
                              type={
                                item.analyticalAudioUrl || item.humesAudioUrl
                                  ? "audio"
                                  : "video"
                              }
                              autoPlay
                              onError={(error) => {
                                console.error("Media load error:", error);
                              }}
                              onLoadStart={() => {
                                console.log(
                                  "Media loading started:",
                                  (item.analyticalAudioUrl ||
                                    item.humesAudioUrl) ??
                                    item.videoUrl
                                );
                              }}
                              onCanPlay={() => {
                                console.log(
                                  "Media can play:",
                                  (item.analyticalAudioUrl ||
                                    item.humesAudioUrl) ??
                                    item.videoUrl
                                );
                              }}
                            />
                          </div>
                        </div>
                      );
                    }

                    return rowItems;
                  })
                ) : (
                  <div className="col-span-4 text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No items found in this category.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="space-y-2 sm:hidden">
              {loading ? (
                <div className="space-y-2">
                  {/* Show skeleton rows while loading */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonTableRow key={index} />
                  ))}
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner
                      size="md"
                      text="Loading category items..."
                    />
                  </div>
                </div>
              ) : subCategories.length > 0 ? (
                subCategories.map((item) => (
                  <React.Fragment key={item._id}>
                    {/* Mobile Layout */}
                    <div
                      className="py-3.5 px-4 border-b mb-0 border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => handleWordClick(item)}
                    >
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex-1 space-y-0.5 min-w-0">
                          {/* Main title - bold and prominent */}
                          <div className="text-gray-900 font-semibold break-all text-[20px]">
                            {item.name}
                          </div>

                          {/* Analytical translation - smaller, gray */}
                          <div className="break-all text-lg">
                            <span className="text-gray-900 font-medium">
                              <span
                                className="chickasaw-text"
                                dangerouslySetInnerHTML={{
                                  __html: normalizeChickasawHTML(
                                    item.chickasawAnalytical
                                  ),
                                }}
                              ></span>
                            </span>
                          </div>

                          {/* Humes translation */}
                          {item.language !== "-" && (
                            <div className="break-all text-base">
                              <span className="text-gray-500">
                                <span
                                  className="chickasaw-text"
                                  dangerouslySetInnerHTML={{
                                    __html: normalizeChickasawHTML(
                                      item.language
                                    ),
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
                              handleToggleRow(item._id);
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

                    {/* Expanded Media Player Row */}
                    {expandedRowId === item._id && (
                      <div className="bg-gray-50 p-2 border-b border-gray-100">
                        <div className="space-y-3">
                          {/* Media Player */}
                          <MediaLoader
                            src={
                              (item.analyticalAudioUrl || item.humesAudioUrl) ??
                              item.videoUrl
                            }
                            type={
                              item.analyticalAudioUrl || item.humesAudioUrl
                                ? "audio"
                                : "video"
                            }
                            autoPlay
                            onError={(error) => {
                              console.error("Media load error:", error);
                            }}
                            onLoadStart={() => {
                              console.log(
                                "Media loading started:",
                                (item.analyticalAudioUrl ||
                                  item.humesAudioUrl) ??
                                  item.videoUrl
                              );
                            }}
                            onCanPlay={() => {
                              console.log(
                                "Media can play:",
                                (item.analyticalAudioUrl ||
                                  item.humesAudioUrl) ??
                                  item.videoUrl
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
                    No items found in this category.
                  </p>
                </div>
              )}
            </div>
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
    </div>
  );
};

export default CategoryPage;
