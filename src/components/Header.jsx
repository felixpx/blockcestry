"use client";

import { Disclosure } from "@headlessui/react";
import { LinkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "Home", href: "/", current: true },
  { name: "Familytree", href: "familytree", current: false },
  { name: "Profile", href: "profile", current: false },
  { name: "Time Capsule", href: "timecapsule", current: false },
];

export default function Header() {
  const [selectedTab, setSelectedTab] = useState("");

  function setHome() {
    setSelectedTab("/");
  }
  function setFam() {
    setSelectedTab("familytree");
  }

  return (
    <Disclosure as="nav" className="bg-transparent">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                  />
                </div>

                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {tabs.map((tab) => {
                    <a
                      key={tab.name}
                      onClick={() => {
                        setSelectedTab(tab.name);
                      }}
                      className={classNames(
                        selectedTab == tab.name
                          ? "text-gray-500"
                          : "text-gray-200 hover:text-black"
                      )}
                    >
                      <span>{tab.name} Hello</span>
                    </a>;
                  })}
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <a
                    href="/"
                    onClick={setHome}
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-100"
                  >
                    Home
                  </a>
                  <a
                    href="familytree"
                    onClick={setFam}
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-100"
                  >
                    Familytree
                  </a>
                  <a
                    href="profile"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-100"
                  >
                    Profile
                  </a>
                  <a
                    href="timecapsule"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-100"
                  >
                    Time Capsule
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <LinkIcon className="-ml-0.5 h-5 w-5"  />
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
