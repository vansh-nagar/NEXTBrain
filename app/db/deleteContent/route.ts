import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { contentId } = await req.json();
  const id = Number(contentId);

  if (!id) {
    return NextResponse.json(
      { message: "content id not valid" },
      { status: 403 }
    );
  }

  const deletedContent = await prisma.content.delete({
    where: {
      id,
    },
  });

  console.log(deletedContent);

  return NextResponse.json({ message: deletedContent }, { status: 200 });
}
