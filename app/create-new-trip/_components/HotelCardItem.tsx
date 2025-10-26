"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Hotel } from "./ChatBox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, Star } from "lucide-react";

type Props = {
    hotel: Hotel;
};

export default function HotelCardItem({ hotel }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        if (hotel) {
            fetchPhoto();
        }
    }, [hotel]);

    async function fetchPhoto() {
        try {
            const response = await axios.post("/api/google-place-detail", {
                placeName: hotel?.hotel_name,
            });

            if (response.data.error) {
                console.warn("API error:", response.data.error);
                setPhotoUrl("/placeholder.jpg");
                return;
            }

            if (!response.data.photos || response.data.photos.length === 0) {
                setPhotoUrl("/placeholder.jpg");
                return;
            }

            setPhotoUrl(response.data.photos[0].urls.small);
        } catch (error) {
            console.error("Failed to fetch photo:", error);
            setPhotoUrl("/placeholder.jpg");
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="relative w-full h-[250px]">
                <Image
                    src={photoUrl ?? "/placeholder.jpg"}
                    alt={hotel?.hotel_name || "Hotel Image"}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <h2 className="font-semibold text-lg">{hotel?.hotel_name}</h2>
            <h2 className="text-gray-500">{hotel?.hotel_address}</h2>
            <div className="flex justify-between items-center">
                <p className="flex gap-2 text-green-600">
                    <Wallet />
                    {hotel.price_per_night}
                </p>
                <p className="text-yellow-500 flex gap-2">
                    <Star />
                    {hotel.rating}
                </p>
            </div>
            <Link
                href={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotel_name}`}
                target="_blank"
            >
                <Button variant="outline" className="mt-1 w-full">
                    View
                </Button>
            </Link>
        </div>
    );
}



