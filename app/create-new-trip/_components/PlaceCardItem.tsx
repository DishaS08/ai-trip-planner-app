// "use client"
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import Link from 'next/link'
// import { Wallet, Star, Ticket, Clock, ExternalLink } from 'lucide-react';
// import { Activity } from './ChatBox';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react'

// type Props = {
//     activity: Activity
// }
// function PlaceCardItem({ activity }: Props) {
//     const [photoUrl, setPhotoUrl] = useState<string>();
//     useEffect(() => {
//         activity && GetGooglePlaceDetail();
//     }, [activity])

//     const GetGooglePlaceDetail = async () => {
//         const result = await axios.post('/api.google-place-detail', {
//             placeName: activity?.place_name +":"+activity?.place_address,
//         });
//         if (result?.data?.e) {
//             return;
//         }
//         setPhotoUrl(result?.data);
//     }
//     return (
//         <div>
//             <Image src={photoUrl ? photoUrl : '/placeholder.jpg'} width={400} height={200} alt={activity.place_name}
//                 className='object-cover rounded-xl'
//             />
//             <h2 className='font-semibold text-lg'>{activity?.place_name}</h2>
//             <p className='text-gray-500 line-clamp-2'>{activity?.place_details}</p>
//             <h2 className='flex-gap-2 text-blue-500 line-clamp-1'><Ticket />{activity?.ticket_pricing}</h2>
//             <p className='flex text-green-400 gap-2 line-clamp-1'><Clock />{activity?.best_time_to_visit}</p>
//             <Link href={"https://www.google.com/maps/search/?api=1&query=" + activity?.place_name} target="_blank">
//                 <Button size={'sm'} variant={"outline"} className='w-full mt-2'>View <ExternalLink /></Button>
//             </Link>


//         </div>
//     )
// }

// export default PlaceCardItem








"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ticket, Clock, ExternalLink } from "lucide-react";

type Props = {
    activity: {
        place_name: string;
        place_address: string;
        place_details: string;
        ticket_pricing: string;
        best_time_to_visit: string;
    };
};

export default function PlaceCardItem({ activity }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        if (activity) {
            fetchPhoto();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity]);

    async function fetchPhoto() {
        try {
            const response = await axios.post("/api/google-place-detail", {
                placeName: `${activity.place_name}:${activity.place_address}`,
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
        <div>
            <Image
                src={photoUrl ?? "/placeholder.jpg"}
                alt={activity.place_name}
                width={400}
                height={200}
                className="object-cover rounded-xl"
            />
            <h2 className="font-semibold text-lg">{activity.place_name}</h2>
            <p className="text-gray-500 line-clamp-2">{activity.place_details}</p>
            <h2 className="flex gap-2 text-blue-500 line-clamp-1">
                <Ticket />
                {activity.ticket_pricing}
            </h2>
            <p className="flex gap-2 text-green-400 line-clamp-1">
                <Clock />
                {activity.best_time_to_visit}
            </p>
            <Link
                href={`https://www.google.com/maps/search/?api=1&query=${activity.place_name}`}
                target="_blank"
            >
                <Button size="sm" variant="outline" className="w-full mt-2">
                    View <ExternalLink />
                </Button>
            </Link>
        </div>
    );
}
