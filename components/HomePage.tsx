"use client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import gsap, { set } from "gsap";
import {
  RiArrowDownSFill,
  RiArrowDownSLine,
  RiCloseLine,
  RiHeartFill,
} from "@remixicon/react";
import SmartEmbed from "./smartEmbeded";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sharable, setsharable] = useState(false);
  const [description, setdescription] = useState("");

  const [showUploader, setshowUploader] = useState(false);
  const [SetOverLay, setSetOverLay] = useState(false);
  const [error, seterror] = useState<null | string>(null);
  const [content, setcontent] = useState<ContentItem[]>([]);
  const [filter, setfilter] = useState<null | string>(null);

  const { data: session } = useSession();

  const ErrorDiv = useRef(null);

  useEffect(() => {
    if (!error) return;

    gsap.to(ErrorDiv.current, {
      y: -50,
      duration: 3,
      opacity: 0,
    });

    const timer = setTimeout(() => seterror(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  type ContentItem = {
    id: number;
    type: string;
    link: string;
    title: string;
    imageUrl: string;
    description: string;
    // add other fields if needed
  };

  const getContent = () => {
    // Refetch content after successful deletion
    axios
      .post("http://localhost:3000/db/getContent", { session, filter })
      .then((res) => {
        console.log(res.data.userContent);
        setcontent(res.data.userContent);
        console.log(res.data.foundUser.sharable);
        setsharable(res.data.foundUser.sharable);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getContent();
  }, [session, filter]);

  const createContent = () => {
    if (category === "link" || category === "tweet" || category === "youtube") {
      if (!link) {
        seterror("Please enter link");
        return;
      }
    }

    if (!title) {
      seterror("Please enter title");
      return;
    } else if (!category) {
      seterror("Please select category");
      return;
    }

    axios
      .post("http://localhost:3000/db/createContent", {
        data: session,
        link,
        category,
        title,
        description,
      })
      .then((res) => {
        if (res.status === 200) {
          getContent();
          setLink("");
          setTitle("");
          setCategory("");

          setshowUploader(false);
        }
      })
      .catch((err) => {
        console.log(err.response.data.error);
        seterror(err.response.data.error);
      });
  };

  const handleDeleteContent = (e: React.MouseEvent<HTMLButtonElement>) => {
    const contentId = e.currentTarget.parentElement?.getAttribute("data-id");

    axios
      .post("http://localhost:3000/db/deleteContent", { contentId })
      .then((res) => {
        if (res.status === 200) {
          getContent();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleLink = () => {
    axios
      .post("http://localhost:3000/db/toggleLink", { session, sharable })
      .then((res) => {
        setsharable(res.data.message.sharable);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: "#18181b", // dark background
        minHeight: "100vh",
        color: "#e5e7eb", // light text
      }}
      className="bg-zinc-900 w-full relative"
    >
      <div className="z-50 shadow-green-500 backdrop-blur-lg flex fixed justify-evenly items-center gap-4 top-4 left-10 bg-zinc-800/80 text-neutral-200 py-4 px-6 rounded-md shadow-2xs border border-zinc-700">
        <button
          onClick={() => {
            setfilter("youtube");
          }}
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
        >
          youtube
        </button>
        <button
          onClick={() => {
            setfilter("tweet");
          }}
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
        >
          tweet
        </button>
        <button
          onClick={() => {
            setfilter("link");
          }}
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
        >
          link
        </button>
        <button
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
          onClick={() => {
            setfilter("document");
          }}
        >
          document
        </button>

        <button
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
          onClick={() => {
            setfilter(null);
          }}
        >
          all
        </button>
      </div>
      <div className="z-50 shadow-green-500 backdrop-blur-lg flex fixed justify-evenly items-center gap-4 top-4 -translate-x-1/2 left-1/2 bg-zinc-800/80 text-neutral-200 py-4 px-6 rounded-md shadow-2xs border border-zinc-700">
        <button
          onClick={() => {
            setshowUploader(true);
          }}
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
        >
          Upload content
        </button>
        <button
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
          onClick={() => {
            toggleLink();
          }}
        >
          {sharable ? "Private" : "Public"}
        </button>
      </div>

      {session && (
        <button
          className=" cursor-pointer   z-50 backdrop-blur-lg flex fixed  hover:scale-110 shadow-2xs shadow-white transition-all duration-500 items-center gap-4 top-4 right-10 bg-zinc-800/80 text-red-600  hover:shadow-xl hover:text-white hover:shadow-red-600  py-4 px-6 rounded-md  hover:rotate-x-[20deg] border border-zinc-700"
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      )}

      {showUploader && (
        <div className="z-50 flex flex-col w-[35vw] max-sm:bg-zinc-900/90  max-sm:p-3 gap-4 max-sm:w-[90vw] max-md:w-[70%] px-10 py-20 bg-zinc-800/90 backdrop-blur-lg shadow-2xl rounded-md text-zinc-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-zinc-700">
          <div
            onClick={() => {
              setshowUploader(false);
            }}
            className="group bg-zinc-700/60 cursor-pointer absolute right-10 top-5 p-2 rounded-full text-red-500 font-bold text-2xl shadow-xs shadow-white transition-all duration-200 hover:scale-110 hover:shadow-red-500 hover:text-white"
          >
            <RiCloseLine />
          </div>

          <input
            className="bg-zinc-700/80 text-zinc-100 px-4 py-3 rounded-md  shadow-xl mt-3.5 placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            onChange={(e) => {
              setLink(e.target.value);
            }}
            type="text"
            placeholder="https://www.youtube.com/watch?v=xvFZjo5PgG0"
            value={link}
          />
          <input
            type="text"
            className="bg-zinc-700/80 text-zinc-100 px-4 py-3 rounded-md  shadow-xl placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="bg-zinc-700/80 text-zinc-100 px-4 py-3 rounded-md  shadow-xl placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none mt-3.5"
            placeholder="description (optional)"
            rows={3}
            onChange={(e) => {
              setdescription(e.target.value);
            }}
          ></textarea>

          <div className="flex justify-end">
            <div className="bg-zinc-700/80 mt-4 text-zinc-100 rounded-md px-2 flex justify-center gap-1 items-center py-2 shadow-xl border border-zinc-600">
              <select
                className="appearance-none  text-zinc-100"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option className="text-black" value="">
                  Select category
                </option>
                <option className="text-black" value="document">
                  document
                </option>
                <option className="text-black" value="tweet">
                  tweet
                </option>
                <option className="text-black" value="youtube">
                  youtube
                </option>
                <option className="text-black" value="link">
                  link
                </option>
              </select>
              <RiArrowDownSLine />
            </div>
          </div>

          <div className="text-center">
            <button
              className="bg-zinc-700/80 mt-5 cursor-pointer text-zinc-100 py-2 px-4 rounded-md shadow-xl hover:shadow-2xl hover:scale-105 hover:text-white transition-all duration-500 border border-zinc-600"
              onClick={() => {
                createContent();
              }}
            >
              create content
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between p-10  max-sm:p-4 pt-[70px] max-sm:pt-[120px]   flex-wrap">
        {content &&
          content.map((conti) => (
            <div
              key={conti.id}
              className=" bg-gradient-to-br  from-zinc-800/80 to-zinc-900/90 mt-6 max-sm:my-3  rounded-xl p-6 text-zinc-100 w-[30vw] max-sm:w-[100vw] shadow flex  flex-col gap-4 hover:scale-[1.025] transition-transform duration-200 border border-zinc-700"
            >
              <div
                className="flex items-center justify-between mb-2"
                data-id={conti.id}
              >
                <span className="uppercase tracking-widest text-xs font-bold text-zinc-400 bg-zinc-900/60 px-2 py-1 rounded">
                  {conti.type}
                </span>
                <button
                  onClick={(e) => {
                    handleDeleteContent(e);
                  }}
                  className="p-2 rounded-full hover:bg-red-600/50 bg-red-500/20 text-white transition-colors duration-200"
                  title="Delete"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>
              {conti.link && (
                <div className="flex justify-center w-full  overflow-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 rounded-md">
                  <SmartEmbed url={conti.link} />
                </div>
              )}

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

      {error && (
        <div
          ref={ErrorDiv}
          className=" z-50 fixed bg-red-500 bottom-7 right-4 px-4 py-2 rounded-md"
        >
          {error}
        </div>
      )}
    </div>
  );
}
