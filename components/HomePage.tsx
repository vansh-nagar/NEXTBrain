"use client";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import {
  RiArrowDownSFill,
  RiArrowDownSLine,
  RiCloseLine,
  RiHeartFill,
} from "@remixicon/react";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sharable, setsharable] = useState(false);
  const [dummyImage, setdummyImage] = useState(
    "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
  );
  const [showUploader, setshowUploader] = useState(false);
  const [SetOverLay, setSetOverLay] = useState(false);

  type ContentItem = {
    id: number;
    type: string;
    link: string;
    title: string;
    imageUrl: string;
    // add other fields if needed
  };
  const [content, setcontent] = useState<ContentItem[]>([]);

  const { data: session } = useSession();

  const getContent = () => {
    // Refetch content after successful deletion
    axios
      .post("http://localhost:3000/db/getContent", { session })
      .then((res) => {
        setsharable(res.data.foundUser.sharable);
        setcontent(res.data.foundUser.content);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getContent();
  }, [session]);

  const createContent = () => {
    if (!link || !title || !category) {
      return;
    }
    console.log("hello");
    axios
      .post("http://localhost:3000/db/createContent", {
        data: session,
        link,
        category,
        title,
      })
      .then((res) => {
        if (res.status === 200) {
          getContent();
          setLink("");
          setTitle("");
          setCategory("");
        }
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
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
        console.log(res.data.message.sharable);
        setsharable(res.data.message.sharable);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function getYoutubeThumbnail(url: string, quality: string = "hqdefault") {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (!match || match.length < 2) return null;

    const videoId = match[1];

    setdummyImage(`https://img.youtube.com/vi/${videoId}/${quality}.jpg`);
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
      className="bg-black/15 w-full  relative  "
    >
      <div className="z-50 flex fixed  justify-evenly items-center gap-4  top-4 -translate-x-1/2 left-1/2 bg-black/20 text-neutral-200  py-4 px-6 rounded-md  ">
        <button
          onClick={() => {
            setshowUploader(true);
          }}
          className="hover:text-neutral-100 active:text-black/75 hover:scale-105 translate-all duration-200 "
        >
          Upload content
        </button>
        <button
          className="hover:text-neutral-100 active:text-black/75 hover:scale-105 translate-all duration-200"
          onClick={() => {
            toggleLink();
          }}
        >
          {sharable ? "Private" : "Public"}
        </button>
      </div>

      {showUploader && (
        <div className="z-50  flex flex-col w-[35vw] max-sm:bg-black/40 max-sm:p-3 gap-4 max-sm:w-[90vw] max-md:w-[70%]  p-10 bg-black/10 backdrop-blur-lg shadow rounded-md text-black fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            onClick={() => {
              setshowUploader(false);
            }}
            className="bg-black/20 cursor-pointer absolute right-5 top-5 p-2 rounded-full text-neutral-200 font-bold text-2xl shadow-xs hover:scale-105 hover:shadow-2xl hover:text-neutral-100 translate-all duration-500"
          >
            <RiCloseLine />
          </div>
          <div className="flex justify-center items-center max-sm-mt-14">
            <img
              className="h-[200px] object-contain rounded-md"
              src={`${dummyImage}`}
              alt=""
            />
          </div>

          <input
            className="bg-black/20 text-white px-14 py-3 rounded-md text-center shadow-xl mt-3.5 "
            onChange={(e) => {
              setLink(e.target.value);
              getYoutubeThumbnail(e.target.value);
            }}
            type="text"
            placeholder="https://www.youtube.com/watch?v=xvFZjo5PgG0"
            value={link}
          />
          <input
            type="text"
            className="bg-black/20 text-white px-14 py-3 rounded-md text-center shadow-xl"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-end ">
            <div className="bg-black/20  mt-4   accent-neutral-400 text-neutral-200  rounded-md px-2 flex justify-center gap-1 items-center py-2 shadow-xl">
              <select
                className=" appearance-none  "
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

          <div className=" text-center">
            <button
              className="bg-black/20 mt-5 cursor-pointer text-neutral-200 py-2 px-4 rounded-md shadow-xl hover:shadow-2xl hover:scale-105 hover:text-neutral-100 translate-all duration-500  "
              onClick={() => {
                createContent();
              }}
            >
              create content
            </button>
          </div>
        </div>
      )}

      <div
        className="
         flex  justify-between p-10 pt-[100px] flex-wrap 
        "
      >
        {content &&
          content.map((conti) => (
            <div
              key={conti.id}
              className="mt-7 bg-gradient-to-br from-black/10 to-neutral-800/20 shadow-xl rounded-xl p-6 text-neutral-100 w-[30vw] max-sm:w-[100vw] flex flex-col gap-4  hover:scale-[1.025] transition-transform duration-200"
            >
              <div
                className="flex items-center justify-between mb-2"
                data-id={conti.id}
              >
                <span className="uppercase tracking-widest text-xs font-bold text-neutral-400 bg-neutral-900/40 px-2 py-1 rounded">
                  {conti.type}
                </span>
                <button
                  onClick={(e) => {
                    handleDeleteContent(e);
                  }}
                  className="p-2 rounded-full hover:bg-red-500/80 bg-red-400/80 text-white transition-colors duration-200"
                  title="Delete"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>
              <div className="flex justify-center ">
                <a href={`${conti.link}`} target="_blank" className="w-full ">
                  <img
                    src={dummyImage}
                    alt={conti.title}
                    className="h-50 w-full object-cover rounded-lg shadow-md   "
                  />
                </a>
              </div>

              <div className="text-xl font-semibold text-neutral-100 mt-2 mb-1">
                {conti.title}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
