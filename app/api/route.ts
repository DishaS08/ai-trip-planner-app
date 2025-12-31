// app/api/unsplash/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
        return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}&per_page=6`;
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json({ photos: data.results });
}
