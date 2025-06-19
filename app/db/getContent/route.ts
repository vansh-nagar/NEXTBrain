import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { session } = await req.json();

  const foundUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      content: true,
    },
  });

  return NextResponse.json({ foundUser });
}
