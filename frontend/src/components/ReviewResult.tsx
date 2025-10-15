'use client';

import { Review } from '@/types';
import { getSeverityColor, getSeverityIcon, getScoreColor, getScoreLabel } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Shield, Bug, Lightbulb, TrendingUp } from 'lucide-react';

interface ReviewResultProps {
  review: Review;
}

export default function ReviewResult({ review }: ReviewResultProps) {
  const { analysis } = review;

  const ScoreCard = ({ title, score, icon: Icon }: { title: string; score: number; icon: any }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}/10
        </span>
      </div>
      <p className="text-sm text-gray-500">{getScoreLabel(score)}</p>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Code Review Complete</h2>
            <p className="text-primary-100">{review.filename} • {review.language}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-sm">Overall Quality</p>
            <p className="text-2xl font-bold">
              {Math.round((analysis.readability_score + analysis.modularity_score + analysis.maintainability_score) / 3)}/10
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Summary
        </h3>
        <p className="text-blue-800">{analysis.overall_summary}</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreCard title="Readability" score={analysis.readability_score} icon={CheckCircle2} />
        <ScoreCard title="Modularity" score={analysis.modularity_score} icon={AlertCircle} />
        <ScoreCard title="Maintainability" score={analysis.maintainability_score} icon={TrendingUp} />
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-green-800">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Issues Found ({analysis.issues.length})
          </h3>
          <div className="space-y-3">
            {analysis.issues.map((issue, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span>{getSeverityIcon(issue.severity)}</span>
                    <span className="font-semibold capitalize">{issue.severity}</span>
                    <span className="text-xs uppercase px-2 py-1 bg-white/50 rounded">
                      {issue.category}
                    </span>
                  </div>
                  {issue.line && (
                    <span className="text-xs font-mono">Line {issue.line}</span>
                  )}
                </div>
                <p className="mb-2">{issue.description}</p>
                {issue.suggestion && (
                  <div className="bg-white/70 rounded p-2 mt-2">
                    <p className="text-sm font-semibold mb-1">💡 Suggestion:</p>
                    <p className="text-sm">{issue.suggestion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Actionable Suggestions
          </h3>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-600 mr-2">→</span>
                <span className="text-blue-800">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Potential Bugs */}
      {analysis.potential_bugs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-900 mb-3 flex items-center">
            <Bug className="w-5 h-5 mr-2" />
            Potential Bugs
          </h3>
          <ul className="space-y-2">
            {analysis.potential_bugs.map((bug, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-red-600 mr-2">⚠</span>
                <span className="text-red-800">{bug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Security Concerns */}
      {analysis.security_concerns.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Concerns
          </h3>
          <ul className="space-y-2">
            {analysis.security_concerns.map((concern, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-yellow-600 mr-2">🔒</span>
                <span className="text-yellow-800">{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

