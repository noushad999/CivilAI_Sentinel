export interface StructuralAnalysis {
  risk_score: number;
  primary_defect: string;
  severity: 'Low' | 'Medium' | 'High';
  reasoning_chain: string;
  recommendation: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: StructuralAnalysis | null;
  error: string | null;
}
