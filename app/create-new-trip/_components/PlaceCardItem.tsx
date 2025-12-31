"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ticket, Clock, ExternalLink, MapPin, Timer } from "lucide-react";
import { useTripDetail } from "@/app/provider";

type Props = {
    activity: {
        place_name: string;
        place_address: string;
        place_details: string;
        ticket_pricing: string;
        best_time_to_visit: string;
        time_travel_each_location?: string;
        geo_coordinates?: {
            latitude: number;
            longitude: number;
        };
        famous_features?: string[];
    };
};

export default function PlaceCardItem({ activity }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>();
    const [loading, setLoading] = useState(true);
    // @ts-ignore
    const { setSelectedLocation } = useTripDetail();

    useEffect(() => {
        if (activity) {
            fetchPhoto();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity]);

    async function fetchPhoto() {
        setLoading(true);
        try {
            const response = await axios.post("/api/google-place-detail", {
                placeName: `${activity.place_name}:${activity.place_address}`,
            });

            if (response.data.error) {
                console.warn("API error:", response.data.error);
                setPhotoUrl("https://placehold.co/400x300/e2e8f0/64748b?text=Place");
                return;
            }

            if (response.data.imageUrl) {
                setPhotoUrl(response.data.imageUrl);
            } else {
                setPhotoUrl("https://placehold.co/400x300/e2e8f0/64748b?text=Place");
            }
        } catch (error) {
            console.error("Failed to fetch photo:", error);
            setPhotoUrl("https://placehold.co/400x300/e2e8f0/64748b?text=Place");
        } finally {
            setLoading(false);
        }
    }

    const handleMapClick = () => {
        if (activity.geo_coordinates) {
            setSelectedLocation({
                lat: activity.geo_coordinates.latitude,
                lng: activity.geo_coordinates.longitude
            });
        }
    };

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col h-full cursor-pointer"
            onClick={handleMapClick}
        >
            {/* Image Container - Compact */}
            <div className="relative w-full h-[140px] overflow-hidden">
                {loading ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : (
                    <Image
                        src={photoUrl ?? "https://placehold.co/400x300/e2e8f0/64748b?text=Place"}
                        alt={activity.place_name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=Place";
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                {/* Best Time Badge */}
                {activity.best_time_to_visit && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                        <Clock className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-bold text-gray-800 dark:text-gray-100">{activity.best_time_to_visit}</span>
                    </div>
                )}
            </div>

            {/* Content - Compact */}
            <div className="p-3 flex flex-col flex-1 gap-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base text-gray-800 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {activity.place_name}
                    </h3>
                    {activity.time_travel_each_location && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                            <Timer className="h-3 w-3" />
                            <span>{activity.time_travel_each_location}</span>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-500/90 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {activity.place_details}
                </p>

                {/* Famous Features - Compact Tags */}
                {activity.famous_features && activity.famous_features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {activity.famous_features.slice(0, 2).map((feature, i) => (
                            <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                {feature}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between gap-2">
                    {/* Price */}
                    {activity.ticket_pricing ? (
                        <div className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                            <Ticket className="h-3.5 w-3.5" />
                            <span>{activity.ticket_pricing}</span>
                        </div>
                    ) : (
                        <div />
                    )}

                    <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.place_name)}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            Map
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

