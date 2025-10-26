"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import { Wallet, Star, Ticket, Clock, ExternalLink, ArrowLeft, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';
import { useTripDetail } from '@/app/provider';
import type { TripInfo, Hotel, Itinerary, Activity } from './ChatBox';

// const TRIP_DATA = {
//     budget: "Moderate",
//     destination: "Goa",
//     duration: "5 days",
//     group_size: "Family (3-5 people)",
//     origin: "Mumbai",
//     hotels: [
//         {
//             description:
//                 "Simple, family-friendly 3-star hotel in Calangute close to beaches and local eateries. Good value for families wanting easy beach access.",
//             geo_coordinates: { latitude: 15.54, longitude: 73.757 },
//             hotel_address: "Calangute-Baga Road, Calangute, North Goa",
//             hotel_image_url:
//                 "https://images.unsplash.com/photo-1501117716987-c8e3cbe3e3ff?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2f2f7d9c3b7c493b1ce9b8a5a6f7a2c6",
//             hotel_name: "Ginger Goa - Calangute",
//             price_per_night: "INR 3,000 - 3,800 (family room, approximate)",
//             rating: 4,
//         },
//         {
//             description:
//                 "Mid-range beach resort with family rooms, pool, and easy access to Candolim and Sinquerim beaches. Good balance of comfort and cost.",
//             geo_coordinates: { latitude: 15.49, longitude: 73.768 },
//             hotel_address: "Candolim, North Goa (near Candolim Beach)",
//             hotel_image_url:
//                 "https://images.unsplash.com/photo-1542317854-5e8a7c4c0d0f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=ad3b9a91e1224a9eda2f1f3b3da6f1d6",
//             hotel_name: "Lemon Tree Amarante Beach Resort, Candolim",
//             price_per_night: "INR 4,200 - 5,200 (family room, approximate)",
//             rating: 4.2,
//         },
//         {
//             description:
//                 "Reliable chain hotel with family amenities, breakfast included options, near beaches and convenient for day trips across North Goa.",
//             geo_coordinates: { latitude: 15.4925, longitude: 73.7685 },
//             hotel_address: "Candolim / Calangute area, North Goa",
//             hotel_image_url:
//                 "https://images.unsplash.com/photo-1505691723518-36a4268b7f0f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9f7e3df9efc1b3b3f4b7b1f9d1a3c2a9",
//             hotel_name: "Country Inn & Suites by Radisson, Goa Candolim",
//             price_per_night: "INR 4,500 - 6,000 (family room, approximate)",
//             rating: 4.3,
//         },
//     ],
//     itinerary: [
//         // Day 1
//         {
//             day: 1,
//             day_plan:
//                 "Arrival, check-in, relax at nearby beaches, evening beach shack dinner and sunset",
//             best_time_to_visit_day:
//                 "Afternoon arrival, sunset at beach (late afternoon to early evening)",
//             activities: [
//                 {
//                     place_name: "Calangute Beach",
//                     place_address: "Calangute Beach, Calangute, North Goa",
//                     place_details:
//                         "One of Goa's most popular beaches with shacks, water-sport counters, and a lively family-friendly stretch of sand. Good for a relaxed first afternoon and swimming (watch tides).",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=c5b7f7d3c1b2a9d9b8f6b7e3a4c1d2f3",
//                     best_time_to_visit: "Late afternoon to sunset (around 4:00 PM - 7:00 PM)",
//                     ticket_pricing:
//                         "Free (parking/optional water sports extra: INR 300-1,200 per activity)",
//                     time_travel_each_location: "5-10 mins from Calangute hotel (depending on exact hotel)",
//                     geo_coordinates: { latitude: 15.539, longitude: 73.757 },
//                 },
//                 {
//                     place_name: "Baga Beach & Beach Shacks (e.g., Britto's)",
//                     place_address: "Baga Beach, North Goa (popular shacks along the shoreline)",
//                     place_details:
//                         "Vibrant beach area with family-friendly shacks serving seafood and Goan dishes — ideal for dinner with kids or family. Try seafood thali or Goan fish curry.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6c9d7f4f1a2b3c4d5e6f7a8b9c0d1e2f",
//                     best_time_to_visit: "Evening for dinner and sunset stroll (6:00 PM - 9:00 PM)",
//                     ticket_pricing: "Free (meal cost approx. INR 400-1,200 per person depending on selection)",
//                     time_travel_each_location: "10-15 mins from central Calangute hotels",
//                     geo_coordinates: { latitude: 15.547, longitude: 73.7516 },
//                 },
//             ],
//         },

//         // Day 2
//         {
//             day: 2,
//             day_plan:
//                 "North Goa sightseeing: Fort Aguada, Sinquerim/Candolim beaches, local market stroll and dinner",
//             best_time_to_visit_day: "Morning for Fort & beaches, late afternoon market visit",
//             activities: [
//                 {
//                     place_name: "Fort Aguada & Lighthouse",
//                     place_address: "Fort Aguada, Sinquerim, North Goa",
//                     place_details:
//                         "17th-century Portuguese fort overlooking the Arabian Sea. Great views and a short historical visit. Light entry fee may apply for the lighthouse area.",
//                     place_image_url:
//                         "https://upload.wikimedia.org/wikipedia/commons/7/79/Fort_Aguada_Panaji.jpg",
//                     best_time_to_visit: "Early morning (8:00 AM - 11:00 AM) to avoid midday heat",
//                     ticket_pricing:
//                         "Mostly free; lighthouse/viewpoint small fee: INR 20-50 per person (subject to change)",
//                     time_travel_each_location: "20-30 mins from Calangute/Candolim hotels",
//                     geo_coordinates: { latitude: 15.4817, longitude: 73.7739 },
//                 },
//                 {
//                     place_name: "Sinquerim Beach / Candolim Beach",
//                     place_address: "Sinquerim / Candolim Beach, North Goa",
//                     place_details:
//                         "Quieter beaches ideal for family relaxation and short swims; several beachfront restaurants and water-sports operators nearby.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a0b3a2c9b6e1d5f2c7e9b8a6c4d2e1f",
//                     best_time_to_visit: "Morning or late afternoon (7:30 AM - 10:30 AM or 4:00 PM - 6:30 PM)",
//                     ticket_pricing: "Free (water sports extra: INR 300-1,200 per activity)",
//                     time_travel_each_location: "5-20 mins from Fort Aguada (depending on route)",
//                     geo_coordinates: { latitude: 15.474, longitude: 73.7733 },
//                 },
//                 {
//                     place_name: "Candolim / Baga Local Market & Street Food",
//                     place_address: "Candolim / Baga market strips, North Goa",
//                     place_details:
//                         "Stalls and shops selling souvenirs, spices, and local snacks; great place to try feni-based drinks for adults and local sweets/seafood snacks.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0b9b5b5f9c1a8a8be5d7a4e9fbb1c4d2",
//                     best_time_to_visit: "Late afternoon to early evening (4:00 PM - 7:30 PM)",
//                     ticket_pricing: "Free (shopping costs vary; snacks INR 50-300 per item)",
//                     time_travel_each_location: "10-15 mins from Sinquerim/Calangute",
//                     geo_coordinates: { latitude: 15.493, longitude: 73.765 },
//                 },
//             ],
//         },

//         // Day 3
//         {
//             day: 3,
//             day_plan:
//                 "Cultural day: Old Goa churches, Panaji (Fontainhas Latin Quarter), Mandovi River cruise & local Goan dinner",
//             best_time_to_visit_day:
//                 "Morning for Old Goa (cooler), late afternoon river cruise in Panaji",
//             activities: [
//                 {
//                     place_name: "Basilica of Bom Jesus (Old Goa)",
//                     place_address: "Old Goa (Velha Goa), Bardez/Tiswadi, Goa",
//                     place_details:
//                         "UNESCO-recognized church that houses relics of St. Francis Xavier; an important cultural and historical site in Old Goa.",
//                     place_image_url:
//                         "https://upload.wikimedia.org/wikipedia/commons/3/36/Basilica_of_Bom_Jesus_Goa.jpg",
//                     best_time_to_visit: "Early morning (8:00 AM - 11:00 AM)",
//                     ticket_pricing: "Free entrance; donations welcome. Guided tour fees vary (INR 200-500 if arranged).",
//                     time_travel_each_location: "Approx. 60-75 mins from Calangute/Candolim (by car)",
//                     geo_coordinates: { latitude: 15.4983, longitude: 73.8262 },
//                 },
//                 {
//                     place_name: "Se Cathedral (Old Goa)",
//                     place_address: "Old Goa, Velha Goa, Goa",
//                     place_details:
//                         "One of the largest churches in Asia with Portuguese-era architecture; located close to Basilica of Bom Jesus — combine both in a single Old Goa visit.",
//                     place_image_url:
//                         "https://upload.wikimedia.org/wikipedia/commons/1/17/Se_Cathedral_Old_Goa.jpg",
//                     best_time_to_visit: "Same morning slot as Basilica (8:30 AM - 11:30 AM)",
//                     ticket_pricing: "Free (donations optional)",
//                     time_travel_each_location: "5-10 mins walk from Basilica area",
//                     geo_coordinates: { latitude: 15.4988, longitude: 73.8265 },
//                 },
//                 {
//                     place_name: "Fontainhas (Latin Quarter) - Panaji",
//                     place_address: "Fontainhas, Panaji (Panjim), Goa",
//                     place_details:
//                         "Colorful Portuguese-era neighborhood with narrow lanes, heritage houses, cafes and great photo opportunities. Good for relaxed sightseeing and trying local bakeries/cafes.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1505765053566-6f10efca0a8b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9d6a1f7c4a5b2c3d4e5f6a7b8c9d0e1f",
//                     best_time_to_visit: "Afternoon (2:00 PM - 5:30 PM) or early morning for softer light",
//                     ticket_pricing: "Free (cafe/meals extra: INR 150-600)",
//                     time_travel_each_location: "20-30 mins from Old Goa to Panaji by car",
//                     geo_coordinates: { latitude: 15.4989, longitude: 73.8278 },
//                 },
//                 {
//                     place_name: "Mandovi River Cruise (Panjim Harbour)",
//                     place_address: "Panjim Jetty / Mandovi Riverfront, Panaji",
//                     place_details:
//                         "Short evening river cruise (1 hour) featuring music, dance and scenic views — dolphin or sunset cruises often available in early evening.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1508261304556-2a1f5aa2f6d8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5b1f3f2c4d7a8a9f0b2c3d4e5f6a7b8c",
//                     best_time_to_visit: "Evening for sunset cruise (5:30 PM - 7:30 PM)",
//                     ticket_pricing: "INR 300 - 700 per person (short cruise); premium dinner cruises cost more",
//                     time_travel_each_location: "10-20 mins from Fontainhas within Panaji",
//                     geo_coordinates: { latitude: 15.4909, longitude: 73.8278 },
//                 },
//             ],
//         },

//         // Day 4
//         {
//             day: 4,
//             day_plan:
//                 "Adventure day: choose between Dudhsagar Falls jeep safari (nature/trek) or dolphin-spotting + water-sports (sea adventure)",
//             best_time_to_visit_day:
//                 "Dudhsagar: full-day (early start). Dolphin/watersports: very early morning for dolphin cruise, late morning for watersports.",
//             activities: [
//                 {
//                     place_name: "Dudhsagar Falls (Jeep Safari / Trek)",
//                     place_address:
//                         "Dudhsagar Falls, Mollem / Kulem area (Sanguem taluka), South Goa region",
//                     place_details:
//                         "Spectacular multi-tiered waterfall on the Goa-Karnataka border. Full-day excursion often includes a jeep ride through Mollem forests, short treks and scenic views. Best in/after monsoon (water levels higher).",
//                     place_image_url:
//                         "https://upload.wikimedia.org/wikipedia/commons/3/37/Dudhsagar_Falls.jpg",
//                     best_time_to_visit:
//                         "Early morning departure (6:00 AM - 8:00 AM). Avoid very hot midday and check monsoon accessibility.",
//                     ticket_pricing:
//                         "Jeep safari packages typically INR 1,200 - 5,000 per person (or per vehicle) depending on vehicle size and operator; forest/park permits may apply (INR 50-300).",
//                     time_travel_each_location:
//                         "Approx. 3 - 3.5 hours one-way from Calangute/Candolim by road (full-day trip)",
//                     geo_coordinates: { latitude: 15.3143, longitude: 74.6019 },
//                 },
//                 {
//                     place_name: "Dolphin Spotting Cruise (Baga/Calangute)",
//                     place_address: "Baga / Calangute jetty area (north Goa)",
//                     place_details:
//                         "Early-morning boat trips for dolphin sightings. Good family-friendly activity; follow safety instructions and choose reputed operators.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=c5b7f7d3c1b2a9d9b8f6b7e3a4c1d2f3",
//                     best_time_to_visit: "Very early morning (6:00 AM - 8:30 AM) for highest chance of sightings",
//                     ticket_pricing: "INR 600 - 1,200 per person (depends on operator and season)",
//                     time_travel_each_location: "15-20 mins from central Calangute hotels to the jetty area",
//                     geo_coordinates: { latitude: 15.547, longitude: 73.7516 },
//                 },
//                 {
//                     place_name: "Water Sports (Calangute / Baga)",
//                     place_address: "Calangute / Baga water-sports zones, North Goa",
//                     place_details:
//                         "Family-friendly options include banana boat rides, parasailing (age/height limits apply), bumper rides. Ensure operator provides life jackets and follows safety protocols.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=c5b7f7d3c1b2a9d9b8f6b7e3a4c1d2f3",
//                     best_time_to_visit:
//                         "Mid-morning to early afternoon (8:30 AM - 12:30 PM) for calmer seas; follow operator advice",
//                     ticket_pricing: "INR 300 - 1,500 per person per activity (varies by activity & duration)",
//                     time_travel_each_location: "5-15 mins from hotels in Calangute/Candolim",
//                     geo_coordinates: { latitude: 15.5435, longitude: 73.7532 },
//                 },
//             ],
//         },

//         // Day 5
//         {
//             day: 5,
//             day_plan:
//                 "Relaxed morning at the beach, local shopping (Mapusa / Panaji), pack and depart to Mumbai",
//             best_time_to_visit_day:
//                 "Morning beach time and mid-morning market visit; depart afternoon/evening depending on transport",
//             activities: [
//                 {
//                     place_name: "Mapusa Market (if visiting Friday)",
//                     place_address: "Mapusa Market, Mapusa, Bardez, North Goa",
//                     place_details:
//                         "Traditional local market selling spices, local handicrafts, fresh produce, and Goan food items; ideal for buying souvenirs and spices. Mapusa is busiest on Friday market day.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=af8b7f3a2e6f4d1c2b8a9e7f6c5d4a3b",
//                     best_time_to_visit: "Morning (9:00 AM - 12:00 PM) — markets are liveliest earlier",
//                     ticket_pricing:
//                         "Free entry; shopping costs vary (typical souvenirs INR 100-1,500)",
//                     time_travel_each_location: "Approx. 25-35 mins from Calangute hotels (by car)",
//                     geo_coordinates: { latitude: 15.5667, longitude: 73.819 },
//                 },
//                 {
//                     place_name: "Panjim / MG Road & Local Cafes",
//                     place_address: "MG Road, Panaji (Panjim), Goa",
//                     place_details:
//                         "Last-minute sightseeing in Panaji, stroll along the Mandovi promenade, try local cafes or bakeries for Goan sweets and snacks before departure.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9d1f4b5e6a7c8b3d4e5f6a7b8c9d0e1f",
//                     best_time_to_visit: "Late morning to early afternoon (10:00 AM - 2:00 PM) before departure",
//                     ticket_pricing: "Free (cafes/meals extra: INR 150-700)",
//                     time_travel_each_location: "30-45 mins from Calangute depending on traffic",
//                     geo_coordinates: { latitude: 15.4909, longitude: 73.8278 },
//                 },
//                 {
//                     place_name: "Airport / Railway Transfer to Mumbai",
//                     place_address:
//                         "Dabolim Airport / Madgaon or Thivim railway stations (choose based on booking)",
//                     place_details:
//                         "Allow buffer time for Goa Airport (Dabolim/Goa Intl) check-in or train station departures (Madgaon or Thivim depending on train). Factor in 1-2 hours for travel to the airport/station from North Goa.",
//                     place_image_url:
//                         "https://images.unsplash.com/photo-1517910960331-0b3c2d6a8ddd?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7a8c9b1d2e3f4a5b6c7d8e9f0a1b2c3d",
//                     best_time_to_visit:
//                         "Plan departure 2-3 hours before flight time (domestic) and 1-2 hours before train depending on class",
//                     ticket_pricing: "Flight/train fares vary; taxi to airport INR 1,200 - 2,000 from Calangute (approx.)",
//                     time_travel_each_location: "Approx. 60 - 90 mins to Dabolim Airport from Calangute (allow more during peak traffic)",
//                     geo_coordinates: { latitude: 15.38, longitude: 73.831 },
//                 },
//             ],
//         },
//     ],
// };

// function Itinerary() {
//     //@ts-ignore
//     const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
//     const [tripData, setTripData] = useState<TripInfo | null>(null);

//     useEffect(() => {
//         tripDetailInfo && setTripData(tripDetailInfo);
//     }, [tripDetailInfo])

//     const data = tripData ? [
//         {
//             title: "Recommended Hotels",
//             content: (
//                 <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
//                     {tripData?.hotels.map((hotel, index) => (
//                         <HotelCardItem hotel={hotel} />
//                     ))}
//                 </div>
//             ),
//         },
//         ...tripData?.itinerary.map((dayData) => ({
//             title: `Day ${dayData?.day}`,
//             content: (
//                 <div>
//                     <p>Best Time :{dayData?.best_time_to_visit_day}</p>
//                     <div className='grid grid-cols-1 md:Grid-cols-2 gap-4'>
//                         {dayData?.activities.map((activity, index) => (
//                             <PlaceCardItem activity={activity} />
//                         ))}
//                     </div>
//                 </div>
//             )
//         })),

//     ] : [];
//     return (
//         <div className="relative w-full h-[83vh] overflow-auto">
//             {/* @ts-ignore */}
//             {tripData ? <Timeline data={data} tripData={tripData} />
//             :
//             <div>
//                 <Image src={'/travel.png'} alt='travel' width={'800'} height={'800'}
//                     className='w-full h-full object-cover rounded-3xl'
//                 />
//                 <h2 className='flex gap-2 text-3xl text-white left-20 items-center absolute bottom-20'><ArrowLeft />Getting to know you to build perfect trip here...</h2>

//             </div>
//             }
//         </div>
//     );
// }



// export default Itinerary

function Itinerary() {
    // @ts-ignore
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
    const [tripData, setTripData] = useState<TripInfo | null>(null);

    useEffect(() => {
        console.log("tripDetailInfo from context:", tripDetailInfo);
        tripDetailInfo && setTripData(tripDetailInfo);
    }, [tripDetailInfo]);

    const data = tripData
        ? [
            {
                title: "Recommended Hotels",
                content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tripData.hotels.map((hotel: Hotel, index: number) => (
                            <HotelCardItem key={index} hotel={hotel} />
                        ))}
                    </div>
                ),
            },
            ...tripData.itinerary.map((dayData: Itinerary) => ({
                title: `Day ${dayData.day}`,
                content: (
                    <div>
                        <p>Best Time :{dayData.best_time_to_visit_day}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dayData.activities.map((activity: Activity, index: number) => (
                                <div key={index}>
                                    <PlaceCardItem key={index} activity={activity} />

                                    <h2 className="font-semibold text-lg">{activity.place_name}</h2>
                                    <p className="text-gray-500 line-clamp-2">{activity.place_details}</p>
                                    <h2 className="flex gap-2 text-blue-500 line-clamp-1">
                                        <Ticket /> {String(activity.ticket_pricing)}
                                    </h2>
                                    <p className="flex text-orange-400 gap-2">
                                        <Clock /> {activity.time_travel_each_location}
                                    </p>
                                    <p>
                                        <Timer /> {activity.best_time_to_visit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ),
            })),
        ]
        : [];

    return (
        <div className="relative w-full h-[83vh] overflow-auto">
            {/* @ts-ignore */}
            {tripData ? (
                <Timeline data={data} tripData={tripData} />
            ) : (
                <div>
                    <Image
                        src={"/travel.png"}
                        alt="travel"
                        width={800}
                        height={800}
                        className="w-full h-full object-cover rounded-3xl"
                    />
                    <h2 className="flex gap-2 text-3xl text-white left-20 items-center absolute bottom-20">
                        <ArrowLeft /> Getting to know you to build perfect trip here...
                    </h2>
                </div>
            )}
        </div>
    );
}

export default Itinerary;
