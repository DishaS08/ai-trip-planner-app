import { NextResponse } from "next/server";

// ============================================
// FREE Image APIs: Unsplash → Teleport → Pexels
// No billing required - 100% free
// ============================================

const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800";

// --- Unsplash API (FREE - 50 requests/hour) ---
async function tryUnsplash(placeName: string): Promise<string | null> {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
        return null; // Silently skip if no key
    }

    try {
        let searchTerm = placeName.split(":")[0].split(",")[0].trim();

        const isIndianPlace = ["india", "uttarakhand", "maharashtra", "kerala", "goa", "rajasthan", "delhi", "mumbai", "karnataka", "tamil", "gujarat", "punjab", "bengal", "himachal", "kashmir"]
            .some(s => placeName.toLowerCase().includes(s));

        const query = isIndianPlace ? `${searchTerm} india` : searchTerm;

        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;

        const res = await fetch(url, {
            headers: { Authorization: `Client-ID ${accessKey}` },
            cache: "no-store",
        });

        if (!res.ok) return null;

        const data = await res.json();
        const results = data.results || [];

        if (results.length === 0) return null;

        const photo = results[0];
        console.log(`[Image] ✓ Unsplash found: ${searchTerm}`);
        return photo?.urls?.regular || photo?.urls?.small || null;

    } catch {
        return null;
    }
}

// --- Teleport API (FREE - No API key needed!) ---
async function tryTeleport(placeName: string): Promise<string | null> {
    try {
        // Extract city name
        let cityName = placeName.split(":")[0].split(",")[0].trim().toLowerCase();

        // Replace spaces with hyphens for URL
        cityName = cityName.replace(/\s+/g, "-");

        // Teleport uses slugs like "new-york", "san-francisco"
        const url = `https://api.teleport.org/api/urban_areas/slug:${cityName}/images/`;

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) return null;

        const data = await res.json();
        const photos = data.photos || [];

        if (photos.length === 0) return null;

        // Get web resolution image
        const imageUrl = photos[0]?.image?.web || photos[0]?.image?.mobile;

        if (imageUrl) {
            console.log(`[Image] ✓ Teleport found: ${cityName}`);
            return imageUrl;
        }

        return null;
    } catch {
        return null;
    }
}

// --- Pexels API (FREE - 200 requests/hour) ---
async function tryPexels(placeName: string): Promise<string | null> {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) return null;

    try {
        let searchTerm = placeName.split(":")[0].split(",")[0].trim();

        // Remove generic words
        const removeWords = ["station", "airport", "railway", "bus", "temple"];
        for (const word of removeWords) {
            searchTerm = searchTerm.replace(new RegExp(`\\b${word}\\b`, "gi"), "").trim();
        }

        if (searchTerm.length < 3) {
            searchTerm = placeName.split(":")[0].split(",")[0].trim();
        }

        const isIndianPlace = ["india", "uttarakhand", "maharashtra", "kerala", "goa", "rajasthan"]
            .some(s => placeName.toLowerCase().includes(s));

        const query = isIndianPlace ? `${searchTerm} india tourism` : `${searchTerm} travel`;

        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;

        const res = await fetch(url, {
            headers: { Authorization: apiKey },
            cache: "no-store",
        });

        if (!res.ok) return null;

        const data = await res.json();
        const photos = data.photos || [];

        if (photos.length === 0) return null;

        console.log(`[Image] ✓ Pexels found: ${searchTerm}`);
        return photos[0]?.src?.large || photos[0]?.src?.medium || null;

    } catch {
        return null;
    }
}

// --- SerpAPI (Freemium - Limited requests) ---
async function trySerpApi(placeName: string): Promise<string | null> {
    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey) return null;

    try {
        const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(placeName)}&api_key=${apiKey}`;
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) return null;

        const data = await res.json();
        const images = data.images_results || [];

        if (images.length === 0) return null;

        console.log(`[Image] ✓ SerpAPI found: ${placeName}`);
        return images[0]?.original || images[0]?.thumbnail || null;
    } catch (e) {
        console.error("[Image] SerpAPI error:", e);
        return null;
    }
}

// --- Main API Route ---
export async function POST(req: Request) {
    try {
        const { placeName } = await req.json();

        if (!placeName || typeof placeName !== "string") {
            return NextResponse.json({ error: "Missing or invalid placeName" }, { status: 400 });
        }

        // 1. Try Unsplash (FREE, requires key)
        const unsplashUrl = await tryUnsplash(placeName);
        if (unsplashUrl) {
            return NextResponse.json({ imageUrl: unsplashUrl, source: "unsplash" });
        }

        // 2. Try Pexels (FREE, requires key) - Improved priority
        const pexelsUrl = await tryPexels(placeName);
        if (pexelsUrl) {
            return NextResponse.json({ imageUrl: pexelsUrl, source: "pexels" });
        }

        // 3. Try Teleport (FREE, NO key needed! Great for major cities)
        const teleportUrl = await tryTeleport(placeName);
        if (teleportUrl) {
            return NextResponse.json({ imageUrl: teleportUrl, source: "teleport" });
        }

        // 4. Try SerpAPI (Paid/Limited - Good for specific places)
        // Check if we hit the limit or have a key
        const serpApiUrl = await trySerpApi(placeName);
        if (serpApiUrl) {
            return NextResponse.json({ imageUrl: serpApiUrl, source: "serpapi" });
        }

        // 5. Default placeholder
        return NextResponse.json({ imageUrl: DEFAULT_PLACEHOLDER, source: "placeholder" });

    } catch (error: unknown) {
        let message = "Unknown error";
        if (error instanceof Error) message = error.message;
        console.error("[Image] Error:", message);
        return NextResponse.json({ imageUrl: DEFAULT_PLACEHOLDER, source: "error" });
    }
}
