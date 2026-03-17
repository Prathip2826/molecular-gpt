import axios from 'axios';
import { auth } from './firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Firebase token to every request
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Molecule APIs ─────────────────────────────────────────
export const moleculeApi = {
  getAll: (userId: string) => apiClient.get(`/molecules?user_id=${userId}`),
  getById: (id: string) => apiClient.get(`/molecules/${id}`),
  create: (data: unknown) => apiClient.post('/molecules', data),
  update: (id: string, data: unknown) => apiClient.put(`/molecules/${id}`, data),
  delete: (id: string) => apiClient.delete(`/molecules/${id}`),
  search: (query: string) => apiClient.get(`/molecules/search?q=${query}`),
};

// ─── Chat APIs ─────────────────────────────────────────────
export const chatApi = {
  getSessions: (userId: string) => apiClient.get(`/chat/sessions?user_id=${userId}`),
  getMessages: (sessionId: string) => apiClient.get(`/chat/${sessionId}/messages`),
  sendMessage: (sessionId: string, message: string) =>
    apiClient.post(`/chat/${sessionId}/message`, { message }),
  newSession: (userId: string) => apiClient.post('/chat/session', { user_id: userId }),
  deleteSession: (sessionId: string) => apiClient.delete(`/chat/session/${sessionId}`),
};

// ─── Experiment APIs ───────────────────────────────────────
export const experimentApi = {
  run: (type: string, inputs: unknown) => apiClient.post('/experiments/run', { type, inputs }),
  getAll: (userId: string) => apiClient.get(`/experiments?user_id=${userId}`),
  getById: (id: string) => apiClient.get(`/experiments/${id}`),
};

// ─── HuggingFace Direct API ────────────────────────────────
const HF_API_BASE = 'https://api-inference.huggingface.co/models';
const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

export const hfApi = {
  // Chemistry text generation - using Llama or Mistral (free tier)
  generateText: async (prompt: string) => {
    const response = await fetch(
      `${HF_API_BASE}/mistralai/Mistral-7B-Instruct-v0.3`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<s>[INST] You are a helpful chemistry AI assistant specialized in molecular science, drug discovery, and chemical reactions. Answer clearly and scientifically.\n\n${prompt} [/INST]`,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1,
          },
        }),
      }
    );
    return response.json();
  },

  // Molecule property prediction
  predictProperties: async (smiles: string) => {
    const response = await fetch(
      `${HF_API_BASE}/seyonec/ChemBERTa-zinc-base-v1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: smiles }),
      }
    );
    return response.json();
  },
};

// ─── PubChem API (completely free) ────────────────────────
export const pubchemApi = {
  searchByName: async (name: string) => {
    const res = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,IUPACName,IsomericSMILES/JSON`
    );
    return res.json();
  },

  getBySMILES: async (smiles: string) => {
    const res = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
    );
    return res.json();
  },

  getSDF: async (cid: number) => {
    const res = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`
    );
    return res.text();
  },

  getImage: (cid: number) =>
    `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`,
};

// ─── Research APIs ─────────────────────────────────────────
export const researchApi = {
  getAll: (userId: string) => apiClient.get(`/research?user_id=${userId}`),
  create: (data: unknown) => apiClient.post('/research', data),
  delete: (id: string) => apiClient.delete(`/research/${id}`),
};

export default apiClient;
