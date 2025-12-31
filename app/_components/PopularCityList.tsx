"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { MapPin, Clock, Star, Utensils, Camera, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Reusable Destination Content Component
const DestinationContent = ({
    highlights,
    bestTime,
    mustTry,
    funFact,
    heroImage,
}: {
    highlights: { icon: React.ReactNode; title: string; description: string }[];
    bestTime: string;
    mustTry: string[];
    funFact: string;
    heroImage: string;
}) => {
    return (
        <div className="space-y-6">
            {/* Hero Section with Image */}
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden">
                <img
                    src={heroImage}
                    alt="Destination"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                        <Clock className="h-4 w-4" />
                        <span>Best Time to Visit: <strong>{bestTime}</strong></span>
                    </div>
                </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {highlights.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                {item.icon}
                            </div>
                            <h3 className="font-semibold text-neutral-800 dark:text-white">
                                {item.title}
                            </h3>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Must Try Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-neutral-800 dark:text-white">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Must-Try Experiences
                </h3>
                <div className="flex flex-wrap gap-2">
                    {mustTry.map((item, index) => (
                        <span
                            key={index}
                            className="px-4 py-2 bg-white dark:bg-neutral-800 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Fun Fact */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5 rounded-2xl">
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                    <span className="font-bold">💡 Fun Fact: </span>
                    {funFact}
                </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
                <Link href="/create-new-trip">
                    <Button size="lg" className="gap-2 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Plane className="h-5 w-5" />
                        Plan Your Trip Now
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export function PopularCityList() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full py-20 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />

            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary text-sm font-medium rounded-full mb-4 border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Trending Destinations
                        </span>
                        <h2 className="text-2xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">
                            Explore{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary">
                                Popular Places
                            </span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl text-lg">
                            Click on any destination to discover highlights, must-try experiences, and start planning your dream trip
                        </p>
                    </div>

                </div>
            </div>

            {/* Carousel with enhanced wrapper */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
                <Carousel items={cards} />
            </div>

            {/* Bottom decoration */}
            <div className="max-w-7xl mx-auto px-4 mt-8 flex justify-center">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                    <span>Swipe or use arrows to explore more destinations</span>
                    <span className="animate-bounce">→</span>
                </p>
            </div>
        </div>
    );
}

// Paris Content
const ParisContent = () => (
    <DestinationContent
        heroImage="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80"
        bestTime="April - June & September - November"
        highlights={[
            {
                icon: <Camera className="h-5 w-5" />,
                title: "Eiffel Tower",
                description: "Witness breathtaking city views from the iconic 330m iron lattice tower, especially magical at night with its sparkling lights."
            },
            {
                icon: <MapPin className="h-5 w-5" />,
                title: "The Louvre",
                description: "Home to 35,000 artworks including the Mona Lisa. Plan at least half a day to explore the world's largest art museum."
            },
            {
                icon: <Utensils className="h-5 w-5" />,
                title: "French Cuisine",
                description: "Indulge in croissants, macarons, escargot, and fine wine at charming sidewalk cafés along the Seine."
            }
        ]}
        mustTry={["Seine River Cruise", "Montmartre Walk", "Palace of Versailles", "Croissant at Local Bakery", "Sunset at Sacré-Cœur"]}
        funFact="The Eiffel Tower grows about 6 inches taller in summer due to thermal expansion of the iron!"
    />
);

// New York Content
const NYCContent = () => (
    <DestinationContent
        heroImage="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80"
        bestTime="April - June & September - November"
        highlights={[
            {
                icon: <Star className="h-5 w-5" />,
                title: "Times Square",
                description: "Experience the electric energy of 'The Crossroads of the World' with dazzling billboards, Broadway theaters, and endless entertainment."
            },
            {
                icon: <MapPin className="h-5 w-5" />,
                title: "Central Park",
                description: "843 acres of urban oasis offering rowing, cycling, ice skating, and peaceful picnic spots in the heart of Manhattan."
            },
            {
                icon: <Camera className="h-5 w-5" />,
                title: "Statue of Liberty",
                description: "A universal symbol of freedom. Take the ferry to Liberty Island and climb to the crown for unforgettable views."
            }
        ]}
        mustTry={["Broadway Show", "NYC Pizza Slice", "Brooklyn Bridge Walk", "Top of the Rock", "High Line Park"]}
        funFact="New York City has 8.3 million residents speaking over 800 languages, making it the most linguistically diverse city in the world!"
    />
);

// Tokyo Content
const TokyoContent = () => (
    <DestinationContent
        heroImage="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80"
        bestTime="March - May (Cherry Blossom) & October - November"
        highlights={[
            {
                icon: <MapPin className="h-5 w-5" />,
                title: "Shibuya Crossing",
                description: "The world's busiest pedestrian crossing where up to 3,000 people cross at once. A mesmerizing display of organized chaos!"
            },
            {
                icon: <Star className="h-5 w-5" />,
                title: "Senso-ji Temple",
                description: "Tokyo's oldest temple in Asakusa, with the iconic Thunder Gate and Nakamise shopping street leading to it."
            },
            {
                icon: <Utensils className="h-5 w-5" />,
                title: "Food Paradise",
                description: "From Michelin-starred sushi to steaming ramen in hidden alleys, Tokyo has more restaurants than any city in the world."
            }
        ]}
        mustTry={["Tsukiji Outer Market", "Robot Restaurant", "Meiji Shrine", "Harajuku Fashion Walk", "Akihabara Electronics"]}
        funFact="Tokyo has over 160,000 restaurants and more Michelin stars than any other city on Earth!"
    />
);

// Rome Content
const RomeContent = () => (
    <DestinationContent
        heroImage="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80"
        bestTime="April - June & September - October"
        highlights={[
            {
                icon: <MapPin className="h-5 w-5" />,
                title: "Colosseum",
                description: "Step back 2,000 years into the world's greatest amphitheater where 50,000 spectators watched gladiatorial contests."
            },
            {
                icon: <Camera className="h-5 w-5" />,
                title: "Vatican City",
                description: "Explore St. Peter's Basilica and the Sistine Chapel with Michelangelo's breathtaking ceiling masterpiece."
            },
            {
                icon: <Utensils className="h-5 w-5" />,
                title: "Italian Cuisine",
                description: "Savor authentic carbonara, cacio e pepe, and gelato in the trattorias of Trastevere."
            }
        ]}
        mustTry={["Trevi Fountain Coin Toss", "Pantheon Visit", "Spanish Steps", "Pasta Making Class", "Roman Forum Walk"]}
        funFact="Romans throw approximately €3,000 into the Trevi Fountain every day, which is collected and donated to charity!"
    />
);

// Dubai Content
const DubaiContent = () => (
    <DestinationContent
        heroImage="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80"
        bestTime="November - March (Cooler months)"
        highlights={[
            {
                icon: <Star className="h-5 w-5" />,
                title: "Burj Khalifa",
                description: "Ascend to the 148th floor observation deck of the world's tallest building at 828m for 360° views of the city."
            },
            {
                icon: <MapPin className="h-5 w-5" />,
                title: "Desert Safari",
                description: "Thrilling dune bashing, camel riding, sandboarding, and a magical dinner under the stars in a Bedouin camp."
            },
            {
                icon: <Camera className="h-5 w-5" />,
                title: "Dubai Mall",
                description: "The world's largest shopping mall featuring an aquarium, ice rink, and the mesmerizing Dubai Fountain show."
            }
        ]}
        mustTry={["Dhow Cruise Dinner", "Palm Jumeirah Island", "Gold Souk Shopping", "Atlantis Waterpark", "Dubai Frame View"]}
        funFact="Dubai has the world's first 7-star hotel, and its artificial Palm Islands can be seen from space!"
    />
);

// India Content
const IndiaContent = () => (
    <DestinationContent
        heroImage="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80"
        bestTime="October - March (Winter Season)"
        highlights={[
            {
                icon: <Star className="h-5 w-5" />,
                title: "Taj Mahal",
                description: "A UNESCO masterpiece of white marble built by Emperor Shah Jahan as an eternal symbol of love. Visit at sunrise for magic."
            },
            {
                icon: <MapPin className="h-5 w-5" />,
                title: "Jaipur - Pink City",
                description: "Explore majestic Amber Fort, Hawa Mahal's 953 windows, and vibrant bazaars in Rajasthan's royal capital."
            },
            {
                icon: <Camera className="h-5 w-5" />,
                title: "Kerala Backwaters",
                description: "Cruise through serene palm-fringed canals on a traditional houseboat, experiencing 'God's Own Country'."
            }
        ]}
        mustTry={["Varanasi Ganga Aarti", "Rajasthani Thali", "Spice Markets of Kochi", "Yoga in Rishikesh", "Elephant Safari"]}
        funFact="India invented the number system we use today, including zero! The Taj Mahal also changes color throughout the day."
    />
);

const data = [
    {
        category: "Paris, France",
        title: "Explore the City of Lights – Eiffel Tower, Louvre & more",
        src: "/images/img-1.jpg",
        content: <ParisContent />,
    },
    {
        category: "New York, USA",
        title: "Experience NYC – Times Square, Central Park, Broadway",
        src: "/images/img-2.jpg",
        content: <NYCContent />,
    },
    {
        category: "Tokyo, Japan",
        title: "Discover Tokyo – Shibuya, Cherry Blossoms, Temples",
        src: "/images/img-3.jpg",
        content: <TokyoContent />,
    },
    {
        category: "Rome, Italy",
        title: "Walk through History – Colosseum, Vatican, Roman Forum",
        src: "/images/img-4.jpg",
        content: <RomeContent />,
    },
    {
        category: "Dubai, UAE",
        title: "Luxury and Innovation – Burj Khalifa, Desert Safari",
        src: "/images/img-5.jpg",
        content: <DubaiContent />,
    },
    {
        category: "India",
        title: "Incredible India – Taj Mahal, Jaipur, Kerala Backwaters",
        src: "/images/img-6.jpg",
        content: <IndiaContent />,
    },
];
