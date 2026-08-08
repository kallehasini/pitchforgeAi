export type SourceType = 'readme' | 'pdf' | 'docx' | 'txt';
export type Audience = 'hackathon_judge' | 'angel_investor' | 'vc' | 'government';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface ExtractedAnalysis {
  projectName: string;
  tagline: string;
  problem: string;
  solution: string;
  targetUsers: string[];
  features: string[];
  techStack: string[];
  market: string;
  businessModel: string;
  revenueModel: string;
  competition: string;
  uniqueSellingPoint: string;
  futureScope: string;
  fundingAsk: string;
}

export interface HealthScores {
  innovation: number;
  market: number;
  business: number;
  scalability: number;
  presentation: number;
  investmentReadiness: number;
  overall: number;
  suggestions: string[];
}

export interface AudienceOptimization {
  audience: Audience;
  focus: string[];
  tone: string;
  slideOrder: string[];
  technicalDepth: string;
  businessFocus: string;
  language: string;
  investorPsychology: string;
}

export interface Slide {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  body?: string;
  highlight?: string;
}

export interface PresenterNote {
  slideId: string;
  text: string;
}

export interface ElevatorPitch {
  thirtySeconds: string;
  sixtySeconds: string;
  threeMinutes: string;
}

export interface InvestorQA {
  question: string;
  answer: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  source_type: SourceType;
  source_filename: string | null;
  raw_text: string | null;
  extracted_json: ExtractedAnalysis | null;
  health_scores: HealthScores | null;
  audience_optimizations: AudienceOptimization[] | null;
  created_at: string;
  updated_at: string;
}

export interface Deck {
  id: string;
  project_id: string;
  user_id: string;
  audience: Audience;
  slides: Slide[];
  presenter_notes: PresenterNote[];
  elevator_pitches: ElevatorPitch | null;
  investor_questions: InvestorQA[];
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  project_id: string | null;
  deck_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  x402_challenge: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface UserCredits {
  id: string;
  user_id: string;
  free_credits: number;
  is_premium: boolean;
  premium_activated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlockchainRecord {
  id: string;
  deck_id: string;
  user_id: string;
  deck_hash: string;
  verification_id: string;
  generation_id: string;
  tx_id: string | null;
  network: string;
  recorded_at: string;
  created_at: string;
}

export const AUDIENCE_LABELS: Record<Audience, string> = {
  hackathon_judge: 'Hackathon Judge',
  angel_investor: 'Angel Investor',
  vc: 'Venture Capitalist',
  government: 'Government Grant Committee',
};

export const AUDIENCE_DESCRIPTIONS: Record<Audience, string> = {
  hackathon_judge: 'Innovation, architecture, feasibility, demo, AI, blockchain',
  angel_investor: 'Founder, vision, early growth, story',
  vc: 'Market, revenue, growth, scalability',
  government: 'Impact, society, sustainability, employment',
};
