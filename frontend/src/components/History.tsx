'use client';

import { useEffect, useState } from 'react';
import { listReviews, getReview } from '@/lib/api';
import { Review } from '@/types';
import { FileCode, Loader2, ArrowLeft } from 'lucide-react';
import { formatDistance } from 'date-fns';
import ReviewResult from './ReviewResult';

export default function History() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await listReviews(100, 0); // Get up to 100 reviews
      setReviews(data);
    } catch (err: any) {
      setError('Failed to load review history');
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = async (reviewId: string) => {
    try {
      setLoading(true);
      const review = await getReview(reviewId);
      setSelectedReview(review);
    } catch (err: any) {
      setError('Failed to load review details');
      console.error('Failed to load review:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedReview(null);
    setError(null);
  };

  // Show review details if one is selected
  if (selectedReview) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="mb-4 flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to History</span>
          </button>
        </div>
        <ReviewResult review={selectedReview} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          <span className="text-gray-600">Loading review history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadReviews}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <FileCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 mb-4">
          Upload some code files to see your review history here.
        </p>
        <button
          onClick={() => window.location.href = '/?tab=upload'}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Upload Files
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review History</h2>
        <p className="text-gray-600">
          Click on any review to view the detailed analysis
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            onClick={() => handleReviewClick(review.id)}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 rounded-lg p-2">
                <FileCode className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{review.filename}</p>
                <p className="text-sm text-gray-500">
                  {review.language} • {formatDistance(new Date(review.created_at + 'Z'), new Date(), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Quality Score</p>
                <p className="text-xl font-bold text-primary-600">
                  {Math.round((review.analysis.readability_score + review.analysis.modularity_score + review.analysis.maintainability_score) / 3)}/10
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Issues</p>
                <p className="text-lg font-semibold text-gray-900">
                  {review.analysis.issues.length}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length >= 100 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing the 100 most recent reviews
          </p>
        </div>
      )}
    </div>
  );
}
