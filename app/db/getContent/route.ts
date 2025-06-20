import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { session, filter } = await req.json();

  if (!session) {
    return NextResponse.json({ message: "session not found" }, { status: 400 });
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!foundUser) {
    return NextResponse.json({ message: "user not found" }, { status: 400 });
  }

  if (filter) {
    const userContent = await prisma.content.findMany({
      where: {
        userId: foundUser?.id,
        type: filter,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ userContent }, { status: 200 });
  }
  const userContent = await prisma.content.findMany({
    where: {
      userId: foundUser?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ userContent, foundUser }, { status: 200 });
}
