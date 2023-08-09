"use client";

import { Popover } from "@headlessui/react";
// import { ChipIcon, PlayIcon, GlobeAltIcon } from "@heroicons/react/outline";
import {
  GlobeAltIcon,
  ClockIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import HeaderItem from "./HeaderItem";
import { useRouter } from "next/navigation";
import chains from "@/chains/chains";
import { useState, useEffect } from "react";
import { useAccountAbstraction } from "../../context/accountContext";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Profile", href: "#" },
  { name: "Playlist", href: "#" },
  { name: "Account", href: "#" },
];

export default function AltHeader() {
  const router = useRouter();
  const {
    ownerAddress,
    safes,
    chainId,
    isAuthenticated,
    web3Provider,
    loginWeb3Auth,
    logoutWeb3Auth,
    setChainId,
    // ...other context values and functions you need
  } = useAccountAbstraction();

  const [selectedChain, setSelectedChain] = useState(-1);

  function openHomepage() {
    router.push("/");
  }

  function openCommunity() {
    router.push("/familytree");
  }
  function openProfile() {
    router.push("/profile");
  }
  function openTC() {
    router.push("/timecapsules");
  }

  const handleChange = (event) => {
    const selectedChainIndex = parseInt(event.target.value); // Convert value to integer
    setSelectedChain(selectedChainIndex); // Update the selected value
  };

  const signIn = async () => {
    if (selectedChain == -1) return;

    setChainId(selectedChain);
    loginWeb3Auth();
  };

  const signOut = async () => {
    logoutWeb3Auth();
  };

  const handleClick = () => {
    if (ownerAddress) {
      // Copy the ownerAddress to the clipboard
      navigator.clipboard.writeText(ownerAddress);
    }
  };

  useEffect(() => {
    setSelectedChain(chainId);
  }, [chainId]);
  return (
    <div>
      <Popover as="header" className="relative">
        <div className="ring-b z-50 flex h-20 w-full flex-row items-center justify-between bg-transparent text-white-smoke shadow-md ring-teal-700">
          <nav
            className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
            aria-label="Global"
          >
            <div className="flex w-full items-center justify-evenly">
              <div className="flex w-full items-center justify-between text-xs font-semibold tracking-wide md:w-auto">
                <a href="#" className="fixed left-8 hidden sm:flex">
                  <span className="">BlockCestry</span>
                  {/* <img className="h-3 w-auto" src="/avasound-blk.svg" alt="" /> */}
                </a>
                <a href="/" className="fixed left-8 flex sm:hidden">
                  {/* INSERT BLOCKCESTRY LOGO HERE */}
                  <span className="">BlockCestry</span>
                  {/* <Image
                    src={"/avso-logo.png"}
                    width={35}
                    height={35}
                    className="rounded-full"
                  /> */}
                </a>
                <div className="fixed right-8 flex flex-row items-center space-x-4">
                  {/* <HeaderRight /> */}
                </div>
              </div>
              <div className="flex w-full items-center justify-evenly space-x-8 lg:space-x-24">
                <div
                  onClick={openHomepage}
                  className={`cursor-pointer ${
                    router.pathname === "/" ? "animate-pulse text-teal-700" : ""
                  }`}
                >
                  <HeaderItem title="Home" Icon={GlobeAltIcon} />
                </div>

                <div
                  onClick={openCommunity}
                  className={`cursor-pointer ${
                    router.pathname == "/familytree"
                      ? "animate-pulse text-teal-700"
                      : ""
                  }`}
                >
                  <HeaderItem title="Familytree" Icon={UserGroupIcon} />
                </div>
                <div
                  onClick={openProfile}
                  className={`cursor-pointer ${
                    router.pathname == "/profile"
                      ? "animate-pulse text-teal-700"
                      : ""
                  }`}
                >
                  <HeaderItem title="Profile" Icon={UserCircleIcon} />
                </div>
                <div
                  onClick={openTC}
                  className={`cursor-pointer whitespace-nowrap ${
                    router.pathname == "/timecapsule"
                      ? "animate-pulse text-teal-700"
                      : ""
                  }`}
                >
                  <HeaderItem title="Time Capsule" Icon={ClockIcon} />
                </div>

                <div>
                  <select
                    value={selectedChain}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-teal-700 focus:border-teal-300 bg-teal-200"
                    onChange={handleChange}
                  >
                    <option key={-1} value={-1}>
                      {" "}
                      Select Chain
                    </option>

                    {chains.map((chain, index) => (
                      <option key={index} value={index}>
                        {chain.label}
                      </option>
                    ))}
                  </select>
                  {!isAuthenticated && (
                    <button
                      onClick={signIn}
                      className="ml-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white"
                    >
                      Sign In
                    </button>
                  )}
                  {isAuthenticated && (
                    <button
                      onClick={signOut}
                      className="ml-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white"
                    >
                      Sign Out
                    </button>
                  )}{" "}
                </div>

                {ownerAddress && (
                  <div
                    onClick={handleClick}
                    className="flex items-center bg-white rounded-xl p-2 cursor-pointer"
                  >
                    {" "}
                    {ownerAddress && (
                      <p className="font-bold text-black hover:text-red-500 ">
                        {ownerAddress.substring(0, 6)}...
                        {ownerAddress.substring(ownerAddress.length - 4)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </Popover>
    </div>
  );
}
