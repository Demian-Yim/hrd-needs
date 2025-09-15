
export interface SurveyField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'select';
  placeholder?: string;
  options?: string[];
}

export interface SurveyStepConfig {
  id: string;
  title: string;
  description: string;
  fields: SurveyField[];
}

export type SurveyData = {
  [stepId: string]: {
    [fieldId: string]: string;
  };
};

export interface AddieAnalysis {
  analysis: string;
  design: string;
  development: string;
  implementation: string;
  evaluation: string;
}

export interface TrainingModule {
  title: string;
  objective: string;
  content: string[];
  method: string;
}

export interface DiagnosisResult {
  diagnosisSummary: string;
  addieAnalysis: AddieAnalysis;
  trainingProposal: {
    title: string;
    targetAudience: string;
    duration: string;
    modules: TrainingModule[];
  };
}
