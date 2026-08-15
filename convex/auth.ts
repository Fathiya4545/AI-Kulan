import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Classroom auth.
//
// Passwords are hashed with SHA-256 before they touch the database, so plain
// text is never stored. That is good enough to demonstrate real sign-up and
// login against a real database, but it is NOT production security: a real app
// needs a slow hash (bcrypt/argon2) and server-verified sessions. If your class
// later covers @convex-dev/auth, that is the upgrade path.
// ---------------------------------------------------------------------------

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const signUp = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const name = args.name.trim();

    if (!name) throw new Error("Please enter your name.");
    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      throw new Error("An account with that email already exists. Try logging in.");
    }

    const userId = await ctx.db.insert("users", {
      name,
      email,
      password: await hashPassword(args.password),
    });

    return { userId, name, email };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    // Same message either way, so we don't leak which emails have accounts.
    const failed = new Error("That email and password don't match an account.");
    if (!user) throw failed;
    if (user.password !== (await hashPassword(args.password))) throw failed;

    return { userId: user._id, name: user.name, email: user.email };
  },
});

// Used on page load to confirm a stored session still points at a real user.
export const me = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    return { userId: user._id, name: user.name, email: user.email };
  },
});
