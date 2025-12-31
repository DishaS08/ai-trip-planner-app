"use client";
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';
import Provider from './provider';
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
console.log("🔍 Convex URL:", convexUrl);

if (!convexUrl) {
    console.error("❌ CRITICAL: NEXT_PUBLIC_CONVEX_URL is undefined!");
    throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is required");
}

const convex = new ConvexReactClient(convexUrl);
export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return <ConvexProvider client={convex}>
        <Provider>
            {children}
        </Provider>
    </ConvexProvider>;
}

