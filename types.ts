
export enum AppTab {
  DASHBOARD = 'dashboard',
  CONTENT = 'content',
  DESIGN = 'design',
  INTERVIEW = 'interview',
  SHOWCASE = 'showcase'
}

export enum InterviewCategory {
  ENGINEERING = 'Engineering',
  MEDICAL = 'Medical',
  ARTS = 'Arts'
}

export interface InterviewMetric {
  name: string;
  score: number;
  feedback: string;
}

export interface InterviewAnalysis {
  overallScore: number;
  metrics: InterviewMetric[];
  fillerWords: string[];
  strengths: string[];
  improvements: string[];
  answerSuggestions: { question: string; suggestion: string }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'content' | 'design';
  data: string;
  tags: string[];
  link?: string;
  createdAt: number;
}
