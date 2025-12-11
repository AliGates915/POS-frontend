import React from "react";

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    itemsPerPage = 10,
    showPageInfo = true,
    showItemsInfo = true,
    compact = false
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Compact version
    if (compact) {
        return (
            <div className="flex items-center justify-between mt-6 px-2">
                {/* LEFT SIDE — PAGE INFO */}
                {showPageInfo && (
                    <div className="text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        Page <span className="font-semibold text-newPrimary">{currentPage}</span> of{" "}
                        <span className="font-semibold text-gray-800">{totalPages}</span>
                        {showItemsInfo && (
                            <>
                                {" "}•<span className="text-gray-700 ml-1">{totalItems} items</span>
                            </>
                        )}
                    </div>
                )}

                {/* RIGHT SIDE — BUTTONS */}
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
              flex items-center gap-2
              ${currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : `
                  bg-white text-gray-700 border border-gray-300 
                  hover:bg-newPrimary/5 hover:border-newPrimary/30 hover:text-newPrimary
                  active:scale-95
                `
                            }
            `}
                    >
                        <svg
                            className={`w-4 h-4 ${currentPage === 1 ? "text-gray-400" : "text-gray-600"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
              flex items-center gap-2
              ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : `
                  bg-newPrimary text-white border border-newPrimary
                  hover:bg-newPrimary/90 hover:shadow-md
                  active:scale-95
                `
                            }
            `}
                    >
                        Next
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Full version with page numbers
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
            {/* LEFT SIDE — ITEMS INFO */}
            <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-newPrimary">{startItem}</span> to{" "}
                <span className="font-semibold text-newPrimary">{endItem}</span> of{" "}
                <span className="font-semibold text-gray-800">{totalItems}</span> items
            </div>

            {/* MIDDLE — PAGE NUMBERS */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`
            p-2 rounded-lg border transition-all duration-200 
            ${currentPage === 1
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : `
                bg-white text-gray-700 border-gray-300 
                hover:bg-newPrimary/5 hover:border-newPrimary/30 hover:text-newPrimary
                active:scale-95
              `
                        }
          `}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`
                  w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                  ${currentPage === pageNum
                                        ? "bg-newPrimary text-white shadow-sm"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                    }
                `}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            <span className="text-gray-400 mx-1">...</span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="w-9 h-9 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`
            p-2 rounded-lg border transition-all duration-200 
            ${currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : `
                bg-white text-gray-700 border-gray-300 
                hover:bg-newPrimary/5 hover:border-newPrimary/30 hover:text-newPrimary
                active:scale-95
              `
                        }
          `}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* RIGHT SIDE — PAGE INFO */}
            <div className="text-sm text-gray-600 font-medium">
                Page <span className="text-newPrimary font-semibold">{currentPage}</span> of{" "}
                <span className="text-gray-800 font-semibold">{totalPages}</span>
            </div>
        </div>
    );
};

export default Pagination;