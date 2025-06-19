import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ email: string }> }
) {
  const data = await context.params;
  const email = data.email;
  console.log(email);

  if (!email) {
    return NextResponse.json({ message: "invalid email" }, { status: 400 });
  }

  console.log("email:", email);
  const foundUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      content: true,
      sharable: true,
    },
  });

  if (!foundUser) {
    return NextResponse.json({ message: "invalid email" }, { status: 400 });
  }

  if (!foundUser?.sharable) {
    return NextResponse.json(
      { message: "user content is private" },
      { status: 400 }
    );
  }

  return NextResponse.json({ foundUser }, { status: 200 });
}
