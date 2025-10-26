// import axios from "axios";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     const { placeName } = await req.json();
//     const BASE_URL = "https://places.googleapis.com/v1/places:SearchText";
//     const config = {
//         headers: {
//             "Content-Type": "application/json",
//             "X.Goog-Api-Key": process?.env?.GOOGLE_API_KEY,
//             "X-Goog-FieldMask": [
//                 "places.photos",
//                 "places.dispalyName",
//                 "places.id"
//             ]
//         }
//     };
//     try {
//         const result = await axios.post(BASE_URL, {
//             textQuery: placeName
//         },
//             config);

//         const placeRefName=result?.data?.places[0]?.photos[0]?.name;
//         const PhotoRefUrl = `https://places.googleapis.com/v1/${placeRefName}/media?mazHeightPx=1000&maxWidthPx=1000&key=${process?.env?.GOOGLE_API_KEY}`;
//         return NextResponse.json(PhotoRefUrl);
//     }
//     catch (e) {
//         return NextResponse.json({ error: e });
//     }
// }








import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { placeName } = await req.json();

        if (!placeName || typeof placeName !== "string") {
            return NextResponse.json({ error: "Missing or invalid placeName" }, { status: 400 });
        }

        if (!process.env.UNSPLASH_ACCESS_KEY) {
            console.error("Missing UNSPLASH_ACCESS_KEY env variable");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&per_page=6`;

        const response = await fetch(unsplashUrl, {
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Unsplash API error", response.status, errorText);
            return NextResponse.json({ error: "Unsplash API error" }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json({ photos: data.results || [] });
    } catch (error: unknown) {
        let message = "Unknown error";
        if (error instanceof Error) message = error.message;
        else if (typeof error === "string") message = error;
        console.error("API error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
