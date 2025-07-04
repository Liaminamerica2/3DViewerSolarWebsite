// src/components/GenerationLogViewer.tsx

import type { GenerationResult, Judgement } from "./APIcontext.tsx";

interface Props {
  result: GenerationResult;
}

const JudgeFeedbackCard = ({ judgement }: { judgement: Judgement }) => {
  const isAcceptable = judgement.verdict === "Acceptable";
  const borderColor = isAcceptable ? "border-green-500" : "border-red-500";
  const textColor = isAcceptable ? "text-green-700" : "text-red-700";

  return (
    <div className={`p-4 border-l-4 ${borderColor} bg-gray-50 rounded-r-lg`}>
      <h4 className="font-bold text-gray-800">{judgement.judge} Judge</h4>
      <p className={`font-semibold ${textColor}`}>{judgement.verdict}</p>
      <p className="mt-2 text-sm text-gray-600 italic">"{judgement.critique}"</p>
    </div>
  );
};

export const GenerationLogViewer = ({ result }: Props) => {
  return (
    <div className="mt-8 space-y-8">
      {/* Final Story at the top for easy access */}
      <div className="p-6 bg-white border border-blue-300 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Final Story</h3>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {result.final_story}
        </p>
      </div>

      {/* Detailed Generation Process */}
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Generation Process</h3>
        {result.generation_log.map((round) => (
          <div key={round.round} className="mb-8 last:mb-0 border-t border-gray-300 pt-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Round {round.round}: {round.is_accepted ? "Final Approved Version" : "Review & Refinement"}
            </h4>
            
            {/* Story Draft */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-700 mb-2">Story Draft:</h5>
              <div className="p-4 bg-white border rounded-md text-gray-600 whitespace-pre-wrap">
                {round.story_draft}
              </div>
            </div>

            {/* Judge Feedback */}
            {round.judgements.length > 0 && (
                <div className="mb-4">
                    <h5 className="font-semibold text-gray-700 mb-2">Panel of Judges' Feedback:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {round.judgements.map(j => <JudgeFeedbackCard key={j.judge} judgement={j} />)}
                    </div>
                </div>
            )}

            {/* Refiner Instructions */}
            {round.aggregated_critique_for_refiner && (
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">Instructions for Next Draft:</h5>
                <div className="p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md whitespace-pre-wrap">
                  {round.aggregated_critique_for_refiner}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};