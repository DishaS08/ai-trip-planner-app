"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { useUserDetail } from '../provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from "convex/react";
import { TripInfo } from '../create-new-trip/_components/ChatBox';
import { Plus, Plane, MapPin, Sparkles } from 'lucide-react';
import MyTripCardItem from './_components/MyTripCardItem';

export type Trip = {
    tripId: any,
    tripDetail: TripInfo,
    _id: String,
}

function MyTrips() {
    const [myTrips, setMyTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const { userDetail } = useUserDetail();
    const convex = useConvex();

    useEffect(() => {
        if (userDetail) {
            GetUserTrip();
        }
    }, [userDetail])

    const GetUserTrip = async () => {
        setLoading(true);
        const result = await convex.query(api.tripDetail.GetUserTrips, {
            uid: userDetail?._id
        });
        setMyTrips(result);
        setLoading(false);
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
            {/* Header Section */}
            <div className="px-6 md:px-16 lg:px-24 py-10">
                <div className="max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl">
                                <Plane className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className='text-3xl md:text-4xl font-bold text-gray-800 dark:text-white'>
                                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Trips</span>
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    {myTrips.length > 0
                                        ? `You have ${myTrips.length} trip${myTrips.length > 1 ? 's' : ''} planned`
                                        : 'Your travel adventures await'
                                    }
                                </p>
                            </div>
                        </div>
                        <Link href={'/create-new-trip'}>
                            <Button className="gap-2 px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90">
                                <Plus className="h-5 w-5" />
                                Create New Trip
                            </Button>
                        </Link>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                                    <div className="h-52 bg-gray-200 dark:bg-gray-700" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && myTrips?.length === 0 && (
                        <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg p-12 flex flex-col items-center justify-center text-center'>
                            <div className="p-6 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full mb-6">
                                <MapPin className="h-16 w-16 text-primary" />
                            </div>
                            <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>No trips yet!</h2>
                            <p className="text-gray-500 mb-6 max-w-md">
                                Start planning your next adventure. Our AI will create a personalized itinerary just for you.
                            </p>
                            <Link href={'/create-new-trip'}>
                                <Button className="gap-2 px-8 py-6 rounded-xl shadow-lg text-lg bg-gradient-to-r from-primary to-blue-500">
                                    <Sparkles className="h-5 w-5" />
                                    Plan Your First Trip
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Trips Grid */}
                    {!loading && myTrips?.length > 0 && (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {myTrips.map((trip, index) => (
                                <MyTripCardItem trip={trip} key={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyTrips

