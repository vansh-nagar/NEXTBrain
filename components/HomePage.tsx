"use client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import gsap from "gsap";
import {
  RiArrowDownSLine,
  RiAsterisk,
  RiCloseLine,
  RiDraftLine,
  RiGitRepositoryPrivateLine,
  RiLinksLine,
  RiLockUnlockFill,
  RiShare2Fill,
  RiShareLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from "@remixicon/react";
import SmartEmbed from "./smartEmbeded";
import { Session } from "next-auth";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sharable, setsharable] = useState(false);
  const [description, setdescription] = useState("");

  const [showUploader, setshowUploader] = useState(false);
  const [error, seterror] = useState<null | string>(null);
  const [content, setcontent] = useState<ContentItem[]>([]);
  const [filter, setfilter] = useState<null | string>(null);

  const [ShowPromtBox, setShowPromtBox] = useState(false);
  const [Prompt, setPrompt] = useState("");
  const [AiResult, setAiResult] = useState<ContentItem | null>(null);
  const [showSharableUrl, setshowSharableUrl] = useState(false);

  const { data: session } = useSession();

  const ErrorDiv = useRef(null);

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
    if (!error) return;

    gsap.to(ErrorDiv.current, {
      y: -50,
      duration: 3,
      opacity: 0,
    });

    const timer = setTimeout(() => seterror(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === "i" || event.key === "I")) {
        setShowPromtBox(true);

        setshowUploader(false);
        seterror("Press Escape button Exit");
      } else if (event.key === "Escape") {
        setShowPromtBox(false);
      }
    };

    seterror("Press Ctrl + I to use AI");

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  type ContentItem = {
    id: number;
    type: string;
    link: string;
    title: string;
    imageUrl: string;
    description: string;
    // add other fields if needed
  };

  useEffect(() => {
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

  const handleGroq = async () => {
    axios
      .post("http://localhost:3000/db/ASKGroq", {
        message: Prompt,
        session,
      })
      .then((res) => {
        console.log(
          "result,..,,.,.,..,,.,.,..,.,.,.,,.,.,.,.",
          res.data.result
        );

        setAiResult(JSON.parse(res.data.result));
      })
      .catch((err) => {
        console.error("Error fetching Groq response:", err);
        seterror("Failed to fetch AI response. Please try again.");
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
      {ShowPromtBox && (
        <div className="bg-black/50  fixed w-full h-screen flex justify-center items-center backdrop-blur-md z-50 ">
          <div className="bg-zinc-700/40 backdrop-blur-3xl rounded-md p-4 flex justify-center flex-col items-center w-[35vw] max-sm:w-[90vw] max-md:w-[70%]">
            <textarea
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              className="bg-zinc-700/80 w-full text-zinc-100 px-4 py-3 rounded-md  shadow-xl mt-3.5 placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Enter your prompt here"
            />
            <div className="text-red-400/40 text-left w-full">
              *For best results, please provide a clear and concise description.
            </div>
            <div className=" flex justify-end  w-full mt-4">
              <button
                onClick={() => {
                  handleGroq();
                }}
                className=" bg-zinc-900 text-white hover:shadow-purple-600 hover:shadow-xl transition-all duration-200 hover:rotate-x-12 aiButton relative px-4 py-2 rounded overflow-hidden shadow-2xs shadow-green-600"
              >
                Ask AI
              </button>
            </div>
            {AiResult && (
              <div
                key={AiResult.id}
                className=" bg-gradient-to-br  from-zinc-800/80 to-zinc-900/90 mt-6 max-sm:my-3  rounded-xl p-6 text-zinc-100 w-full shadow flex  flex-col gap-4 hover:scale-[1.025] transition-transform duration-200 border border-zinc-700"
              >
                <div
                  className="flex items-center justify-between mb-2"
                  data-id={AiResult.id}
                >
                  <span className="uppercase tracking-widest text-xs font-bold text-zinc-400 bg-zinc-900/60 px-2 py-1 rounded">
                    {AiResult.type}
                  </span>
                </div>
                {AiResult.link && (
                  <div className="flex justify-center w-full  overflow-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 rounded-md">
                    <SmartEmbed url={AiResult.link} />
                  </div>
                )}

                <div className="text-xl font-semibold text-zinc-100 mt-2 mb-1">
                  {AiResult.title}
                </div>
                <a
                  href={`${AiResult.link}`}
                  target="_blank"
                  className="text-xs text-blue-400 cursor-pointer"
                >
                  {AiResult.link}
                </a>
                <div className="text-xs font-semibold text-zinc-100/70  ">
                  {AiResult.description}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSharableUrl && (
        <div
          onClick={() => {
            setshowSharableUrl(false);
          }}
          className="bg-black/50  fixed w-full h-screen flex justify-center items-center backdrop-blur-md z-50 "
        >
          <div className="bg-zinc-700/40 backdrop-blur-3xl rounded-md p-4 flex justify-center flex-row gap-4 items-center w-[35vw] max-md:w-[70vw] max-sm:w-[90vw] flex-wrap break-all">
            <span className="text-xs sm:text-sm md:text-base break-all">
              {`http://localhost:3000/getContent/${session?.user.email}`}
            </span>
            <RiShare2Fill
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  `http://localhost:3000/getContent/${session?.user.email}`
                );
              }}
            />
          </div>
        </div>
      )}

      <div className="z-40 shadow-green-500 backdrop-blur-lg flex fixed justify-evenly items-center gap-4 top-4 left-10 bg-zinc-800/80 text-neutral-200 py-4 px-6 rounded-md shadow-2xs border border-zinc-700">
        <button
          onClick={() => {
            setfilter("youtube");
          }}
          title="Show only YouTube"
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
        >
          <RiYoutubeLine />
        </button>
        <button
          onClick={() => {
            setfilter("tweet");
          }}
          title="Show only Tweets"
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
        >
          <RiTwitterXLine />
        </button>
        <button
          onClick={() => {
            setfilter("link");
          }}
          title="Show only Links"
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
        >
          <RiLinksLine />
        </button>
        <button
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
          onClick={() => {
            setfilter("document");
          }}
          title="Show only Documents"
        >
          <RiDraftLine />
        </button>

        <button
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200"
          onClick={() => {
            setfilter(null);
          }}
          title="Show All"
        >
          <RiAsterisk />
        </button>
      </div>
      <div className="z-40 shadow-green-500 backdrop-blur-lg flex fixed justify-evenly items-center gap-4 top-4 -translate-x-1/2 left-1/2 bg-zinc-800/80 text-neutral-200 py-4 px-6 rounded-md shadow-2xs border border-zinc-700">
        <button
          onClick={() => {
            setshowUploader(true);
          }}
          className="hover:text-white flex flex-row gap-1 active:text-zinc-300 hover:scale-105 transition-all duration-200"
        >
          Upload content
          <RiShare2Fill />
        </button>
        <button
          className="hover:text-white flex gap-1  flex-row active:text-zinc-300 hover:scale-105 transition-all duration-200"
          onClick={() => {
            toggleLink();
          }}
        >
          {sharable ? "Private" : "Public"}

          {sharable ? <RiLockUnlockFill /> : <RiGitRepositoryPrivateLine />}
        </button>
        <button
          className="hover:text-white active:text-zinc-300 hover:scale-105 transition-all duration-200 flex flex-row gap-1"
          onClick={() => {
            setshowSharableUrl(true);
            setshowUploader(false);
          }}
        >
          Share <RiShareLine />
        </button>
      </div>

      {session && (
        <button
          className=" cursor-pointer   z-40 backdrop-blur-lg flex fixed  hover:scale-110 shadow-2xs shadow-white transition-all duration-500 items-center gap-4 top-4 right-10 bg-zinc-800/80 text-red-600  hover:shadow-xl hover:text-white hover:shadow-red-600  py-4 px-6 rounded-md  hover:rotate-x-[20deg] border border-zinc-700"
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
          <div className="text-red-500/40 flex flex-col">
            *For best results with future AI searches, please provide a clear,
            memorable title and a concise description.{" "}
            <span>press ctrl + I to use AI</span>
          </div>

          <div className="flex justify-end">
            <div className=" cursor-pointer bg-zinc-700/80 mt-4 text-zinc-100 rounded-md px-2 flex justify-center gap-1 items-center py-2 shadow-xl border border-zinc-600">
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
