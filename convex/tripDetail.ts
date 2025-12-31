import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ------------------ CREATE TRIP DETAIL ------------------
export const CreateTripDetail = mutation({
    args: {
        tripId: v.string(),
        uid: v.string(),
        tripDetail: v.any(),
    },
    handler: async (ctx, args) => {
        console.log("CreateTripDetail Called!");
        console.log("UID:", args.uid);
        console.log("TripID:", args.tripId);
        console.log("TripDetail Data Size:", JSON.stringify(args.tripDetail)?.length);

        const newId = await ctx.db.insert("TripDetailTable", {
            tripDetail: args.tripDetail,
            tripId: args.tripId,
            uid: args.uid,
        });
        console.log("Inserted new TripDetail with ID:", newId);
    },
});

// ------------------ VIEW TRIP BY ID ------------------
export const ViewTripById = query({
    args: {
        uid: v.string(),
        tripid: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query("TripDetailTable")
            .filter(q => q.eq(q.field("uid"), args.uid))
            .order("desc")
            .collect();
        return result[0];
    },
});

// ------------------ GET TRIP BY ID ------------------
export const GetTripById = query({
    args: {
        uid: v.string(),
        tripid: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query("TripDetailTable")
            .filter(q =>
                q.and(
                    q.eq(q.field("uid"), args.uid),
                    q.eq(q.field("tripId"), args.tripid)
                )
            )
            .collect();
        return result[0];
    },
});

// ------------------ GET USER TRIPS ------------------
export const GetUserTrips = query({
    args: {
        uid: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query("TripDetailTable")
            .filter(q => q.eq(q.field("uid"), args.uid))
            .collect();
        return result;
    },
});
