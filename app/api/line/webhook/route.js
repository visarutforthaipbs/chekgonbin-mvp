import crypto from "node:crypto";
import { GREETING } from "@/data/line-greeting";

// LINE Messaging API webhook for the Thai Migrant Watch OA (@221omhgz).
// Only job today: greet new friends (follow event). Replies are free (don't use quota).
// No user ID, name, or message content is stored or logged (PDPA).
// Env (server only): LINE_CHANNEL_ID, LINE_CHANNEL_SECRET; LINE_GREETING_ENABLED=1 to send.
export const runtime = "nodejs";

function validSignature(raw, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(raw).digest();
  const given = Buffer.from(signature, "base64");
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

async function channelToken() {
  const res = await fetch("https://api.line.me/oauth2/v3/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.LINE_CHANNEL_ID,
      client_secret: process.env.LINE_CHANNEL_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  return (await res.json()).access_token;
}

export async function POST(req) {
  const raw = await req.text();
  if (!validSignature(raw, req.headers.get("x-line-signature"), process.env.LINE_CHANNEL_SECRET)) {
    return new Response("bad signature", { status: 401 });
  }
  const events = JSON.parse(raw).events || [];
  const follows = events.filter((e) => e.type === "follow" && e.replyToken);
  if (follows.length && process.env.LINE_GREETING_ENABLED === "1") {
    const token = await channelToken();
    await Promise.all(
      follows.map((e) =>
        fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ replyToken: e.replyToken, messages: GREETING }),
        }).then((r) => {
          if (!r.ok) console.error("line reply", r.status);
        })
      )
    );
  }
  // Always 200 so LINE doesn't retry; verification pings have no events.
  return Response.json({ ok: true });
}
