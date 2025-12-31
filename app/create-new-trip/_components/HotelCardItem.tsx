"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Hotel } from "./ChatBox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, Star, MapPin, ExternalLink } from "lucide-react";

type Props = {
    hotel: Hotel;
};

export default function HotelCardItem({ hotel }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hotel) {
            fetchPhoto();
        }
    }, [hotel]);

    async function fetchPhoto() {
        setLoading(true);
        try {
            const response = await axios.post("/api/google-place-detail", {
                placeName: `${hotel?.hotel_name} luxury hotel`,
            });

            if (response.data.error) {
                console.warn("API error:", response.data.error);
                setPhotoUrl("https://placehold.co/400x300/e2e8f0/64748b?text=Hotel");
                return;
            }

            if (response.data.imageUrl) {
                setPhotoUrl(response.data.imageUrl);
            } else {
                setPhotoUrl("https://placehold.co/400x300/e2e8f0/64748b?text=Hotel");
            }
        } catch (error) {
            console.error("Failed to fetch photo:", error);
            setPhotoUrl("https://placehold.co/400x300/e2e8f0/64748b?text=Hotel");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            {/* Image Container - Compact */}
            <div className="relative w-full h-[140px] overflow-hidden">
                {loading ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : (
                    <Image
                        src={photoUrl ?? "https://placehold.co/400x300/e2e8f0/64748b?text=Hotel"}
                        alt={hotel?.hotel_name || "Hotel Image"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=Hotel";
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                {/* Rating Badge */}
                {hotel?.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-gray-800 dark:text-gray-100">{hotel.rating}</span>
                    </div>
                )}
            </div>

            {/* Card Content - Compact */}
            <div className="p-3 flex flex-col flex-1 gap-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base text-gray-800 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {hotel?.hotel_name}
                    </h3>
                    {hotel?.price_per_night && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                            <Wallet className="h-3 w-3" />
                            <span>{hotel.price_per_night}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-start gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5 text-primary" />
                    <span className="line-clamp-1">{hotel?.hotel_address}</span>
                </div>

                {hotel?.description && (
                    <p className="text-xs text-gray-500/90 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {hotel.description}
                    </p>
                )}

                <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700/50">
                    <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel?.hotel_name} ${hotel?.hotel_address}`)}`}
                        target="_blank"
                        className="block"
                    >
                        <Button size="sm" variant="ghost" className="w-full h-7 text-xs hover:bg-primary/10 hover:text-primary gap-1">
                            <ExternalLink className="h-3.5 w-3.5" />
                            View on Map
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
