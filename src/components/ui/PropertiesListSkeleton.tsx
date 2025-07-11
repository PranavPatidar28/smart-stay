import React from "react";

const PropertiesListSkeleton = ({ isMobile = false }: { isMobile?: boolean }) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden animate-pulse">
            <div className="relative h-44 w-full shimmer">
              <div className="absolute top-3 left-3 h-5 w-16 rounded-full shimmer" />
              <div className="absolute bottom-3 right-3 h-5 w-12 rounded-full shimmer" />
              <div className="absolute bottom-3 left-3 h-8 w-20 rounded-xl shimmer" />
              <div className="absolute top-3 right-3 h-8 w-8 rounded-full shimmer" />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="h-5 w-2/3 rounded shimmer mb-1" />
              <div className="h-4 w-1/2 rounded shimmer mb-1" />
              <div className="flex gap-4 mb-1">
                <div className="h-4 w-8 rounded shimmer" />
                <div className="h-4 w-8 rounded shimmer" />
                <div className="h-4 w-12 rounded shimmer" />
              </div>
              <div className="flex flex-wrap gap-2 mb-1">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="h-5 w-16 rounded-full shimmer" />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 rounded-full shimmer" />
                <div className="h-4 w-16 rounded shimmer" />
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex-1 h-10 rounded-xl shimmer" />
                <div className="w-10 h-10 rounded-xl shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex justify-center">
          <div className="w-full max-w-xl min-w-[380px]">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 group relative transition-all duration-300 flex flex-col">
              <div className="relative h-56 w-full shimmer">
                <div className="absolute top-4 left-4 px-3 py-1 h-6 w-20 rounded-full shimmer" />
                <div className="absolute bottom-4 right-4 px-3 py-1 h-6 w-16 rounded-full shimmer" />
                <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 h-10 w-28 rounded-xl shimmer" />
                <div className="absolute top-4 right-4 p-2 h-10 w-10 rounded-full shimmer" />
              </div>
              <div className="flex flex-col justify-between p-6 gap-4 flex-1">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2 min-w-0 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="h-7 w-3/4 rounded shimmer mb-2" />
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-4 w-4 rounded-full shimmer" />
                        <div className="h-4 w-24 rounded shimmer" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2 bg-yellow-50 px-2 py-1 rounded-lg">
                      <div className="h-4 w-4 rounded-full shimmer" />
                      <div className="h-4 w-6 rounded shimmer" />
                    </div>
                  </div>
                  <div className="flex gap-6 mb-2">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full shimmer mb-1" />
                      <div className="h-3 w-8 rounded shimmer" />
                      <div className="h-3 w-6 rounded shimmer mt-1" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full shimmer mb-1" />
                      <div className="h-3 w-8 rounded shimmer" />
                      <div className="h-3 w-6 rounded shimmer mt-1" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full shimmer mb-1" />
                      <div className="h-3 w-12 rounded shimmer" />
                      <div className="h-3 w-10 rounded shimmer mt-1" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="h-6 w-24 rounded-full shimmer" />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="h-6 w-20 rounded-full shimmer" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2 mb-1">
                    <div className="w-8 h-8 rounded-full shimmer" />
                    <div className="h-4 w-20 rounded shimmer" />
                    <div className="h-4 w-12 rounded shimmer" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <div className="flex-1 h-12 rounded-xl shimmer" />
                  <div className="w-14 h-12 rounded-xl shimmer" />
                  <div className="w-14 h-12 rounded-xl shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertiesListSkeleton; 