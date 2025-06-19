"use client";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  type ContentItem = {
    id: number;
    type: string;
    link: string;
    title: string;
    // add other fields if needed
  };
  const [content, setcontent] = useState<ContentItem[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
    axios
      .post("http://localhost:3000/db/getContent", { session })
      .then((res) => {
        console.log("data", res.data.foundUser.content);
        setcontent(res.data.foundUser.content);
      })
      .catch((err) => {
        console.log(err);
      });
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
      .then((res) => [console.log(res.data.message)])
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <input
        onChange={(e) => {
          setLink(e.target.value);
        }}
        type="text"
        placeholder="link"
        value={link}
      />
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category</option>
        <option value="document">document</option>
        <option value="tweet">tweet</option>
        <option value="youtube">youtube</option>
        <option value="link">link</option>
      </select>
      <button
        onClick={() => {
          createContent();
        }}
      >
        create content
      </button>

      <div>
        {content &&
          content.map((conti) => (
            <div className="border" key={conti.id}>
              <div>{conti.type}</div>
              <a href={conti.link} target="_blank" rel="noopener noreferrer">
                {conti.link}
              </a>
              <div>{conti.title}</div>
              <button className="bg-red-400 text-white">Delete</button>
            </div>
          ))}
      </div>
    </div>
  );
}
