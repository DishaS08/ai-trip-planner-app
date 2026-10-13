
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
8. Do not invent certainty: identify estimates as estimates where necessary.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, isFinal, mode } = body ?? {};

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

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages must be an array." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://ai-trip-planner-app-five.vercel.app",
        "X-Title": "AI Trip Planner",
      },
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

    if (cleanMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid conversation messages were provided." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            systemPrompt +
            "\nReturn a JSON object only. Do not include safety labels, explanations, Markdown, or text outside the JSON.",
        },
        ...cleanMessages,
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText || !responseText.trim()) {
      console.error("OpenRouter returned an empty response.", {
        model: completion.model,
        finishReason: completion.choices[0]?.finish_reason,
      });

      return NextResponse.json(
        {
          error: "The AI provider returned an empty response. Please retry.",
          model: completion.model,
        },
        { status: 502 }
      );
    }

    const cleanedResponse = responseText
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "");

    let result: any;

    try {
      result = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("AI returned invalid JSON.", {
        model: completion.model,
        finishReason: completion.choices[0]?.finish_reason,
        parseError:
          parseError instanceof Error
            ? parseError.message
            : "Unknown JSON parsing error",
        responsePreview: responseText.slice(0, 1000),
      });

      return NextResponse.json(
        {
          error:
            "The AI returned an invalid JSON response. Please retry.",
          model: completion.model,
        },
        { status: 502 }
      );
    }

    if (
      !result ||
      typeof result !== "object" ||
      Array.isArray(result)
    ) {
      return NextResponse.json(
        { error: "The AI response was not a valid JSON object." },
        { status: 502 }
      );
    }

    if (isFinal && !result.trip_plan) {
      console.error("Final AI response is missing trip_plan.", {
        model: completion.model,
        responsePreview: JSON.stringify(result).slice(0, 1000),
      });

      return NextResponse.json(
        {
          error: "The AI response did not contain a trip_plan. Please retry.",
          model: completion.model,
        },
        { status: 502 }
      );
    }

    if (
      !isFinal &&
      (typeof result.resp !== "string" ||
        typeof result.ui !== "string")
    ) {
      console.error("AI response is missing resp or ui.", {
        model: completion.model,
        responsePreview: JSON.stringify(result).slice(0, 1000),
      });

      return NextResponse.json(
        {
          error: "The AI response did not match the expected chat format.",
          model: completion.model,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    const status =
      typeof error?.status === "number" &&
      error.status >= 400 &&
      error.status <= 599
        ? error.status
        : 502;

    console.error("OpenRouter route error:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      type: error?.type,
      providerError: error?.error,
    });

    return NextResponse.json(
      {
        error: "The AI provider request failed.",
        details:
          typeof error?.message === "string"
            ? error.message
            : "Unknown provider error",
        status,
      },
      { status }
    );
  }
}
