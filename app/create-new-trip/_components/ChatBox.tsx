"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios'
import { Send, Loader, Sparkles } from "lucide-react";
import React, { useEffect, useState } from 'react'
import EmptyBoxState from './EmptyBoxState';
import GroupSizeUi from './GroupSizeUi';
import BudgetUi from './BudgetUi';
import SelectDays from './SelectDaysUi'
import FinalUi from './FinalUi';
import InterestsUi from './InterestsUi';
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTripDetail, useUserDetail } from "@/app/provider"
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams, useRouter } from "next/navigation";

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
    famous_features?: string[];
};

export type Itinerary = {
    day: number;
    day_plan: string;
    best_time_to_visit_day: string;
    activities: Activity[];
    suggested_hotels?: Hotel[];
    must_try_food?: string[];
    local_transport?: string;
    travel_tips?: string[];
}

function ChatBox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [isFinal, setIsFinal] = useState(false);
    const [tripDetail, setTripDetail] = useState<TripInfo | null>(null);
    const [tripId, setTripId] = useState<string | null>(null);
    const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
    const { userDetail } = useUserDetail();
    const { setTripDetailInfo } = useTripDetail();

    const { user } = useUser();
    const CreateUser = useMutation(api.user.CreateNewUser);

    // This is the STATE that triggers the real "final" API call!
    const [pendingFinal, setPendingFinal] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter(); // Add router
    const q = searchParams?.get('q');
    const mode = searchParams?.get('mode');
    const initialized = React.useRef(false);

    const MODE_PROMPTS = {
        'inspire': "I am open to suggestions! Please inspire me with some amazing destination ideas.",
        'hidden-gems': "I want to discover hidden gems and less touristy places. Can you suggest some?",
        'adventure': "I'm looking for an adventure-packed trip! Where should I go for thrills and action?"
    };

    const onSend = async (manualInput?: string) => {
        const inputToSend = manualInput || userInput;
        if (!inputToSend?.trim()) return;
        setLoading(true);
        setUserInput('');

        const newMsg: Message = {
            role: 'user',
            content: inputToSend
        }

        // Add this message to local state (so useEffect can observe ui triggers)
        setMessages((prev: Message[]) => [...prev, newMsg]);

        // Only submit to backend if NOT pendingFinal. See useEffect below for final trigger
        if (!pendingFinal) {
            try {
                const result = await axios.post('/api/aimodel', {
                    messages: [...messages, newMsg],
                    isFinal: isFinal,
                    mode: mode // Pass current mode
                });

                // Regular step response
                if (!isFinal) {
                    setMessages((prev: Message[]) => [...prev, {
                        role: 'assistant',
                        content: result?.data?.resp,
                        ui: result?.data?.ui
                    }]);
                }
            } catch (error: any) {
                console.error("Chat API Error:", error);
                const errorMessage = error.response?.data?.error || error.message || "Something went wrong. Please check your API key.";
                setMessages((prev: Message[]) => [...prev, {
                    role: 'assistant',
                    content: `⚠️ Error: ${errorMessage}`,
                    ui: "error"
                }]);
            } finally {
                setLoading(false);
            }
        }
    }

    // Initialize Chat with Query Param if available
    useEffect(() => {
        if (!initialized.current && messages.length === 0) {
            if (q) {
                initialized.current = true;
                onSend(q);
            } else if (mode && MODE_PROMPTS[mode as keyof typeof MODE_PROMPTS]) {
                initialized.current = true;
                onSend(MODE_PROMPTS[mode as keyof typeof MODE_PROMPTS]);
            }
        }
    }, [q, mode]);

    // New effect: Triggers the final API call ONLY after all steps are done (when ui=="final")
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        console.log("Last Message UI:", lastMsg?.ui); // Debug Log

        if (lastMsg?.ui?.toLowerCase() === 'final' && !pendingFinal) {
            setPendingFinal(true); // prevent loop
            (async () => {
                try {
                    setLoading(true);
                    console.log("Generating final trip plan...");
                    const result = await axios.post('/api/aimodel', {
                        messages: messages,
                        isFinal: true,
                        mode: mode
                    });

                    if (!result?.data?.trip_plan) {
                        throw new Error("No trip plan generated from AI");
                    }

                    setTripDetail(result?.data?.trip_plan);
                    setTripDetailInfo(result?.data?.trip_plan);
                    const newTripId = uuidv4();
                    setTripId(newTripId);

                    let uid = userDetail?._id;

                    if (!uid) {
                        if (user) {
                            console.log("User Detail missing in context. Creating/Fetching user from backend...");
                            const newUser = await CreateUser({
                                name: user.fullName || "User",
                                email: user.primaryEmailAddress?.emailAddress || "",
                                imageUrl: user.imageUrl || ""
                            });
                            uid = newUser?._id;
                            console.log("Fetched new UID:", uid);
                        }
                    }

                    if (!uid) {
                        console.error("User not found! Cannot save to Convex.");
                        alert("Critical Error: User ID is missing. Cannot save."); // DEBUG ALERT
                        setMessages((prev: Message[]) => [...prev, {
                            role: 'assistant',
                            content: `⚠️ Error: You must be logged in to save your trip.`,
                            ui: "error"
                        }]);
                        return;
                    }

                    alert(`Debug: Saving Trip... UID: ${uid}`); // DEBUG ALERT
                    await SaveTripDetail({
                        tripDetail: result?.data?.trip_plan,
                        tripId: newTripId,
                        uid: uid
                    });
                    console.log("Successfully saved to Convex!");
                    alert("Success! Trip Saved. Redirecting..."); // DEBUG ALERT

                    // Redirect to View Trip Page
                    router.push('/view-trip/' + newTripId);
                } catch (e: any) {
                    console.error("Error generating/saving trip:", e);
                    alert(`Failed to save trip: ${e.message}`); // ALERT USER
                    // Add error message to chat
                    setMessages((prev: Message[]) => [...prev, {
                        role: 'assistant',
                        content: `⚠️ Error saving trip: ${e instanceof Error ? e.message : 'Unknown error'}`,
                        ui: "error"
                    }]);
                } finally {
                    setLoading(false);
                }
            })()
        }
        // eslint-disable-next-line
    }, [messages]);

    // Internal component for Trip Options
    const TripOptionsUi = ({ onSelectedOption }: { onSelectedOption: (v: string) => void }) => {
        const options = [
            {
                title: "Inspire Me",
                desc: "Best for undecided travelers in need of spark.",
                choice_key: "inspire",
                tags: ["Curated", "Top Rated"]
            },
            {
                title: "Hidden Gems",
                desc: "Discover off-beat locations away from crowds.",
                choice_key: "hidden-gems",
                tags: ["Authentic", "Quiet"]
            },
            {
                title: "Adventure",
                desc: "Thrill-seeking destinations near nature.",
                choice_key: "adventure",
                tags: ["Active", "Nature"]
            }
        ];

        return (
            <div className="flex flex-col gap-3 mt-3 w-full">
                <p className="text-sm text-gray-500 font-medium">Select a travel style:</p>
                <div className="grid grid-cols-1 gap-3">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => onSelectedOption(option.choice_key)}
                            className="group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                        >
                            <div className="relative z-10">
                                <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center justify-between">
                                    {option.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                                    {option.desc}
                                </p>
                                <div className="flex gap-1">
                                    {option.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] uppercase font-bold rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Now ok for stepper UIs
    const RenderGenerativeUi = (ui: string | undefined) => {
        if (ui === "budget") {
            return <BudgetUi onSelectedOption={(v: string) => { setUserInput(v); onSend(v) }} />
        } else if (ui === "groupSize") {
            return <GroupSizeUi onSelectedOption={(v: string) => { setUserInput(v); onSend(v) }} />
        } else if (ui === "tripduration") {
            return <SelectDays onSelectedOption={(v: string) => { setUserInput(v); onSend(v) }} />
        } else if (ui === "interests") {
            return <InterestsUi onSelectedOption={(v: string) => { setUserInput(v); onSend(v) }} />
        } else if (ui === "tripOptions") {
            return <TripOptionsUi onSelectedOption={(v: string) => { setUserInput(v); onSend(v) }} />
        } else if (ui === "final") {
            // Show the "View Trip" loading/final UI
            return <FinalUi tripId={tripId} isReady={!!tripDetail} />;
        }
        return null
    }

    return (
        <div className='h-full flex flex-col'>
            {/* Messages Area - Scrollable */}
            <div className='flex-1 overflow-y-auto px-4 py-6 scroll-smooth custom-scrollbar'>
                {messages?.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center">
                        <EmptyBoxState
                            mode={mode}
                            onSelectOption={(v: string) => { setUserInput(v); onSend(v) }} />
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {messages.map((msg: Message, index) => (
                            msg.role === "user" ? (
                                <div className='flex justify-end' key={index}>
                                    <div className='max-w-[85%] bg-gradient-to-tr from-primary to-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-br-none shadow-lg shadow-primary/20 text-sm md:text-base leading-relaxed'>
                                        {msg.content}
                                    </div>
                                </div>
                            ) : (
                                <div className='flex justify-start items-start gap-3' key={index}>
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center shadow-sm">
                                        <Sparkles className="h-4 w-4 text-white" />
                                    </div>
                                    <div className='max-w-[85%] bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100/50 dark:border-gray-600/30 text-sm md:text-base leading-relaxed'>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                        <div className="mt-4">
                                            {RenderGenerativeUi(msg.ui ?? '')}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}

                        {loading && (
                            <div className='flex justify-start items-center gap-3'>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center shadow-sm animate-pulse">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div className='bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100/50'>
                                    <div className="flex gap-1.5">
                                        <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="h-4" /> {/* Spacer for bottom scroll */}
                    </div>
                )}
            </div>

            {/* Input Area - Floating Bottom */}
            <div className="flex-shrink-0 pt-2 pb-6 px-4 z-10 bg-transparent">
                <div className="max-w-3xl mx-auto relative group bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 ring-1 ring-black/5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-300">
                    <Textarea
                        placeholder="Type your answer here..."
                        className="w-full min-h-[70px] max-h-[160px] pl-6 pr-16 py-5 bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-transparent resize-none text-base sm:text-lg leading-relaxed shadow-none placeholder:text-gray-400"
                        onChange={(event) => setUserInput(event.target.value)}
                        value={userInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                    />
                    <Button
                        size={'icon'}
                        className={`absolute bottom-3 right-3 h-11 w-11 rounded-full shadow-lg transition-all duration-300 ${userInput?.trim() ? 'bg-gradient-to-tr from-primary to-blue-600 hover:scale-110 hover:shadow-primary/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
                        onClick={() => onSend()}
                        disabled={loading || !userInput?.trim()}
                    >
                        {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 text-center font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    Press Enter to send
                </p>
            </div>
        </div>
    )
}

export default ChatBox


