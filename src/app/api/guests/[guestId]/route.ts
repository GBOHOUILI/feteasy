import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Guest from "@/models/Guest";

interface Params {
  params: { guestId: string };
}

// PATCH /api/guests/[guestId]
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 },
    );
  }

  await connectDB();

  const guest = await Guest.findById(params.guestId);

  if (!guest) {
    return NextResponse.json(
      { success: false, error: "Invité introuvable" },
      { status: 404 },
    );
  }

  const event = await Event.findById(guest.eventId);

  if (
    session.user.role !== "super_admin" &&
    event?.organizerId.toString() !== session.user.id
  ) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 403 },
    );
  }

  const body = await req.json();

  const allowed = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "note",
    "status",
  ] as const;

  type AllowedKey = (typeof allowed)[number];

  const updates: Partial<Record<AllowedKey, any>> = {};

  allowed.forEach((key) => {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  });

  Object.assign(guest, updates);

  if (updates.firstName || updates.lastName) {
    guest.fullName = `${guest.firstName} ${guest.lastName}`;
  }

  await guest.save();

  return NextResponse.json({
    success: true,
    data: guest,
  });
}

// DELETE /api/guests/[guestId]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 },
    );
  }

  await connectDB();

  const guest = await Guest.findById(params.guestId);

  if (!guest) {
    return NextResponse.json(
      { success: false, error: "Invité introuvable" },
      { status: 404 },
    );
  }

  const event = await Event.findById(guest.eventId);

  if (
    session.user.role !== "super_admin" &&
    event?.organizerId.toString() !== session.user.id
  ) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 403 },
    );
  }

  await guest.deleteOne();

  return NextResponse.json({
    success: true,
    message: "Invité supprimé",
  });
}
