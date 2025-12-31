"use client"
import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import { Trip } from '@/app/my-trips/page';
import { useTripDetail, useUserDetail } from '@/app/provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Wallet, Users, Plane, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ViewTrip() {
  const params = useParams<{ tripid: string }>();
  const tripid = params?.tripid;
  const { userDetail } = useUserDetail();
  const convex = useConvex();
  const [tripData, setTripData] = useState<Trip>();
  const [loading, setLoading] = useState(true);
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const router = useRouter();

  useEffect(() => {
    if (userDetail) {
      GetTrip();
    }
  }, [userDetail]);

  const GetTrip = async () => {
    setLoading(true);
    const result = await convex.query(api.tripDetail.GetTripById, {
      uid: userDetail?._id,
      tripid: tripid + ''
    });
    setTripData(result);
    setTripDetailInfo(result?.tripDetail);
    setLoading(false);
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
      {/* Header Section */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          {/* Back Button & Title */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/my-trips')}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className='text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2'>
                  <Plane className="h-5 w-5 text-primary" />
                  {loading ? (
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ) : (
                    <span>
                      Trip to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{tripData?.tripDetail?.destination}</span>
                    </span>
                  )}
                </h1>
                {!loading && tripData?.tripDetail?.origin && (
                  <p className="text-sm text-gray-500 mt-0.5">From {tripData.tripDetail.origin}</p>
                )}
              </div>
            </div>

            {/* Action Buttons: Share & Print */}
            {!loading && tripData?.tripDetail && (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            )}

            {/* Trip Quick Info */}
            {!loading && tripData?.tripDetail && (
              <div className="hidden md:flex items-center gap-3">
                {tripData.tripDetail.duration && (
                  <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{tripData.tripDetail.duration}</span>
                  </div>
                )}
                {tripData.tripDetail.budget && (
                  <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Wallet className="h-4 w-4 text-blue-500" />
                    <span>{tripData.tripDetail.budget}</span>
                  </div>
                )}
                {tripData.tripDetail.group_size && (
                  <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span>{tripData.tripDetail.group_size}</span>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile Quick Info */}
          {!loading && tripData?.tripDetail && (
            <div className="md:hidden flex flex-wrap items-center gap-2 mt-3 ml-12">
              {tripData.tripDetail.duration && (
                <div className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  <Calendar className="h-3 w-3 text-primary" />
                  <span>{tripData.tripDetail.duration}</span>
                </div>
              )}
              {tripData.tripDetail.budget && (
                <div className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  <Wallet className="h-3 w-3 text-blue-500" />
                  <span>{tripData.tripDetail.budget}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-[70vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading your trip details...</p>
            </div>
          </div>
        )}

        {/* Desktop View - Full Width Itinerary */}
        {!loading && (
          <div className="hidden md:block h-[calc(100vh-130px)] overflow-auto">
            <Itinerary />
          </div>
        )}

        {/* Mobile View - Itinerary Only */}
        {!loading && (
          <div className="md:hidden h-[calc(100vh-180px)] overflow-auto">
            <Itinerary />
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewTrip
