"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface FinalUiProps {
  tripId: string | null;
  isReady: boolean;
}

export default function FinalUi({ tripId, isReady }: FinalUiProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(true);

  // Update state when isReady changes
  useEffect(() => {
    if (isReady && tripId) {
      setIsGenerating(false);
    }
  }, [isReady, tripId]);

  const handleViewTrip = () => {
    if (tripId) {
      router.push(`/view-trip/${tripId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-[350px] text-center">
      <h2 className="text-gray-700 font-semibold text-lg mb-2">
        {isGenerating ? "Generating your trip plan..." : "Your trip plan is ready!"}
      </h2>

      <p className="text-green-700 font-bold text-xl mb-2">
        ✈️ {isGenerating ? "Planning your dream trip..." : "Dream trip generated!"}
      </p>

      <p className="text-gray-500 mb-4">
        {isGenerating
          ? "Gathering best destinations, activities, travel details for you."
          : "Click below to view your complete travel plan."}
      </p>

      <button
        className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${isGenerating ? "bg-green-500 opacity-60 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        disabled={isGenerating}
        onClick={handleViewTrip}
      >
        View Trip
      </button>

      {/* Progress bar only visible while generating */}
      {isGenerating && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
      )}
    </div>
  );
}
