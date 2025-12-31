
"use client"
import React, { useEffect, useState, Suspense } from 'react'

export const dynamic = 'force-dynamic';

import ChatBox from './_components/ChatBox'
import Itinerary from './_components/Itinerary'
import { useTripDetail } from '../provider';
import { Button } from '@/components/ui/button';
import { Globe2, Plane, Map, MessageSquare, Sparkles } from 'lucide-react';
import dynamicImport from 'next/dynamic';

const GlobalMap = dynamicImport(() => import('./_components/GlobalMap'), { ssr: false });
import {
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip"

function CreateNewTrip() {
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    setTripDetailInfo(null);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col">
      {/* Compact Header Section */}
      <div className="px-6 py-3 border-b border-white/20 dark:border-gray-800 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl flex-shrink-0 z-20 shadow-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-primary to-purple-600 rounded-xl shadow-lg shadow-primary/20 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                Plan Your <span className="text-primary">Dream Trip</span>
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block font-medium tracking-wide">AI-POWERED ADVENTURE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar">
        <div className="max-w-[1800px] mx-auto space-y-8">

          {/* Top Section: Chat & Map Side-by-Side */}
          <div className="flex flex-col lg:flex-row gap-6 h-[700px] lg:h-[600px]">
            {/* Left: Chat */}
            <div className="flex-1 min-w-0 h-full flex flex-col bg-white/80 dark:bg-gray-800/90 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/50 dark:border-gray-700 overflow-hidden ring-1 ring-black/5 relative group transition-all hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
              <div className="px-6 py-4 bg-gradient-to-r from-white/50 to-transparent dark:from-white/5 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 tracking-tight uppercase">AI Trip Assistant</h2>
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><Sparkles className="animate-spin text-primary" /></div>}>
                  <ChatBox />
                </Suspense>
              </div>
            </div>

            {/* Right: Map */}
            <div className="flex-1 min-w-0 h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/50 dark:border-gray-700 overflow-hidden relative group transition-all hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
              <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-gradient-to-r from-blue-500 to-primary/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 text-xs font-bold text-white flex items-center gap-2 pointer-events-none transform transition-transform group-hover:scale-105">
                <div className="p-1 bg-white/20 rounded-lg text-white">
                  <Map className="h-3.5 w-3.5" />
                </div>
                Interactive Map
              </div>
              <div className="h-full w-full grayscale-[10%] group-hover:grayscale-0 transition-all duration-700">
                <GlobalMap />
              </div>
            </div>
          </div>

          {/* Bottom Section: Itinerary Results */}
          <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 dark:border-gray-700 overflow-hidden min-h-[400px]">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/80 via-white/50 to-transparent dark:from-gray-900/80 flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg shadow-primary/30 text-white">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Your Journey</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Curated itinerary based on your preferences</p>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <Itinerary />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreateNewTrip

