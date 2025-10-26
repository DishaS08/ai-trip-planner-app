// import { NextResponse, NextRequest } from 'next/server';
// import OpenAI from 'openai';
// import { aj } from "../arcjet/route";
// import { currentUser } from "@clerk/nextjs/server";
// import { auth } from '@clerk/nextjs/server'
// export const openai = new OpenAI({
//   baseURL: 'https://openrouter.ai/api/v1',
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

// const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
// Only ask questions about the following details in order, and wait for the user's answer before asking the next:

// 1. Starting location (source)
// 2. Destination city or country
// 3. Group size (Solo, Couple, Family, Friends)
// 4.Budget (Low, Medium, High)
// 5. Trip duration (number of days)
// 6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)
// 7. Special requirements or preferences (if any)
// Do not ask multiple questions at once, and never ask irrelevant questions.
// If any answer is missing or unclear, politely ask the user to clarify before proceeding.
// Always maintain a conversational, interactive style while asking questions.
// Along with response also send which ui component to display for generative UI for example 'budget/groupSize/TripDuration/Final', where Final means AI generating complete final output
// Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with following JSON schema:
// {
// resp:'Text Resp',
// // ui:'budget/groupSize/tripDuration/final)'

// }`

// const FINAL_PROMPT = `Generate Travel Plan with give details, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates,Place address, ticket Pricing, Time travel each of the location , with each day plan with best time to visit in JSON format. Output Schema:
// {
//   "trip_plan": {
//     "destination": "string",
//     "duration": "string",
//     "origin": "string",
//     "budget": "string",
//     "group_size": "string",
//     "hotels": [
//       {
//         "hotel_name": "string",
//         "hotel_address": "string",
//         "price_per_night": "string",
//         "hotel_image_url": "string",
//         "geo_coordinates": {
//           "latitude": "number",
//           "longitude": "number"
//         },
//         "rating": "number",
//         "description": "string"
//       }
//     ],
//     "itinerary": [
//       {
//         "day": "number",
//         "day_plan": "string",
//         "best_time_to_visit_day": "string",
//         "activities": [
//           {
//             "place_name": "string",
//             "place_details": "string",
//             "place_image_url": "string",
//             "geo_coordinates": {
//               "latitude": "number",
//               "longitude": "number"
//             },
//             "place_address": "string",
//             "ticket_pricing": "string",
//             "time_travel_each_location": "string",
//             "best_time_to_visit": "string"
//           }
//         ]
//       }
//     ]
//   }
// }`

// export async function POST(req: Request) {
//   const { messages, isFinal } = await req.json();
//   const user = await currentUser();
//   const { has } = await auth();
//   const hasPremiumAccess = has({ plan: 'monthly' });
//   console.log("hasPremiumAccess", hasPremiumAccess);

//   const decision = await aj.protect(req, { userId: user?.primaryEmailAddress?.emailAddress ?? '', requested: isFinal ? 5 : 0 }); // Deduct 5 tokens from the bucket

//   // console.log(decision);
//   //@ts-ignore
//   if (decision?.reason?.remaining == 0 && !hasPremiumAccess) {
//     return NextResponse.json({
//       resp: "No Free Credit Remaining",
//       ui: "limit"
//     })
//   }
//   try {
//     const completion = await openai.chat.completions.create({
//       model: 'openai/gpt-5-mini',
//       response_format: { type: "json_object" },
//       messages: [
//         {
//           role: "system",
//           content: isFinal ? FINAL_PROMPT : PROMPT
//         },
//         ...messages
//       ],
//     });
//     console.log(completion.choices[0].message);
//     const message = completion.choices[0].message;
//     return NextResponse.json(JSON.parse(message.content ?? ''));
//   }
//   catch (e) {
//     return NextResponse.json(e);
//   }
// }














import { NextResponse } from "next/server";

const PROMPT = `
You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time, in this strict order:
1. Starting location (source) — ui: "origin"
2. Destination city or country — ui: "destination"
3. Group size (Solo, Couple, Family, Friends) — ui: "groupSize"
4. Budget (Low, Medium, High) — ui: "budget"
5. Trip duration (number of days) — ui: "tripduration"
6. Travel interests (adventure, sightseeing, cultural, food, nightlife, relaxation, etc.) — ui: "interests"
For each step, respond with: { resp: "...your question...", ui: "<corresponding_ui>" }
Never ask multiple questions at once and never repeat a step that's already answered.
Once ALL are answered, respond with { resp: "Generating your trip plan...", ui: "final" }.
On the next request with isFinal:true, generate and return ONLY the JSON plan as described in FINAL_PROMPT, with no extra text.
`;

const FINAL_PROMPT = `
Generate a Travel Plan (trip_plan) as strict JSON using this schema:
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": { "latitude": "number", "longitude": "number" },
        "rating": "number",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": { "latitude": "number", "longitude": "number" },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}
Output ONLY the JSON object. No extra text.
`;

type Message = { role: string; content: string; };

export async function POST(req: Request) {
  const { messages, isFinal } = await req.json();
  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "Messages cannot be empty" }, { status: 400 });
  }
  try {
    const sanitized = messages.map((m: Message) => ({
      role: m.role,
      content: m.content,
    }));
    const promptToUse = isFinal ? FINAL_PROMPT : PROMPT;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: promptToUse },
          ...sanitized,
        ],
        response_format: { type: "json_object" }
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Groq error:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }
    let message = data.choices?.[0]?.message?.content;
    let json;
    try {
      json = JSON.parse(message);
    } catch {
      json = { resp: message };
    }
    return NextResponse.json(json);
  } catch (e: any) {
    console.error("Route Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
