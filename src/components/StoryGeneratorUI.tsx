// src/components/StoryGeneratorUI.tsx

import { useApi } from './APIcontext';
import { GenerationLogViewer } from './GenerationLogViewer';

// Note the "export default" which is required for React.lazy()
export default function StoryGeneratorUI() {
  const { prompt, setPrompt, result, isLoading, error, handleGenerateStory } = useApi();
  
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Story Generator</h2>
        <p className="text-gray-300 mb-6">
          Enter a prompt below and our AI will generate a short story for you.
        </p>
        <div className="flex flex-col gap-4">
          <textarea
            className="p-3 border border-gray-500 bg-gray-800 text-white rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
            rows={4}
            placeholder="e.g., A robot who discovers music"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateStory}
            className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Story'}
          </button>
        </div>
        <div className="mt-8">
          {error && (
            <div className="p-4 bg-red-200 border border-red-500 text-red-800 rounded-md">
              <strong>Error:</strong> {error}
            </div>
          )}
          {result && !error && <GenerationLogViewer result={result} />}
        </div>
      </div>
    </div>
  );
}
