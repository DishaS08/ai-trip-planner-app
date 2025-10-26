"use client"
import React from 'react'
import { Globe2 } from 'lucide-react'
import { Button } from "@/components/ui/button";

function FinalUi({ viewTrip, disable }: { viewTrip: () => void, disable: boolean }) {
  return (
    <div>
      <Globe2 className='text-primary text-4xl animate-bounce' />
      <h2 className='mt-3 text-lg font-semibold text-primary'>
        ✈️ Planning your dream trip...
      </h2>
      <p className='text-gray-500 text-sm text-center mt-1'>
        Gathering best destinations, activities, travel details for you.
      </p>
      <Button
        disabled={disable}
        // onClick will always be a function (or undefined if disabled)
        onClick={disable ? undefined : viewTrip}
        className="mt-2 w-full"
      >View Trip</Button>
      <div className='w-48 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden'>
        <div className='h-2 bg-primary animate-pluse w-3/4'></div>
      </div>
    </div>
  )
}

export default FinalUi
