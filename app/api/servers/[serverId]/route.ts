import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { NextResponse } from "next/server";
//NOTE if request object missing then error
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const serverId = (await params).serverId;
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    } else if (!serverId) {
      return NextResponse.json(
        { error: "Server id is not present " },
        { status: 400 }
      );
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name: name,
        imageUrl: imageUrl,
      },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[INVITE_CODE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
//NOTE if request object missing then error
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const serverId = (await params).serverId;
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    } else if (!serverId) {
      return NextResponse.json(
        { error: "Server id is not present " },
        { status: 400 }
      );
    }
    const server = await db.server.deleteMany({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[INVITE_CODE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const serverId = (await params).serverId;
    const server = await db.server.findUnique({
      where: { id: serverId },
      include: {
        channels: { orderBy: { createdAt: "asc" } },
        members: {
          include: { profile: true },
          orderBy: { role: "asc" },
        },
      },
    });

    if (!server)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json({ server, profile });
  } catch (error) {}
}
