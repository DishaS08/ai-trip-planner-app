"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const interestsList = [
    {
        icon: "🧗",
        title: "Adventure",
    },
    {
        icon: "🏛️",
        title: "Sightseeing",
    },
    {
        icon: "🎨",
        title: "Cultural",
    },
    {
        icon: "🍕",
        title: "Food",
    },
    {
        icon: "🥂",
        title: "Nightlife",
    },
    {
        icon: "🧘",
        title: "Relaxation",
    },
    {
        icon: "🛍️",
        title: "Shopping",
    },
    {
        icon: "🌲",
        title: "Nature",
    },
];

function InterestsUi({ onSelectedOption }: { onSelectedOption: (value: string) => void }) {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleContinue = () => {
        if (selectedInterests.length > 0) {
            onSelectedOption(selectedInterests.join(", "));
        }
    };

    return (
        <div className="mt-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3 text-sm">Select your interests (Multiple allowed):</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interestsList.map((item, index) => {
                    const isSelected = selectedInterests.includes(item.title);
                    return (
                        <div
                            key={index}
                            onClick={() => toggleInterest(item.title)}
                            className={`p-3 border rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center
                ${isSelected
                                    ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                                    : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }
              `}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-sm font-medium">{item.title}</span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 flex justify-end">
                <Button
                    disabled={selectedInterests.length === 0}
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}

export default InterestsUi;
