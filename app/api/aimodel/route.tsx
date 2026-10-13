
import { NextResponse } from "next/server";
import OpenAI from "openai";

const BASE_SYSTEM_PROMPT = `
You are an AI Trip Planner Agent. Ask the user relevant questions one at a time.
`;

const DEFAULT_STEPS = `
Extract known details from the conversation. Ask only missing questions in this order:
1. Starting location — ui: "origin"
2. Destination city or country — ui: "destination"
3. Group size (Solo, Couple, Family, Friends) — ui: "groupSize"
4. Budget (Low, Medium, High) — ui: "budget"
5. Trip duration in days — ui: "tripduration"
6. Travel interests — ui: "interests"

Do not repeat questions the user has already answered.
`;

const SUGGESTION_STEPS = `
Ask only missing questions in this order:
1. Group size — ui: "groupSize"
2. Budget — ui: "budget"
3. Trip duration in days — ui: "tripduration"
4. Travel interests — ui: "interests"

Do not ask for origin or destination. Choose a destination based on the user's answers and trip mode.
`;

const INSTRUCTION_SUFFIX = `
Return ONLY a valid JSON object in this format:
{"resp":"your question","ui":"corresponding_ui"}
Ask one question at a time. Never repeat an answered question.
When all required answers are available, return:
{"resp":"Generating your trip plan...","ui":"final"}
`;

const FINAL_PROMPT = `
Generate a complete travel plan as a strict JSON object using this structure:
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
            "geo_coordinates": {
              "latitude": 12.34,
              "longitude": 56.78
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "HH:MM AM - HH:MM PM",
            "famous_features": ["string"]
          }
        ],
        "suggested_hotels": [
          {
            "hotel_name": "string",
            "hotel_address": "string",
            "price_per_night": "string",
            "hotel_image_url": "string",
            "geo_coordinates": {
              "latitude": 12.34,
              "longitude": 56.78
            },
            "rating": 4.5,
            "description": "Maximum 10 words"
          }
        ]
      }
    ]
  }
}
Rules:
1. Generate exactly the number of days requested.
2. Create a continuous daily schedule, normally starting at 08:00 AM.
3. Include meals, travel, and relaxation where appropriate.
4. Include two specific local dishes per day.
5. Suggest three hotels per day matching the selected budget:
   Cheap: under $50/night.
   Moderate: $50-$150/night.
   Luxury: over $150/night.
6. Provide realistic coordinates, local-currency ticket estimates, and travel times.
7. Output ONLY valid JSON without Markdown or code fences.
`;

const FREE_MODELS = [
  "openrouter/free",
  "openai/gpt-oss-120b:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

export async function POST(req: Request) {
  try {
    const { messages, isFinal, mode } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages must be an array." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENROUTER_API_KEY is missing from Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    let systemPrompt = BASE_SYSTEM_PROMPT;

    if (mode === "inspire") {
      systemPrompt +=
        "\nTRIP MODE: INSPIRE ME. Recommend a destination based on the user's preferences.\n" +
        SUGGESTION_STEPS;
    } else if (mode === "hidden-gems") {
      systemPrompt +=
        "\nTRIP MODE: HIDDEN GEMS. Recommend an offbeat, less-touristy destination.\n" +
        SUGGESTION_STEPS;
    } else if (mode === "adventure") {
      systemPrompt +=
        "\nTRIP MODE: ADVENTURE. Recommend a destination known for adventure activities.\n" +
        SUGGESTION_STEPS;
    } else {
      systemPrompt +=
        "\nTRIP MODE: STANDARD. The user will specify a destination.\n" +
        DEFAULT_STEPS;
    }

    systemPrompt += INSTRUCTION_SUFFIX;

    if (isFinal) {
      systemPrompt = FINAL_PROMPT;
    }

    const cleanMessages = messages
      .filter(
        (msg: any) =>
          msg &&
          ["user", "assistant", "ui"].includes(msg.role) &&
          typeof msg.content === "string" &&
          msg.content.trim().length > 0
      )
      .map((msg: any) => ({
        role: (msg.role === "ui" ? "user" : msg.role) as
          | "user"
          | "assistant",
        content: msg.content,
      }));

    const errors: string[] = [];

    for (const model of FREE_MODELS) {
      try {
        console.log(`Trying free AI model: ${model}`);

        const completion = await client.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...cleanMessages,
          ],
          response_format: { type: "json_object" },
        });

        const responseText =
          completion.choices[0]?.message?.content;

        if (!responseText || !responseText.trim()) {
          errors.push(`${model}: empty response`);
          continue;
        }

        const cleanedResponse = responseText
          .trim()
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/i, "");

        try {
          const result = JSON.parse(cleanedResponse);

          // Validate the response shape expected by the frontend.
          if (
            isFinal &&
            (!result.trip_plan ||
              typeof result.trip_plan !== "object")
          ) {
            errors.push(`${model}: missing trip_plan in JSON`);
            continue;
          }

          if (
            !isFinal &&
            (typeof result.resp !== "string" ||
              typeof result.ui !== "string")
          ) {
            errors.push(`${model}: missing resp/ui in JSON`);
            continue;
          }

          console.log(`Successful AI response from: ${model}`);
          return NextResponse.json(result);
        } catch {
          errors.push(`${model}: response was not valid JSON`);
          console.error(`Invalid JSON returned by ${model}:`, {
            responsePreview: responseText.slice(0, 300),
          });
        }
      } catch (error: any) {
        const message =
          error?.message || "Unknown provider error";

        errors.push(
          `${model}: ${message}`
        );

        console.error(`Free model failed: ${model}`, {
          message,
          status: error?.status,
          code: error?.code,
        });
      }
    }

    // No hardcoded itinerary: report the actual model failures.
    console.error("All free AI models failed:", errors);

    return NextResponse.json(
      {
        error:
          "All configured free AI models failed. Please retry shortly.",
        details: errors,
      },
      { status: 502 }
    );
  } catch (error: any) {
    console.error("Trip planner route error:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
    });

    const status =
      typeof error?.status === "number" &&
      error.status >= 400 &&
      error.status < 600
        ? error.status
        : 500;

    return NextResponse.json(
      {
        error:
          error?.message || "An unexpected trip planner error occurred.",
      },
      { status }
    );
  }
}
