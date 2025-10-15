'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code2, Upload, BarChart3, History, CheckCircle, ArrowRight, Star } from 'lucide-react';

export default function Homepage() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Upload,
      title: "Upload & Analyze",
      description: "Upload your code files and get instant feedback on readability, bugs, and best practices."
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "Get comprehensive scores for readability, modularity, and maintainability with actionable suggestions."
    },
    {
      icon: History,
      title: "Review History",
      description: "Track your code improvement over time with a complete history of all your reviews."
    }
  ];

  const languages = [
    "Python", "JavaScript", "TypeScript", "Java", "Go", "C++", "C#", "PHP", "Ruby", "Swift"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-blue-600 rounded-lg p-2">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Refyn</h1>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/auth')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Code Review Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your code and get instant feedback on readability, bugs, and best practices. 
            Improve your code quality with AI-powered analysis.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Refyn?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get comprehensive code analysis with actionable feedback to improve your development workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Supports All Major Languages
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {languages.map((language, index) => (
              <span
                key={index}
                className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-300 transition-colors"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in minutes with our simple 3-step process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Upload Your Code
              </h3>
              <p className="text-gray-600">
                Drag and drop your code files or browse to select them.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI Analysis
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your code for bugs, readability, and best practices.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Get Feedback
              </h3>
              <p className="text-gray-600">
                Receive detailed reports with actionable suggestions for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Refyn</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Refyn. Open source project.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
