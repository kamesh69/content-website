import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.thesportsrivalry.com").replace(
      /\/$/,
      "",
    );

    const wpRes = await fetch(`${wpUrl}/wp-json/rati/v1/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!wpRes.ok) {
      const errText = await wpRes.text();
      console.warn("WordPress subscription response not ok:", wpRes.status, errText);
    }

    return NextResponse.json({
      success: true,
      message: "You’re subscribed. Welcome to the desk notes.",
    });
  } catch (error) {
    console.error("Failed to process subscription", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again later." },
      { status: 500 },
    );
  }
}
