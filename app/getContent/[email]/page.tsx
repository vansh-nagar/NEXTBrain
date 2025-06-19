"use client";

import React, { useEffect, useRef, use, useState } from "react";
import { prisma } from "@/lib/prisma";
import axios from "axios";

const Page = ({ params }: { params: Promise<{ email: string }> }) => {
  const { email } = use(params);
  const decodetoken = decodeURIComponent(email);
  const [data, setdata] = useState([]);
  const [message, setmessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/db/getOtherUserData/${decodetoken}`)
      .then((response) => {
        // handle response data here
        const user = response.data.foundUser;
        console.log(user);
        setdata(user.content);
        setmessage(response.data.message);
      })
      .catch((error) => {
        // handle error here
        console.error(error);
        const err = error.response.data.message;
        setmessage(err);
      });
  }, [decodetoken]);

  return (
    <div>
      {data.length === 0 ? (
        <div className="flex justify-center items-center bg-black text-white h-screen w-full">
          {message}
        </div>
      ) : (
        data.map((conti: any) => (
          <div className="border" key={conti.id}>
            <div>{conti.type}</div>
            <a href={conti.link} target="_blank" rel="noopener noreferrer">
              {conti.link}
            </a>
            <div>{conti.title}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default Page;
