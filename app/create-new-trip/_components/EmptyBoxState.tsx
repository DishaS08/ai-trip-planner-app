import React, { useEffect, useState } from 'react'
import { suggestions } from "../../_components/Hero";
import { useRouter } from 'next/navigation';

function EmptyBoxState({ onSelectOption, mode }: { onSelectOption: any, mode?: string | null }) {
    const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
    const router = useRouter();

    useEffect(() => {
        // ALWAYS defaults to only 'Create New Trip' unless specific mode passed
        const createOption = suggestions.filter(s => s.mode === 'create');

        if (mode) {
            const relevant = suggestions.filter(s => s.mode === mode);
            if (relevant.length > 0) {
                setFilteredSuggestions(relevant);
            } else {
                setFilteredSuggestions(createOption);
            }
        } else {
            setFilteredSuggestions(createOption);
        }
    }, [mode]);

    const handleOptionClick = (suggestion: any) => {
        if (suggestion.mode === 'create') {
            onSelectOption(suggestion.title);
        } else {
            // For modes, navigate to ensure URL/state is correct
            // Check if we are already in the mode to avoid redundant push
            if (mode === suggestion.mode) {
                onSelectOption(suggestion.title);
            } else {
                router.push(`/create-new-trip?mode=${suggestion.mode}`);
            }
        }
    }

    return (
        <div className='px-4'>
            <h2 className='font-bold text-xl text-center'>Start Planning new <strong className='text-primary'>Trip</strong> using AI</h2>
            <p className='text-center text-gray-400 mt-1 text-sm'>Discover personalized travel itineraries, find the best destinations, and plan your dream vacation effortlessly with the power of AI. Let our smart assistant do the hard work while you enjoy the journey.</p>

            <div className="flex flex-col gap-3 mt-4">
                {filteredSuggestions.map((suggestion, index) => (

                    <div key={index}
                        onClick={() => handleOptionClick(suggestion)}
                        className="flex items-center gap-2 border 
                                rounded-xl p-3 cursor-pointer hover:border-primary hover:text-primary">
                        {suggestion.icon}
                        <h2 className="text-lg">{suggestion.title}</h2>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default EmptyBoxState

