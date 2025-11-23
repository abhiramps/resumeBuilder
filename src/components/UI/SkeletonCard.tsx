/**
 * Skeleton Card Component
 * Loading placeholder for resume cards
 */

import React from 'react';

export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                {/* Icon placeholder */}
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                {/* Menu button placeholder */}
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>

            {/* Title placeholder */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

            {/* Date placeholder */}
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
};

export const SkeletonCardGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};
