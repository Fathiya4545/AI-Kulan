import { mutation } from "./_generated/server";

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Dates are generated relative to today so the seeded events are always upcoming.
function daysFromNow(days: number): string {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

const SEED_EVENTS = [
  {
    title: "Break the Bubble at Broken Clock Brewing",
    description:
      "A low-pressure evening for people new to the city. Show up alone, leave with a few names you'll actually remember. We grab a long table near the back.",
    category: "Social Activities",
    isOnline: false,
    location: "Broken Clock Brewing, Minneapolis, MN",
    days: 3,
    time: "17:00",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
  },
  {
    title: "Sunrise Trail Run at Theodore Wirth",
    description:
      "Five easy miles on soft trails, then coffee. All paces welcome, nobody gets left behind, and we regroup at every junction.",
    category: "Sports and Fitness",
    isOnline: false,
    location: "Theodore Wirth Park, Minneapolis, MN",
    days: 5,
    time: "06:30",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
  },
  {
    title: "Beginner Pottery: Throw Your First Bowl",
    description:
      "Three hours at the wheel with clay, aprons, and firing included. You will make something lopsided and you will love it.",
    category: "Hobbies and Passions",
    isOnline: false,
    location: "Northeast Arts District, Minneapolis, MN",
    days: 8,
    time: "13:00",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop",
  },
  {
    title: "Evening Restorative Yoga",
    description:
      "Slow, quiet, prop-heavy practice for the end of a long week. Mats provided. Come as you are, leave a little looser.",
    category: "Health and Wellbeing",
    isOnline: false,
    location: "Lake Harriet Studio, Minneapolis, MN",
    days: 4,
    time: "19:00",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
  },
  {
    title: "Weekend Backpacking: North Shore",
    description:
      "Two nights on the Superior Hiking Trail. Moderate difficulty, roughly eight miles a day. Gear list shared once you join.",
    category: "Travel and Outdoor",
    isOnline: false,
    location: "Superior Hiking Trail, Two Harbors, MN",
    days: 14,
    time: "08:00",
    imageUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&h=400&fit=crop",
  },
  {
    title: "Online Speaking Club: Practice Out Loud",
    description:
      "A friendly video call where everyone speaks for two minutes on a prompt. Great if you're building confidence in a second language.",
    category: "Social Activities",
    isOnline: true,
    location: "https://meet.example.com/kulan-speaking",
    days: 2,
    time: "18:30",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=400&fit=crop",
  },
  {
    title: "JavaScript Study Group: Async and Promises",
    description:
      "We work through async/await together, screen sharing as we go. Bring a bug you're stuck on and we'll look at it as a group.",
    category: "Hobbies and Passions",
    isOnline: true,
    location: "https://meet.example.com/kulan-js",
    days: 6,
    time: "18:00",
    imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop",
  },
  {
    title: "Sunday Morning Book Swap",
    description:
      "Bring a book you've finished, leave with one you haven't. Coffee, quiet corners, and no obligation to talk to anyone.",
    category: "Hobbies and Passions",
    isOnline: false,
    location: "Milkweed Books, Minneapolis, MN",
    days: 9,
    time: "10:00",
    imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
  },
];

// Run this once from the Convex dashboard (or `npx convex run seed:seed`) to
// fill an empty database with a demo organizer and eight upcoming events.
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("events").first();
    if (existing) {
      return "Database already has events. Nothing seeded.";
    }

    const email = "demo@kulan.app";
    let organizer = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!organizer) {
      const id = await ctx.db.insert("users", {
        name: "Kulan Demo Organizer",
        email,
        password: await hashPassword("kulan123"),
      });
      organizer = await ctx.db.get(id);
    }

    if (!organizer) throw new Error("Could not create the demo organizer.");

    for (const e of SEED_EVENTS) {
      await ctx.db.insert("events", {
        title: e.title,
        description: e.description,
        category: e.category,
        isOnline: e.isOnline,
        location: e.location,
        date: daysFromNow(e.days),
        time: e.time,
        imageUrl: e.imageUrl,
        organizerId: organizer._id,
        organizerName: organizer.name,
      });
    }

    return `Seeded ${SEED_EVENTS.length} events. Demo login: demo@kulan.app / kulan123`;
  },
});
