// src/components/InteractiveStoryUI.tsx

import { useState } from 'react';
import { useApi } from './APIcontext.tsx';
import { type Choice } from './APIcontext.tsx';

// TraitBadge component now receives a non-null string
const TraitBadge = ({ trait }: { trait: string }) => (
    <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-cyan-800 bg-cyan-200 rounded-full">
        {trait}
    </span>
);

// FIX: Changed from "export const InteractiveStoryUI" to "export default function InteractiveStoryUI"
export default function InteractiveStoryUI() {
    const { 
        interactiveState, 
        isInteractiveLoading, 
        interactiveError, 
        startInteractiveStory, 
        continueInteractiveStory,
        resetInteractiveStory,
        endInteractiveStory 
    } = useApi();
    const [prompt, setPrompt] = useState('');

    // --- RENDER LOGIC ---

    // 1. Initial State: No session started yet
    if (!interactiveState.session_id && !isInteractiveLoading) {
        return (
            <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">Interactive Storyteller</h2>
                <p className="text-gray-300 mb-6">
                    What should the story be about? The AI will guide you through an adventure where you make the choices!
                </p>
                <div className="flex flex-col gap-4">
                    <textarea
                        className="p-3 border border-gray-500 bg-gray-800 text-white rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                        rows={3}
                        placeholder="e.g., A little bear who is afraid of the dark"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                        onClick={() => startInteractiveStory(prompt)}
                        className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 transition-colors"
                        disabled={!prompt.trim()}
                    >
                        Start My Adventure
                    </button>
                    {interactiveError && (
                        <div className="p-4 bg-red-200 border border-red-500 text-red-800 rounded-md">
                            <strong>Error:</strong> {interactiveError}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    // 2. Loading State
    if (isInteractiveLoading && interactiveState.story_history.length === 0) {
        return (
            <div className="p-8 text-center text-gray-300">
                <p className="text-2xl animate-pulse">Your story is beginning...</p>
            </div>
        );
    }

    // 3. Main Story Display (In-progress or Final)
    return (
        <div className="p-8 text-gray-200 flex flex-col h-full">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">Your Adventure</h2>
            <div className="flex-grow overflow-y-auto pr-4 story-content">
                {/* Render the story history */}
                {interactiveState.story_history.map((segment, index) => (
                    <p key={index} className="mb-4 whitespace-pre-wrap leading-relaxed">
                        {segment}
                    </p>
                ))}

                {/* Loading spinner for continuation */}
                {isInteractiveLoading && (
                    <div className="text-center my-4">
                        <p className="text-cyan-400 animate-pulse">The storyteller is thinking...</p>
                    </div>
                )}
                
                {/* Final analysis section */}
                {interactiveState.is_final && interactiveState.final_analysis && (
                    <div className="mt-6 p-4 bg-gray-900 border border-cyan-500 rounded-lg">
                        <h3 className="text-2xl font-bold text-cyan-400 mb-3">Your Journey's End</h3>
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <h4 className="font-bold text-lg text-gray-100">Summary of Your Adventure</h4>
                            <p className="mt-2 text-gray-300">{interactiveState.final_analysis.summary}</p>
                        </div>
                         <div className="bg-gray-800 p-4 rounded-md">
                            <h4 className="font-bold text-lg text-gray-100">Lessons Along the Way</h4>
                            <p className="mt-2 text-gray-300">{interactiveState.final_analysis.lessons_learned}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-shrink-0 pt-6">
                {/* Render choices if the story is NOT final */}
                {!interactiveState.is_final && !isInteractiveLoading && (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-100 mb-3">{interactiveState.decision_prompt}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {interactiveState.choices.map((choice: Choice) => (
                                <button
                                    key={choice.id}
                                    onClick={() => continueInteractiveStory(choice.id)}
                                    className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                                >
                                    {choice.text}
                                    {/* Conditionally render the badge only if the trait is not null */}
                                    {choice.trait && <TraitBadge trait={choice.trait} />}
                                </button>
                            ))}
                        </div>
                        {interactiveState.story_history.length >= 3 && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={endInteractiveStory}
                                    className="text-gray-300 bg-transparent border border-amber-500 hover:bg-amber-500 hover:text-gray-900 font-semibold py-2 px-4 rounded-md transition-colors"
                                >
                                    End Story & See My Results
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Render error messages */}
                {interactiveError && (
                    <div className="mt-4 p-4 bg-red-200 border border-red-500 text-red-800 rounded-md">
                        <strong>Error:</strong> {interactiveError}
                    </div>
                )}

                {/* Button to start a new story after finishing */}
                {interactiveState.is_final && (
                    <div className="text-center mt-6">
                        <button
                            onClick={resetInteractiveStory}
                            className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-700 transition-colors"
                        >
                            Start a New Adventure
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
