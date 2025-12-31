# AI Trip Planner ✈️

**AI-Powered Trip Planning** with conversational AI, interactive maps, and personalized itineraries. Built with Next.js, TypeScript, Convex, and GROQ API.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://ai-trip-planner-app.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## ✨ Features

- 🤖 **AI Chatbot** - GROQ-powered assistant with 4 trip modes (Standard, Inspire Me, Hidden Gems, Adventure)
- 🗺️ **Interactive Maps** - MapLibre GL with synchronized markers and click-to-zoom
- 🖼️ **Smart Image Fetching** - Multi-API fallback (Unsplash → Pexels → Teleport → SerpAPI)
- 📅 **Detailed Itineraries** - Day-by-day plans with activities, hotels, dining, and local tips
- 🔐 **Secure Auth** - Clerk authentication with Google OAuth
- 💾 **Trip Management** - Save, view, and share trips via Convex database
- 🎨 **Modern UI** - Responsive design with dark mode and smooth animations

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16.1, TypeScript, Tailwind CSS 4.0, MapLibre GL  
**Backend:** Convex (Database), Clerk (Auth), GROQ API (AI)  
**APIs:** Unsplash, Pexels, Teleport, SerpAPI

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- API keys for: GROQ/OpenAI, Clerk, Convex, Unsplash

### Installation

```bash
# Clone the repo
git clone https://github.com/DishaS08/ai-trip-planner-app.git
cd ai-trip-planner

# Install dependencies
npm install

# Set up environment variables (see below)
# Create .env.local with required keys

# Initialize Convex
npx convex dev

# Run development server
npm run dev
```

Visit `http://localhost:3002`

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
# Required
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
GROQ_API_KEY=your_groq_key              # or OPENAI_API_KEY
UNSPLASH_ACCESS_KEY=your_unsplash_key

# Optional
PEXELS_API_KEY=your_pexels_key
SERP_API_KEY=your_serp_key
ARCJET_KEY=your_arcjet_key
```

**Where to get keys:**
- [GROQ](https://console.groq.com) - Free AI API
- [Clerk](https://clerk.com) - Authentication
- [Convex](https://convex.dev) - Database
- [Unsplash](https://unsplash.com/developers) - Images

---

## � Usage

1. **Sign Up** - Create account with email or Google
2. **Choose Trip Mode**:
   - 🗺️ Standard - Plan trips to specific destinations
   - ✨ Inspire Me - AI suggests destinations
   - 🏛️ Hidden Gems - Discover off-beat locations
   - 🏔️ Adventure - Find adventure destinations
3. **Chat with AI** - Answer questions about your preferences
4. **Get Itinerary** - View personalized day-by-day plans
5. **Explore Map** - Click places to see details and locations
6. **Save & Share** - Access trips anytime from My Trips

---

## 📂 Project Structure

```
ai-trip-planner/
├── app/
│   ├── api/                    # API routes (AI model, image fetching)
│   ├── create-new-trip/        # Trip creation with ChatBox & Map
│   ├── my-trips/               # Trip dashboard
│   ├── view-trip/[tripid]/     # Individual trip view
│   └── layout.tsx              # Root layout
├── components/ui/              # Reusable UI components
├── convex/                     # Database schema & queries
├── public/                     # Static assets
└── .env.local                  # Environment variables
```

---

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

**Important:** Add `CONVEX_DEPLOY_KEY` and all other env vars in Vercel settings.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Credits

Built with GROQ, Convex, Clerk, Unsplash, Pexels, and MapLibre GL.

---

**Made with ❤️ by [Disha Suryawanshi](https://github.com/DishaS08)**
