import React, { useEffect, useState } from 'react';
import { Trip } from "../page";
import Image from 'next/image';
import { ArrowRight, Calendar, Wallet, Users } from 'lucide-react';
import Link from 'next/link';

type Props = {
    trip: Trip;
};

function MyTripCardItem({ trip }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>("https://images.unsplash.com/photo-1506744038136-46273834b3fb");

    useEffect(() => {
        if (trip?.tripDetail?.destination) {
            fetch('/api/google-place-detail', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placeName: trip.tripDetail.destination })
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.imageUrl) setPhotoUrl(data.imageUrl);
                })
                .catch(() => setPhotoUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb"));
        }
    }, [trip?.tripDetail?.destination]);

    return (
        <Link
            href={'/view-trip/' + trip?.tripId}
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="relative h-52 overflow-hidden">
                <Image
                    src={photoUrl}
                    alt={trip?.tripDetail?.destination || "Trip destination"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Destination Badge on Image */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold truncate">
                        {trip?.tripDetail?.destination}
                    </h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                        <span>from {trip?.tripDetail?.origin}</span>
                        <ArrowRight className="h-3 w-3" />
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
                {/* Trip Details */}
                <div className="flex flex-wrap gap-3">
                    {trip?.tripDetail?.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{trip.tripDetail.duration}</span>
                        </div>
                    )}
                    {trip?.tripDetail?.budget && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                            <Wallet className="h-4 w-4 text-blue-500" />
                            <span>{trip.tripDetail.budget}</span>
                        </div>
                    )}
                    {trip?.tripDetail?.group_size && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                            <Users className="h-4 w-4 text-orange-500" />
                            <span>{trip.tripDetail.group_size}</span>
                        </div>
                    )}
                </div>

                {/* View Button */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Click to view details</span>
                    <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                        View Trip
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default MyTripCardItem;

