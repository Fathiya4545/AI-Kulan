import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The three tables Kulan needs this week:
//   users  - who can sign in
//   events - what organizers create
//   rsvps  - the join/leave link between a user and an event
export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
  }).index("by_email", ["email"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    isOnline: v.boolean(),
    location: v.string(),
    date: v.string(), // YYYY-MM-DD
    time: v.string(), // HH:MM (24h)
    imageUrl: v.string(),
    // Ownership. Every bug this week comes down to checking this field.
    organizerId: v.id("users"),
    organizerName: v.string(),
  })
    .index("by_organizer", ["organizerId"])
    .index("by_category", ["category"]),

  rsvps: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_user_and_event", ["userId", "eventId"]),
});
