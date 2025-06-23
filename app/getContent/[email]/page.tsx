"use client";

import React, { useEffect, use, useState } from "react";
import axios from "axios";
import SmartEmbed from "@/components/smartEmbeded";

const Page = ({ params }: { params: Promise<{ email: string }> }) => {
  const { email } = use(params);
  const decodetoken = decodeURIComponent(email);
  const [data, setdata] = useState([]);
  const [message, setmessage] = useState("");

  type content = {
    id: string;
    title: string;
    link: string;
    type: string;
    description: string;
  };

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
        <div className="flex justify-center items-center bg-zinc-900 text-white h-screen w-full">
          {message}
        </div>
      ) : (
        <div className="flex justify-between p-10  bg-zinc-900 max-sm:p-4 pt-[70px] max-sm:pt-[120px]   flex-wrap">
          {data.map((conti: content) => (
            <div
              key={conti.id}
              className=" bg-gradient-to-br  from-zinc-800/80 to-zinc-900/90 mt-6 max-sm:my-3  rounded-xl p-6 text-zinc-100 w-[30vw] max-sm:w-[100vw] shadow flex flex-col gap-4 hover:scale-[1.025] transition-transform duration-200 border border-zinc-700"
            >
              <div
                className="flex items-center justify-between mb-2"
                data-id={conti.id}
              >
                <span className="uppercase tracking-widest text-xs font-bold text-zinc-400 bg-zinc-900/60 px-2 py-1 rounded">
                  {conti.type}
                </span>
              </div>
              <div className="flex justify-center">
                <SmartEmbed url={conti.link} />
              </div>

              <div className="text-xl font-semibold text-zinc-100 mt-2 mb-1">
                {conti.title}
              </div>
              <a
                href={`${conti.link}`}
                target="_blank"
                className="text-xs text-blue-400 cursor-pointer"
              >
                {conti.link}
              </a>
              <div className="text-xs font-semibold text-zinc-100/70  ">
                {conti.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
