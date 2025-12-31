"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import { ArrowLeft, Calendar, Clock, Sparkles } from 'lucide-react';
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';
import { useTripDetail } from '@/app/provider';
import type { TripInfo, Hotel, Itinerary as ItineraryType, Activity } from './ChatBox';

function Itinerary() {
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
    const [tripData, setTripData] = useState<TripInfo | null>(null);

    useEffect(() => {
        tripDetailInfo && setTripData(tripDetailInfo);
    }, [tripDetailInfo]);

    const data = tripData
        ? tripData.itinerary.map((dayData: ItineraryType) => ({
            title: `Day ${dayData.day}`,
            content: (
                <div className="space-y-6">
                    {/* Day Plan Header */}
                    {dayData.day_plan && (
                        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-xl p-4 border border-primary/20">
                            <p className="text-gray-700 dark:text-gray-200 font-medium">
                                {dayData.day_plan}
                            </p>
                        </div>
                    )}

                    {/* Best Time Badge */}
                    {dayData.best_time_to_visit_day && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Clock className="h-4 w-4" />
                            <span>Best Time: {dayData.best_time_to_visit_day}</span>
                        </div>
                    )}

                    {/* Daily Quick Info: Food, Transport, Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        {/* Food */}
                        {dayData.must_try_food && dayData.must_try_food.length > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-800/30">
                                <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <span>🍽️</span> Must Try
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                                    {dayData.must_try_food.map((food, i) => (
                                        <li key={i} className="line-clamp-1">{food}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {/* Transport */}
                        {dayData.local_transport && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <span>🚗</span> Transport
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                    {dayData.local_transport}
                                </p>
                            </div>
                        )}
                        {/* Tips */}
                        {dayData.travel_tips && dayData.travel_tips.length > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
                                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <span>💡</span> Tips
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                                    {dayData.travel_tips.map((tip, i) => (
                                        <li key={i} className="line-clamp-1">{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Activities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dayData.activities.map((activity: Activity, index: number) => (
                            <PlaceCardItem key={index} activity={activity} />
                        ))}
                    </div>

                    {/* Daily Suggested Hotels */}
                    {dayData.suggested_hotels && dayData.suggested_hotels.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 p-1 rounded-md">🛏️</span> Recommended Stays Nearby
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {dayData.suggested_hotels.map((hotel: Hotel, index: number) => (
                                    <div key={index} className="w-full h-full">
                                        <HotelCardItem hotel={hotel} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ),
        }))
        : [];

    return (
        <div className="relative w-full h-full overflow-auto">
            {tripData ? (
                <div className="px-4 py-6">
                    <Timeline data={data} tripData={tripData} />
                </div>
            ) : (
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="mb-6 p-6 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full inline-block">
                            <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Your Trip is Being Planned
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Tell our AI about your dream destination and preferences.
                            Your personalized itinerary will appear here.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Itinerary;
