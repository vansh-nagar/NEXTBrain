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

const ForgotPassword = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Change your password</CardTitle>
          <CardDescription>
            Enter your new password below to change your password
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              onClick={() => {
                router.push("/signIn");
              }}
            >
              Sign In
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">New password</Label>
                <Input id="email" type="text" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Re-type password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Change password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
