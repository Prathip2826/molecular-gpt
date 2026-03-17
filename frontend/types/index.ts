// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  researchInterests: string[];
  createdAt: string;
  stats: UserStats;
}

export interface UserStats {
  moleculesAnalyzed: number;
  chatsCount: number;
  experimentsRun: number;
  savedMolecules: number;
}

// Molecule Types
export interface Molecule {
  id: string;
  userId: string;
  name: string;
  formula: string;
  smiles: string;
  molFile?: string;
  pdbFile?: string;
  description?: string;
  properties: MoleculeProperties;
  tags: string[];
  createdAt: string;
  thumbnail?: string;
}

export interface MoleculeProperties {
  molecularWeight: number;
  logP?: number;
  hbondDonors?: number;
  hbondAcceptors?: number;
  rotBonds?: number;
  tpsa?: number;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  molecules?: Molecule[];
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Experiment Types
export type ExperimentType = 
  | 'reaction_prediction'
  | 'drug_interaction'
  | 'binding_affinity'
  | 'similarity_search'
  | 'toxicity_prediction'
  | 'structure_optimization';

export interface Experiment {
  id: string;
  userId: string;
  type: ExperimentType;
  title: string;
  inputs: Record<string, string>;
  results?: ExperimentResult;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
}

export interface ExperimentResult {
  prediction: string;
  confidence: number;
  visualization?: string;
  details: Record<string, unknown>;
}

// Research Types
export interface ResearchItem {
  id: string;
  userId: string;
  type: 'paper' | 'note' | 'molecule_set';
  title: string;
  content: string;
  tags: string[];
  molecules?: Molecule[];
  createdAt: string;
}

// HuggingFace API Types
export interface HFInferenceRequest {
  inputs: string;
  parameters?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    repetition_penalty?: number;
  };
}

export interface HFInferenceResponse {
  generated_text: string;
}

// PubChem Types
export interface PubChemCompound {
  CID: number;
  MolecularFormula: string;
  MolecularWeight: string;
  CanonicalSMILES: string;
  IUPACName: string;
  IsomericSMILES: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
