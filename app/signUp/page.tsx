"use client";
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
import { PrismaClient } from "@prisma/client";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

const SignUp = () => {
  const router = useRouter();
  const client = new PrismaClient();

  const username = useRef("");
  const password = useRef("");

  const [Loader, setLoader] = useState(false);
  const [message, setmessage] = useState("");

  const handleSignUp = async () => {
    if (username.current === "") {
      setmessage("all fields are required");
      return;
    }
    setLoader(true);

    try {
      const res = await axios.post(`http://localhost:3000/db/signUp`, {
        username: username.current,
        password: password.current,
      });

      console.log(res);
      if (res.status === 200) {
        router.push("/signIn");
      }

      setmessage(res.data.message);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full  flex-col">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign Up to your account</CardTitle>
          <CardDescription>
            Enter your username & password below to login to your account
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="email"
                  type="text"
                  required
                  onChange={(e) => {
                    username.current = e.target.value;
                  }}
                />
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
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => {
                    password.current = e.target.value;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSignUp();
                    }
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleSignUp}>
            Sign Up
          </Button>
        </CardFooter>
      </Card>
      {Loader && (
        <div className="absolute h-screen w-full flex justify-center items-center bg-white">
          loading....
        </div>
      )}
      <div className="m-1">{message}</div>
    </div>
  );
};

export default SignUp;
