
import { NextResponse } from "next/server";
import OpenAI from "openai";

const BASE_SYSTEM_PROMPT = `
You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking relevant questions one by one.
`;

const DEFAULT_STEPS = `
Extract known details from the conversation. If missing, ask these questions in this order:
1. Starting location (source) — ui: "origin"
2. Destination city or country — ui: "destination"
3. Group size (Solo, Couple, Family, Friends) — ui: "groupSize"
4. Budget (Low, Medium, High) — ui: "budget"
5. Trip duration (number of days) — ui: "tripduration"
6. Travel interests (adventure, sightseeing, cultural, food, nightlife, relaxation, etc.) — ui: "interests"

IMPORTANT: If the user has already provided the simplified info (e.g. "Trip to Paris from London"), DO NOT ask for Origin or Destination again. Skip directly to the next missing question.
`;

const SUGGESTION_STEPS = `
Ask these questions in this strict order (SKIP asking for Destination and Origin):
1. Group size (Solo, Couple, Family, Friends) — ui: "groupSize"
2. Budget (Low, Medium, High) — ui: "budget"
3. Trip duration (number of days) — ui: "tripduration"
4. Travel interests (adventure, sightseeing, cultural, food, nightlife, relaxation, etc.) — ui: "interests"

IMPORTANT: You must NOT ask for the destination or origin. You will choose a destination yourself based on the user's answers and the Trip Mode.
`;

const INSTRUCTION_SUFFIX = `
For each step, respond with a valid JSON object: { "resp": "...your question...", "ui": "<corresponding_ui>" }
Never ask multiple questions at once and never repeat a step that's already answered.
Once ALL required questions are answered, respond with { "resp": "Generating your trip plan...", "ui": "final" }.
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
    "hotels": [],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "must_try_food": ["string"],
        "local_transport": "string",
        "travel_tips": ["string"],
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": { "latitude": 12.34, "longitude": 56.78 },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string",
            "famous_features": ["string"]
          }
        ],
        "suggested_hotels": [
          {
            "hotel_name": "string",
            "hotel_address": "string",
            "price_per_night": "string",
            "hotel_image_url": "string",
            "geo_coordinates": { "latitude": 12.34, "longitude": 56.78 },
            "rating": 4.5,
            "description": "string"
          }
        ]
      }
    ]
  }
}
Output ONLY the JSON object.

IMPORTANT RULES FOR GENERATION:
1. TRIP DURATION (CRITICAL):
   - Generate an itinerary for the EXACT number of days requested.
   - If the user asks for 7 days, output Day 1 through Day 7.
   - Do NOT summarize or cut it short.

2. itinerary:
   - day_plan: A short theme for the day.
   - best_time_to_visit_day: The best season/weather for this day's plan.
   - must_try_food: List 2 specific local dishes.
   - local_transport: Best way to get around.

3. activities (GAP-LESS FULL DAY SCHEDULE):
   - Generate a continuous schedule from 08:00 AM to the destination's comfort end time.
   - Nightlife cities: extend to 11:00 PM or 12:00 AM.
   - Quiet/early cities: end around 8:00 PM or 9:00 PM.
   - Avoid time gaps between activities.
   - best_time_to_visit format: "HH:MM AM - HH:MM PM".
   - Include travel or relaxation entries to fill gaps.
   - Include breakfast, lunch, and dinner.

4. suggested_hotels:
   - Cheap: Under $50/night.
   - Moderate: $50-$150/night.
   - Luxury: $150+/night.
   - Match the user's selected budget.
   - Provide 3 options per day.
   - description: Maximum 10 words.

5. geo_coordinates: Provide real coordinates.
6. ticket_pricing: Estimate prices in local currency.
7. time_travel_each_location: Travel time from the previous location.
`;

export async function POST(req: Request) {
  try {
    const { messages, isFinal, mode } = await req.json();

    // OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not configured");

      return NextResponse.json(
        { error: "Server configuration error: OPENROUTER_API_KEY is missing. Add it in Vercel Environment Variables." },
        { status: 500 }
      );
    }

    // Connect to OpenRouter using the OpenAI SDK
    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const cleanMessages = messages
      ?.map((msg: any) => ({
        role: msg.role === "ui" ? "user" : msg.role,
        content: msg.content,
      }))
      .filter((msg: any) =>
        ["user", "assistant", "system"].includes(msg.role)
      ) || [];

    // Select prompt based on trip mode
    let systemPrompt = BASE_SYSTEM_PROMPT;

    if (mode === "inspire") {
      systemPrompt += `\nTRIP MODE: INSPIRE ME. The user has no specific destination. You must suggest a great destination based on their preferences.\n${SUGGESTION_STEPS}`;
    } else if (mode === "hidden-gems") {
      systemPrompt += `\nTRIP MODE: HIDDEN GEMS. The user wants to discover off-beat, non-touristy locations. Suggest a hidden gem destination.\n${SUGGESTION_STEPS}`;
    } else if (mode === "adventure") {
      systemPrompt += `\nTRIP MODE: ADVENTURE. The user seeks thrill and adventure. Suggest a destination known for adventure sports or activities.\n${SUGGESTION_STEPS}`;
    } else {
      systemPrompt += `\nTRIP MODE: STANDARD. The user will specify a destination.\n${DEFAULT_STEPS}`;
    }

    systemPrompt += INSTRUCTION_SUFFIX;

    if (isFinal) {
      systemPrompt = FINAL_PROMPT;
    }

    const systemMessage = {
      role: "system" as const,
      content: systemPrompt,
    };

    const completion = await openai.chat.completions.create({
      messages: [systemMessage, ...cleanMessages],
      model: "openrouter/free",
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: "No response from the AI provider." },
        { status: 500 }
      );
    }

    const json = JSON.parse(responseText);

    return NextResponse.json(json);
  } catch (e: any) {
    console.error("OpenRouter route error:", e);

    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
