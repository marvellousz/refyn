'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import ReviewResult from '@/components/ReviewResult';
import Dashboard from '@/components/Dashboard';
import History from '@/components/History';
import Homepage from '@/components/Homepage';
import { uploadFile, getReview } from '@/lib/api';
import { Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Code2, BarChart3, Upload as UploadIcon, History as HistoryIcon, LogOut, User } from 'lucide-react';

export default function Home() {
  const searchParams = useSearchParams();
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard' | 'history'>('dashboard');
  const [review, setReview] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load review from URL parameter and handle tab navigation
  useEffect(() => {
    const reviewId = searchParams.get('review');
    const tab = searchParams.get('tab');
    
    if (reviewId) {
      loadReview(reviewId);
    }
    
    if (tab === 'history') {
      setActiveTab('history');
    } else if (tab === 'dashboard') {
      setActiveTab('dashboard');
    } else if (tab === 'upload') {
      setActiveTab('upload');
    } else if (!tab && !reviewId) {
      // Default to dashboard when no tab is specified and no review is being loaded
      setActiveTab('dashboard');
    }
  }, [searchParams]);

  const handleFileUpload = async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    setReview(null);
    setReviews([]);

    try {
      const uploadPromises = files.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      if (results.length === 1) {
        // Single file - show individual review
        setReview(results[0]);
      } else {
        // Multiple files - show all reviews
        setReviews(results);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload files. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReview = async (reviewId: string) => {
    setIsLoading(true);
    setError(null);
    setActiveTab('upload'); // Switch to upload tab to show the review

    try {
      const result = await getReview(reviewId);
      setReview(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load review. Please try again.');
      console.error('Load review error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewReview = () => {
    setReview(null);
    setReviews([]);
    setError(null);
    window.history.replaceState({}, '', '/');
  };

  // Show homepage for unauthenticated users
  if (!loading && !user) {
    return <Homepage />;
  }

  // Show loading for authenticated users
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center space-x-3 text-gray-600">
          <Code2 className="w-8 h-8 animate-pulse text-blue-600" />
          <span className="text-xl font-semibold">Loading Refyn...</span>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 rounded-lg p-2">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Refyn</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-2">
              <button
                onClick={() => {
                  setActiveTab('upload');
                  window.history.replaceState({}, '', '/?tab=upload');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <UploadIcon className="w-4 h-4" />
                <span>Upload</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  window.history.replaceState({}, '', '/?tab=dashboard');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('history');
                  window.history.replaceState({}, '', '/?tab=history');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'history'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <HistoryIcon className="w-4 h-4" />
                <span>History</span>
              </button>
              </nav>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user?.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            {!review && !isLoading && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Get Instant AI-Powered Code Reviews with Refyn
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Upload your code and receive detailed feedback on readability, modularity, 
                  potential bugs, security concerns, and best practices.
                </p>
              </div>
            )}

            {/* Upload Section */}
            {!review && reviews.length === 0 && (
              <>
                <FileUpload onUpload={handleFileUpload} isLoading={isLoading} />
                
                {error && (
                  <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {/* Features */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Code2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Multi-Language Support</h3>
                    <p className="text-sm text-gray-600">
                      Works with Python, JavaScript, TypeScript, Java, Go, and many more
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Get scores for readability, modularity, and maintainability
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <UploadIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                    <p className="text-sm text-gray-600">
                      Receive actionable feedback in seconds powered by AI
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Review Results */}
            {review && (
              <div>
                <div className="mb-6 flex justify-end">
                  <button
                    onClick={handleNewReview}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    New Review
                  </button>
                </div>
                <ReviewResult review={review} />
              </div>
            )}

            {/* Multiple Review Results */}
            {reviews.length > 0 && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Code Reviews ({reviews.length} files)
                  </h2>
                  <button
                    onClick={handleNewReview}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    New Review
                  </button>
                </div>
                <div className="space-y-8">
                  {reviews.map((reviewItem, index) => (
                    <div key={reviewItem.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reviewItem.filename}
                        </h3>
                        <span className="text-sm text-gray-500">
                          Review {index + 1} of {reviews.length}
                        </span>
                      </div>
                      <ReviewResult review={reviewItem} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'dashboard' ? (
          <Dashboard />
        ) : (
          <History />
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-white text-sm">
              © 2025 Refyn. Open source project.
            </p>
          </div>
        </div>
      </footer>
      </div>
  );
}

