import React from "react";

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  height = "h-4",
  width = "w-full",
  rounded = true,
}) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${height} ${width} ${
        rounded ? "rounded" : ""
      } ${className}`}
    />
  );
};

// Skeleton components for specific use cases
export const SkeletonCard: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
    <Skeleton height="h-6" width="w-3/4" className="mb-2" />
    <Skeleton height="h-4" width="w-1/2" />
  </div>
);

export const SkeletonTableRow: React.FC = () => (
  <div className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100">
    <Skeleton height="h-4" width="w-3/4" className="ml-2" />
    <Skeleton height="h-4" width="w-2/3" />
    <Skeleton height="h-4" width="w-1/2" />
    <div className="flex justify-center">
      <Skeleton height="h-8" width="w-8" className="rounded-full" />
    </div>
  </div>
);

export const SkeletonSearchResult: React.FC = () => (
  <div className="flex justify-between p-4 border-b border-gray-100">
    <div className="flex flex-col space-y-2">
      <Skeleton height="h-5" width="w-32" />
      <Skeleton height="h-4" width="w-24" />
      <Skeleton height="h-4" width="w-40" />
    </div>
    <Skeleton height="h-8" width="w-8" className="rounded-full" />
  </div>
);

export default Skeleton;
