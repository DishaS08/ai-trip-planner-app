"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Globe2, ArrowDown, Plane, Landmark } from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import React from "react";


export const suggestions = [
  {
    title: "Create New Trip",
    icon: <Globe2 className="text-blue-400 h-5 w-5" />,
    mode: "create"
  },
  {
    title: "Inspire me where to go",
    icon: <Plane className="text-green-500 h-5 w-5" />,
    mode: "inspire"
  },
  {
    title: "Discover Hidden gems",
    icon: <Landmark className="text-orange-500 h-5 w-5" />,
    mode: "hidden-gems"
  },
  {
    title: "Adventure Destination",
    icon: <Globe2 className="text-yellow-600 h-5 w-5" />,
    mode: "adventure"
  },
];


function Hero() {
  const {user} = useUser();
  const router = useRouter();

  const onSend = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    //Navigate to Create Trip Planner Web Page
    router.push('/create-new-trip');
  };

  // Handler for suggestion buttons
  const handleSuggestionClick = (mode: string) => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    // Adjust route or query as needed for each suggestion
    if (mode === "create") {
      router.push('/create-new-trip');
    } else {
      router.push(`/create-new-trip?mode=${mode}`);
    }
  };

  return (
    <div className="mt-24 flex justify-center">
      {/* Content */}
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-xl md:text-5xl font-bold">
          Hey, I'm your personal <span className="text-primary"> Trip Planner</span>
        </h1>
        <p className="text-lg">
          Tell me what you want, and I'll handle the rest: Flights, Hotels, trip Planner - all in seconds
        </p>

        {/* Input Box */}
        <div>
          <div className="border rounded-2xl p-4 relative">
            <Textarea
              placeholder="Create a trip for India from New york"
              className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-no"
            />
            <Button size={'icon'} className="absolute bottom-6 right-6" onClick={() => onSend()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Suggestion list */}

        <div className="flex gap-5">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleSuggestionClick(suggestion.mode)}
            >
              {suggestion.icon}
              <h2 className="text-sm">{suggestion.title}</h2>
            </div>
          ))}
        </div>
        <div className="flex item-center justify-center flex-col">
          <h2 className="my-7 mt-14 flex gap-2 text-center">
            Not Sure where to strt? <strong>See how it works</strong>
            <ArrowDown />
          </h2>
          {/* Video Section */}
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="/Video.mp4"
            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
            thumbnailAlt="Project Demo Video Thumbnail"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;


