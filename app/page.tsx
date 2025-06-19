"use client";

import React from "react";
import HomePage from "@/components/HomePage";
import { SessionProvider } from "next-auth/react";

const Page = () => {
  return (
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  );
};

export default Page;
