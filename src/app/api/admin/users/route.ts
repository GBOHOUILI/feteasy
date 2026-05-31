import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Event from "@/models/Event";

// GET /api/admin/users
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  await connectDB();

  const users = await User.find({}).sort({ createdAt: -1 }).lean();

  // Attach event counts
  const usersWithStats = await Promise.all(
    users.map(async (u) => {
      const eventCount = await Event.countDocuments({ organizerId: u._id });
      return { ...u, eventCount };
    })
  );

  return NextResponse.json({ success: true, data: usersWithStats });
}

// PATCH /api/admin/users — change role or suspend
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const { userId, role } = await req.json();
  if (!userId || !role) return NextResponse.json({ success: false, error: "userId et role requis" }, { status: 400 });
  if (!["organizer", "super_admin"].includes(role)) {
    return NextResponse.json({ success: false, error: "Rôle invalide" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  if (!user) return NextResponse.json({ success: false, error: "Utilisateur introuvable" }, { status: 404 });

  return NextResponse.json({ success: true, data: user });
}
