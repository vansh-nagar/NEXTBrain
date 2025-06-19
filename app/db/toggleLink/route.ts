import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { session, sharable } = await req.json();
  const email = session.user.email;

  const updateuser = await prisma.user.update({
    where: {
      email,
    },
    data: {
      sharable: !sharable,
    },
  });

  return NextResponse.json({ message: updateuser });
}
