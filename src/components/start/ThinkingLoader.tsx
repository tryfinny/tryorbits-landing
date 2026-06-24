"use client";
import { useEffect, useState } from "react";

// Bit speaking in first person; messages fade from one to the next.
const MESSAGES = [
  "Just a sec…",
  "Getting things ready…",
  "Putting it all together…",
  "Making this awesome…",
  "Almost there…",
];

export function ThinkingLoader() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setI((n) => (n + 1) % MESSAGES.length);
        setShow(true);
      }, 300);
    }, 1900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-5 px-5 py-10">
      <img
        src="/bit-thinking.gif"
        alt="Bit"
        width={144}
        height={144}
        className="h-36 w-36 select-none object-contain"
      />
      <p
        className={`text-2xl font-bold tracking-tight text-foreground transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {MESSAGES[i]}
      </p>
    </div>
  );
}
