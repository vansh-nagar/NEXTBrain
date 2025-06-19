import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

export default async function HomePage() {
  const prisma = new PrismaClient();
  const session = await getServerSession();

  let user = null;
  let content = null;

  if (session?.user?.email) {
    user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });
  }

  if (user) {
    content = await prisma.content.create({
      data: {
        type: "youtube",
        link: "https://www.youtube.com/watch?v=PEzdh8cJTuM",
        title: "andrew tate motivation",
        userId: user.id,
      },
    });
  }

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <div className="bg-red-600">
        {user ? JSON.stringify(user, null, 2) : "No user found"}
      </div>
      <div className="bg-black text-white">{JSON.stringify(content)}</div>
    </div>
  );
}
