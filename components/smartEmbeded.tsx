import React, { useEffect, useRef } from "react";

export function SmartEmbed({ url }: { url: string | null }) {
  if (!url) return null;

  /* ── regexes ─────────────────────────── */
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const twIdMatch = url.match(
    /(?:x\.com|twitter\.com)\/(?:#!\/)?\w+\/status(?:es)?\/(\d+)/
  );

  const container = useRef<HTMLDivElement | null>(null);

  /* ── load / hydrate tweet ─────────────── */
  useEffect(() => {
    if (!twIdMatch) return;

    const load = () => (window as any).twttr?.widgets?.load(container.current);

    if (document.getElementById("twitter-wjs")) {
      load();
    } else {
      const s = document.createElement("script");
      s.id = "twitter-wjs";
      s.src = "https://platform.twitter.com/widgets.js";
      s.async = true;
      s.onload = load;
      document.body.appendChild(s);
    }
  }, [twIdMatch]);

  /* ── YouTube ──────────────────────────── */
  if (ytMatch?.[1]) {
    return (
      <iframe
        className="w-full rounded-md shadow-md"
        height="260"
        src={`https://www.youtube.com/embed/${ytMatch[1]}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  /* ── Tweet ────────────────────────────── */
  if (twIdMatch?.[1]) {
    const tweetId = twIdMatch[1];
    const canonical = `https://twitter.com/i/status/${tweetId}`;

    return (
      <div ref={container} className="w-full">
        <blockquote className="twitter-tweet ">
          <a href={canonical} />
        </blockquote>
      </div>
    );
  }

  return null;
}

export default SmartEmbed;
