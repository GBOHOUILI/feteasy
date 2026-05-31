import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

interface Params {
  params: { slug: string };
}

// GET /api/events/by-slug/[slug] — public, returns minimal event info
export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();

  const event = await Event.findOne({ slug: params.slug })
    .select("_id title date time doorsOpen venue address city theme slug")
    .lean();

  if (!event) {
    return NextResponse.json(
      { success: false, error: "Événement introuvable" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: event });
}
