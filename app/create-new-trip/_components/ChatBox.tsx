"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios'
import { Send, Loader } from "lucide-react";
import React, { useEffect, useState } from 'react'
import EmptyBoxState from './EmptyBoxState';
import GroupSizeUi from './GroupSizeUi';
import BudgetUi from './BudgetUi';
import SelectDays from './SelectDaysUi'
import FinalUi from './FinalUi';
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTripDetail, useUserDetail } from "@/app/provider"
import { v4 as uuidv4 } from "uuid";

type Message = {
    role: string,
    content: string,
    ui?: string,
}

export type TripInfo = {
    budget: string,
    destination: string,
    duration: string,
    group_size: string,
    origin: string,
    hotels: Hotel[],
    itinerary: Itinerary[]
}

export type Hotel = {
    hotel_name: string;
    hotel_address: string;
    price_per_night: string;
    hotel_image_url: string;
    geo_coordinates: {
        latitude: number;
        longitude: number;
    };
    rating: number;
    description: string;
};

export type Activity = {
    place_name: string;
    place_details: string;
    place_image_url: string;
    geo_coordinates: {
        latitude: number;
        longitude: number;
    };
    place_address: string;
    ticket_pricing: string;
    time_travel_each_location: string;
    best_time_to_visit: string;
};

export type Itinerary = {
    day: number;
    day_plan: string;
    best_time_to_visit_day: string;
    activities: Activity[];
}

function ChatBox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [isFinal, setIsFinal] = useState(false);
    const [tripDetail, setTripDetail] = useState<TripInfo>();
    const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
    const { userDetail } = useUserDetail();
    //@ts-ignore
    const { setTripDetailInfo } = useTripDetail();

    // This is the STATE that triggers the real "final" API call!
    const [pendingFinal, setPendingFinal] = useState(false);

    const onSend = async () => {
        if (!userInput?.trim()) return;
        setLoading(true);
        setUserInput('');

        const newMsg: Message = {
            role: 'user',
            content: userInput
        }

        // Add this message to local state (so useEffect can observe ui triggers)
        setMessages((prev: Message[]) => [...prev, newMsg]);

        // Only submit to backend if NOT pendingFinal. See useEffect below for final trigger
        if (!pendingFinal) {
            const result = await axios.post('/api/aimodel', {
                messages: [...messages, newMsg],
                isFinal: isFinal
            });

            // Regular step response
            if (!isFinal) {
                setMessages((prev: Message[]) => [...prev, {
                    role: 'assistant',
                    content: result?.data?.resp,
                    ui: result?.data?.ui
                }]);
            }

            setLoading(false);
        }
    }

    // New effect: Triggers the final API call ONLY after all steps are done (when ui=="final")
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.ui === 'final' && !pendingFinal) {
            setPendingFinal(true); // prevent loop
            (async () => {
                setLoading(true);
                // Now this will POST with isFinal:true and get the actual plan
                const result = await axios.post('/api/aimodel', {
                    messages: messages,
                    isFinal: true
                });
                setTripDetail(result?.data?.trip_plan);
                setTripDetailInfo(result?.data?.trip_plan);
                const tripId = uuidv4();
                await SaveTripDetail({
                    tripDetail: result?.data?.trip_plan,
                    tripId: tripId,
                    uid: userDetail?._id
                });
                setLoading(false);
            })()
        }
        // eslint-disable-next-line
    }, [messages]);

    // Now ok for stepper UIs
    const RenderGenerativeUi = (ui: string | undefined) => {
        if (ui === "budget") {
            return <BudgetUi onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
        } else if (ui === "groupSize") {
            return <GroupSizeUi onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
        } else if (ui === "tripduration") {
            return <SelectDays onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
        } else if (ui === "final") {
            // Show the "View Trip" loading/final UI
            return <FinalUi viewTrip={() => { }} disable={!tripDetail} />;
        }
        return null
    }

    return (
        <div className='h-[85vh] flex flex-col border shadow rounded-2xl p-5'>
            {messages?.length == 0 &&
                <EmptyBoxState
                    onSelectOption={(v: string) => { setUserInput(v); onSend() }} />
            }
            {/* Display Messages */}
            <section className='flex-1 overflow-y-auto p-4'>
                {messages.map((msg: Message, index) => (
                    msg.role === "user" ?
                        <div className='flex justify-end mt-2' key={index}>
                            <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                                {msg.content}
                            </div>
                        </div> :
                        <div className='flex justify-start mt-2' key={index}>
                            <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                                {msg.content}
                                {RenderGenerativeUi(msg.ui ?? '')}
                            </div>
                        </div>
                ))}

                {loading && <div className='flex justify-start mt-2'>
                    <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                        <Loader className='animate-spin' />
                    </div>
                </div>}

            </section>
            {/* User Input */}
            <section>
                <div className="border rounded-2xl p-4 relative">
                    <Textarea placeholder="Start typing here..."
                        className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
                        onChange={(event) => setUserInput(event.target.value)}
                        value={userInput}
                    />
                    <Button size={'icon'} className="absolute bottom-6 right-6" onClick={() => onSend()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </section >
        </div >
    )
}

export default ChatBox


