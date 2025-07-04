// src/components/APIcontext.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';
import axios from 'axios';

// --- TYPE DEFINITIONS ---

// For the Default Story Generator
export interface Judgement {
  judge: string;
  verdict: 'Acceptable' | 'Unacceptable';
  critique: string;
}
export interface GenerationRound {
  round: number;
  story_draft: string;
  judgements: Judgement[];
  aggregated_critique_for_refiner: string | null;
  is_accepted: boolean;
}
export interface GenerationResult {
  final_story: string;
  generation_log: GenerationRound[];
  summary: {
    initial_prompt: string;
    total_refinements: number;
    final_status: string;
  };
}

export interface Choice {
    id: number;
    text: string;
    trait: string | null;
}

export interface FinalAnalysis {
  summary: string;
  lessons_learned: string;
}
export interface InteractiveStoryState {
  session_id: string | null;
  story_history: string[];
  decision_prompt: string | null;
  choices: Choice[];
  is_final: boolean;
  final_analysis: FinalAnalysis | null;
}


// Combined Context Type
interface ApiContextType {
  // Default Story State & Handlers
  prompt: string;
  setPrompt: (prompt: string) => void;
  result: GenerationResult | null;
  isLoading: boolean;
  error: string;
  handleGenerateStory: () => Promise<void>;

  // --- NEW: Interactive Story State & Handlers ---
  interactiveState: InteractiveStoryState;
  isInteractiveLoading: boolean;
  interactiveError: string;
  startInteractiveStory: (prompt: string) => Promise<void>;
  continueInteractiveStory: (choiceId: number) => Promise<void>;
  resetInteractiveStory: () => void;
  endInteractiveStory: () => Promise<void>; 

}

// --- INITIAL STATE ---
const initialInteractiveState: InteractiveStoryState = {
  session_id: null,
  story_history: [],
  decision_prompt: null,
  choices: [],
  is_final: false,
  final_analysis: null,
};

// --- CONTEXT CREATION ---
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const ApiProvider = ({ children }: { children: ReactNode }) => {
  // State for Default Story Generator
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // --- NEW: State for Interactive Story ---
  const [interactiveState, setInteractiveState] = useState<InteractiveStoryState>(initialInteractiveState);
  const [isInteractiveLoading, setIsInteractiveLoading] = useState<boolean>(false);
  const [interactiveError, setInteractiveError] = useState<string>('');

  // Handler for Default Story
  const handleGenerateStory = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post<GenerationResult>(
        'http://localhost:8000/api/generate_default_story',
        { prompt }
      );
      setResult(response.data);
    } catch (e: any) {
      console.error('Failed to generate story:', e);
      setError(axios.isAxiosError(e) && e.response ? e.response.data.error : e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Handlers for Interactive Story ---

  const startInteractiveStory = async (startPrompt: string) => {
    // This function is unchanged
    if (!startPrompt) {
        setInteractiveError('Please enter a topic to start the story.');
        return;
    }
    setIsInteractiveLoading(true);
    setInteractiveError('');
    setInteractiveState(initialInteractiveState);
    try {
        const response = await axios.post('http://localhost:8000/api/interactive_story/start', { prompt: startPrompt });
        const data = response.data;
        setInteractiveState({
            session_id: data.session_id,
            story_history: [data.story_segment],
            decision_prompt: data.decision_prompt,
            choices: data.choices,
            is_final: data.is_final,
            final_analysis: null,
        });
    } catch (e: any) {
        console.error('Failed to start interactive story:', e);
        setInteractiveError(axios.isAxiosError(e) && e.response ? e.response.data.error : e.message);
    } finally {
        setIsInteractiveLoading(false);
    }
  };

  const continueInteractiveStory = async (choiceId: number) => {
    // This function is now simpler as it doesn't handle the final state
    if (!interactiveState.session_id) return;
    setIsInteractiveLoading(true);
    setInteractiveError('');
    try {
        const response = await axios.post('http://localhost:8000/api/interactive_story/continue', {
            session_id: interactiveState.session_id,
            choice_id: choiceId
        });
        const data = response.data;
        setInteractiveState(prevState => ({
            ...prevState,
            story_history: [...prevState.story_history, data.story_segment],
            decision_prompt: data.decision_prompt,
            choices: data.choices,
            // is_final and final_analysis are NOT updated here anymore
        }));
    } catch (e: any) {
        console.error('Failed to continue interactive story:', e);
        setInteractiveError(axios.isAxiosError(e) && e.response ? e.response.data.error : e.message);
    } finally {
        setIsInteractiveLoading(false);
    }
  };

  // --- NEW FUNCTION ---
  const endInteractiveStory = async () => {
    if (!interactiveState.session_id) {
        setInteractiveError('No active story session found to end.');
        return;
    }
    setIsInteractiveLoading(true);
    setInteractiveError('');
    try {
        const response = await axios.post('http://localhost:8000/api/interactive_story/end', {
            session_id: interactiveState.session_id,
        });
        const data = response.data;
        // Merge the final state into the current state
        setInteractiveState(prevState => ({
            ...prevState,
            is_final: data.is_final,
            final_analysis: data.final_analysis || null,
            choices: [], // Clear out the old choices
            decision_prompt: null,
        }));
    } catch (e: any) {
        console.error('Failed to end interactive story:', e);
        setInteractiveError(axios.isAxiosError(e) && e.response ? e.response.data.error : e.message);
    } finally {
        setIsInteractiveLoading(false);
    }
  };
  
  const resetInteractiveStory = () => {
    setInteractiveState(initialInteractiveState);
    setInteractiveError('');
    setIsInteractiveLoading(false);
  }

  const value = {
    prompt,
    setPrompt,
    result,
    isLoading,
    error,
    handleGenerateStory,
    // New values for interactive mode
    interactiveState,
    isInteractiveLoading,
    interactiveError,
    startInteractiveStory,
    continueInteractiveStory,
    resetInteractiveStory,
    endInteractiveStory
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

// Custom hook
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};