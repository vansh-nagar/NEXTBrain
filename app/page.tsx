import { getServerSession } from "next-auth";
import React from "react";

const Page = async () => {
  const session = await getServerSession();
  return <div>{JSON.stringify(session)}</div>;
};

export default Page;
