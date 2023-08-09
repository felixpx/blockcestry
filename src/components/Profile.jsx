"use client";

import { useState } from "react";
import Overview from "../components/ProfileNav/Overview";
import TimeCapsuleMedia from "./TimeCapsuleMedia";

const secondaryNavigation = [
  { name: "Overview", href: "#", current: true },
  { name: "Time Capsule", href: "#", current: false },
  { name: "Familytree", href: "#", current: false },
  { name: "Settings", href: "#", current: false },
  { name: "Messages", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [selectedNav, setSelectedNav] = useState("");
  return (
    <>
      <main className="bg-black w-full bg-opacity-70 rounded-xl">
        <header>
          {/* Secondary navigation */}
          <nav className="flex overflow-x-auto border-b border-white/10 py-4">
            <ul
              role="list"
              className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => {
                      setSelectedNav(item.name);
                    }}
                    className={
                      selectedNav == item.name ? "text-indigo-400" : ""
                    }
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div hidden={selectedNav != "Overview"} className="">
            <Overview />
          </div>
          <div
            hidden={selectedNav != "Time Capsule"}
            className="items-center flex flex-col justify-center"
          >
            <TimeCapsuleMedia />
          </div>
        </header>
      </main>
    </>
  );
}
