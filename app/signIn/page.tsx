"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign In to your account</CardTitle>
          <CardDescription>
            Enter your username & password below to login to your account
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              onClick={() => {
                router.push("/signUp");
              }}
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="email" type="text" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    onClick={() => {
                      router.push("forgotPassword");
                    }}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
