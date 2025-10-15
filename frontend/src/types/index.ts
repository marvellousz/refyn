export enum SeverityLevel {
  CRITICAL = 'critical',
  WARNING = 'warning',
  SUGGESTION = 'suggestion',
  INFO = 'info',
}

export interface CodeIssue {
  line?: number | null;
  severity: SeverityLevel;
  category: string;
  description: string;
  suggestion?: string | null;
}

export interface ReviewAnalysis {
  readability_score: number;
  modularity_score: number;
  maintainability_score: number;
  overall_summary: string;
  strengths: string[];
  issues: CodeIssue[];
  suggestions: string[];
  potential_bugs: string[];
  security_concerns: string[];
}

export interface Review {
  id: string;
  filename: string;
  language: string;
  analysis: ReviewAnalysis;
  created_at: string;
}

export interface StatsResponse {
  total_reviews: number;
  languages: { [key: string]: number };
  avg_readability: number;
  avg_modularity: number;
  avg_maintainability: number;
  recent_reviews: Review[];
}

