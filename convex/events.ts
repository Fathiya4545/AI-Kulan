import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

// Attach the attendee count so cards and detail pages can show it without
// each component running its own query.
async function withAttendees(ctx: QueryCtx, event: Doc<"events">) {
  const rsvps = await ctx.db
    .query("rsvps")
    .withIndex("by_event", (q) => q.eq("eventId", event._id))
    .collect();

  return { ...event, attendeeCount: rsvps.length };
}

// Guests can call this without an account. That is the point of guest browsing.
export const list = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    format: v.optional(v.string()), // "all" | "online" | "in-person"
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("events").collect();

    if (args.category) {
      events = events.filter((e) => e.category === args.category);
    }

    if (args.format === "online") {
      events = events.filter((e) => e.isOnline);
    } else if (args.format === "in-person") {
      events = events.filter((e) => !e.isOnline);
    }

    const term = args.search?.trim().toLowerCase();
    if (term) {
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term) ||
          e.location.toLowerCase().includes(term) ||
          e.organizerName.toLowerCase().includes(term)
      );
    }

    events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    return Promise.all(events.map((e) => withAttendees(ctx, e)));
  },
});

// Takes a plain string so a typo in the URL bar returns null instead of
// throwing an id-validation error and blanking the page.
export const get = query({
  args: { eventId: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("events", args.eventId);
    if (!id) return null;

    const event = await ctx.db.get(id);
    if (!event) return null;
    return withAttendees(ctx, event);
  },
});

// "Organized by me" - the events this user created.
export const byOrganizer = query({
  args: { organizerId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.organizerId) return [];
    const organizerId = args.organizerId;

    const events = await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizerId", organizerId))
      .collect();

    events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    return Promise.all(events.map((e) => withAttendees(ctx, e)));
  },
});

const eventFields = {
  title: v.string(),
  description: v.string(),
  category: v.string(),
  isOnline: v.boolean(),
  location: v.string(),
  date: v.string(),
  time: v.string(),
  imageUrl: v.string(),
};

function validate(args: {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
}) {
  if (!args.title.trim()) throw new Error("Give your event a title.");
  if (!args.description.trim()) throw new Error("Add a short description.");
  if (!args.location.trim()) throw new Error("Add a location or meeting link.");
  if (!args.date) throw new Error("Pick a date.");
  if (!args.time) throw new Error("Pick a start time.");
}

export const create = mutation({
  args: { ...eventFields, organizerId: v.id("users") },
  handler: async (ctx, args) => {
    const organizer = await ctx.db.get(args.organizerId);
    if (!organizer) throw new Error("You need to be logged in to create an event.");

    validate(args);

    return ctx.db.insert("events", {
      title: args.title.trim(),
      description: args.description.trim(),
      category: args.category,
      isOnline: args.isOnline,
      location: args.location.trim(),
      date: args.date,
      time: args.time,
      imageUrl:
        args.imageUrl.trim() ||
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
      organizerId: args.organizerId,
      organizerName: organizer.name,
    });
  },
});

// Ownership check lives here, on the server. Hiding the Edit button in the UI
// is a convenience; this is what actually stops someone editing an event that
// isn't theirs.
export const update = mutation({
  args: { ...eventFields, eventId: v.id("events"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("That event no longer exists.");
    if (event.organizerId !== args.userId) {
      throw new Error("You can only edit events you organize.");
    }

    validate(args);

    await ctx.db.patch(args.eventId, {
      title: args.title.trim(),
      description: args.description.trim(),
      category: args.category,
      isOnline: args.isOnline,
      location: args.location.trim(),
      date: args.date,
      time: args.time,
      imageUrl: args.imageUrl.trim() || event.imageUrl,
    });
  },
});

export const remove = mutation({
  args: { eventId: v.id("events"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("That event no longer exists.");
    if (event.organizerId !== args.userId) {
      throw new Error("You can only delete events you organize.");
    }

    // Clean up the RSVPs too, or they'd point at an event that's gone.
    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const rsvp of rsvps) {
      await ctx.db.delete(rsvp._id);
    }

    await ctx.db.delete(args.eventId);
  },
});

export type EventId = Id<"events">;
