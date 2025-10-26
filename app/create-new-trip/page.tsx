"use client"
import React, { useEffect, useState } from 'react'
import Chatbox from './_components/ChatBox'
import Itinerary from './_components/Itinerary'
import { useTripDetail } from '../provider';
import GlobalMap from './_components/GlobalMap';
import { Button } from '@/components/ui/button';
import { Globe2, Plane } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function CreateNewTrip() {
  // @ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [activeIndex, setActiveIndex] = useState(1);
  useEffect(() => {
    setTripDetailInfo(null);
  }, []);

  return (
    <div className="grid grid-cols-1 md:Grid-cols-3 gap-5 p-10">
      <div className='col-span-2'>
        <Chatbox />
      </div>

      <div className='col-span-3 relative'>
        {activeIndex == 0 ? <Itinerary /> : <GlobalMap />}
        <Tooltip>
          <TooltipTrigger asChild className='absolute bg-black bottom-10 left-[50%] rounded-2xl'>
            <Button size={'lg'} className='bg-black hover:bg-gray-700'
              onClick={() => setActiveIndex(activeIndex == 0 ? 1 : 0)}>
              {activeIndex == 0 ? <Plane /> : <Globe2 />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Switch Between Map and Trip</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export default CreateNewTrip
