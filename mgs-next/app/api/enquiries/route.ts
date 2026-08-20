import { NextResponse } from "next/server";

const apiBase = process.env.MGS_API_BASE_URL || "http://localhost:8000";

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const source = rawPayload && typeof rawPayload === "object" ? rawPayload as Record<string, unknown> : {};
  const payload = {
    name: normalizeField(source.name),
    email: normalizeField(source.email),
    company: normalizeField(source.company),
    contact: normalizeField(source.contact),
    projectType: normalizeField(source.projectType),
    budget: normalizeField(source.budget),
    deadline: normalizeField(source.deadline),
    message: normalizeField(source.message),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json({ error: "Name, contact, and message are required." }, { status: 400 });
  }

  if (
    payload.name.length > 120 ||
    payload.email.length > 160 ||
    payload.company.length > 160 ||
    payload.contact.length > 120 ||
    payload.projectType.length > 80 ||
    payload.budget.length > 120 ||
    payload.deadline.length > 120 ||
    payload.message.length > 4000
  ) {
    return NextResponse.json({ error: "Enquiry is too long." }, { status: 400 });
  }

  try {
    const response = await fetch(`${apiBase}/api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      return NextResponse.json(
        { error: data?.error || "Unable to create enquiry." },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "The enquiry service is temporarily unavailable." },
      { status: 502 },
    );
  }
}
