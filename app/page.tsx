import React from "react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import HomePage from "@/components/HomePage";

const Page = async () => {
  return (
    <>
      <HomePage />
    </>
  );
};

export default Page;
