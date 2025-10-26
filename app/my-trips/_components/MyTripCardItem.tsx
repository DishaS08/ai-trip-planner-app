import React, { useEffect, useState } from 'react';
import { Trip } from "../page";
import Image from 'next/image';
import { ArrowBigRightIcon } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

type Props = {
    trip: Trip;
};

function MyTripCardItem({ trip }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        if (trip) {
            GetGooglePlaceDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trip]);

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', {
                placeName: trip?.tripDetail?.destination,
            });
            if (result?.data?.error || !result?.data?.photos) {
                return;
            }
            // Use first photo's small url or fallback to undefined
            const firstPhotoUrl = result.data.photos[0]?.urls?.small;
            setPhotoUrl(firstPhotoUrl);
        } catch (error) {
            console.error("Error fetching place detail:", error);
        }
    };

    return (
        <Link href={'/view-trip/' + trip?.tripId} className="p-5 shadow rounded-2xl" >
            <Image
                src={photoUrl ?? "https://images.unsplash.com/photo-1506744038136-46273834b3fb"}
                alt={trip.tripId}
                width={400}
                height={400}
                className="rounded-xl object-cover w-full h-[270px]"
            />
            <h2 className="flex gap-2 font-semibold text-xl mt-2">
                {trip?.tripDetail?.origin} <ArrowBigRightIcon />  {trip?.tripDetail?.destination}
            </h2>
            <h2 className="mt-2 text-gray-500">
                {trip?.tripDetail?.duration} Trip with {trip?.tripDetail?.budget} Budget
            </h2>
        </Link>
    );
}

export default MyTripCardItem;
