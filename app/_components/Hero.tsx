"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Globe2, Plane, Landmark, Sparkles, MapPin, Clock, Shield, Users, Star, Zap, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

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

// Animated counter component
const AnimatedStat = ({ endValue, label, suffix = "" }: { endValue: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = endValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [endValue]);

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
};

function Hero() {
  const { user } = useUser();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const onSend = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (inputValue && inputValue.trim()) {
      router.push(`/create-new-trip?q=${encodeURIComponent(inputValue)}`);
    } else {
      router.push('/create-new-trip');
    }
  };

  const handleSuggestionClick = (mode: string) => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (mode === "create") {
      router.push('/create-new-trip?mode=create');
    } else {
      router.push(`/create-new-trip?mode=${mode}`);
    }
  };

  const features = [
    { icon: <Zap className="h-5 w-5" />, title: "AI-Powered", desc: "Smart itineraries in seconds" },
    { icon: <MapPin className="h-5 w-5" />, title: "Personalized", desc: "Tailored to your preferences" },
    { icon: <Clock className="h-5 w-5" />, title: "Save Time", desc: "No more hours of research" },
    { icon: <Shield className="h-5 w-5" />, title: "Trusted", desc: "Verified recommendations" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-50/50 dark:from-primary/10 dark:to-transparent -z-10" />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="pt-16 pb-12 px-4 flex justify-center">
        <div className="max-w-4xl w-full text-center space-y-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            Powered by Advanced AI Technology
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-6xl font-bold leading-tight">
              Your Personal{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-500 to-primary">
                AI Trip Planner
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Tell me your dream destination, and I'll create a personalized itinerary with hotels,
              activities, and local experiences — all in seconds.
            </p>
          </motion.div>

          {/* Input Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <Textarea
                placeholder="Where do you want to go? Try: 'Plan a 5-day trip to Paris for a family of 4 with a moderate budget'"
                className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-base"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
              />
              <Button
                size={'icon'}
                className="absolute bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-transform"
                onClick={() => onSend()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Suggestion Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(100, 100, 255, 0.4)",
                  borderColor: "rgba(100, 100, 255, 0.8)"
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm cursor-default"
              >
                {suggestion.icon}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{suggestion.title}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>



        </div>
      </div>
    </div>
  );
}

export default Hero;



