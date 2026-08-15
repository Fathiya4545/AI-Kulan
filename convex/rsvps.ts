import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Has this user joined this event? Drives the Join / Leave button state.
export const isJoined = query({
  args: { eventId: v.string(), userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return false;
    const userId = args.userId;

    const eventId = ctx.db.normalizeId("events", args.eventId);
    if (!eventId) return false;

    const rsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_user_and_event", (q) =>
        q.eq("userId", userId).eq("eventId", eventId)
      )
      .unique();

    return rsvp !== null;
  },
});

// Every event id this user has joined, so cards can show RSVP state at a glance.
export const joinedEventIds = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    const userId = args.userId;

    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return rsvps.map((r) => r.eventId);
  },
});

// "My Events" - everything the signed-in member has joined.
export const myEvents = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    const userId = args.userId;

    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const events = [];
    for (const rsvp of rsvps) {
      const event = await ctx.db.get(rsvp.eventId);
      if (!event) continue; // event was deleted

      const attendees = await ctx.db
        .query("rsvps")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      events.push({ ...event, attendeeCount: attendees.length });
    }

    events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    return events;
  },
});

export const join = mutation({
  args: { eventId: v.id("events"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("That event no longer exists.");

    const existing = await ctx.db
      .query("rsvps")
      .withIndex("by_user_and_event", (q) =>
        q.eq("userId", args.userId).eq("eventId", args.eventId)
      )
      .unique();

    // Joining twice should be a no-op, not a duplicate row.
    if (existing) return;

    await ctx.db.insert("rsvps", {
      eventId: args.eventId,
      userId: args.userId,
    });
  },
});

export const leave = mutation({
  args: { eventId: v.id("events"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const rsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_user_and_event", (q) =>
        q.eq("userId", args.userId).eq("eventId", args.eventId)
      )
      .unique();

    if (rsvp) await ctx.db.delete(rsvp._id);
  },
});
