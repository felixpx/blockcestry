"use client";

import { Disclosure } from "@headlessui/react";
import chains from "@/chains/chains";
import { useState, useEffect } from "react";
import { useAccountAbstraction } from "../../context/accountContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [selectedTab, setSelectedTab] = useState("");
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

  function setHome() {
    setSelectedTab("/");
  }
  function setFam() {
    setSelectedTab("familytree");
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
    <Disclosure as="nav" className="bg-transparent">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="/BC-logo-white.png"
                    alt="Your Company"
                  />
                </div>

                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <a
                    href="/"
                    onClick={setHome}
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-100"
                  >
                    Home
                  </a>
                  <a
                    href="/familytree"
                    onClick={setFam}
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-100"
                  >
                    Familytree
                  </a>
                  <a
                    href="/profile"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-100"
                  >
                    Profile
                  </a>
                 
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-x-4 flex-shrink-0">
                  <div className=" space-x-4">
                    <select
                      value={selectedChain}
                      className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                        className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Sign In
                      </button>
                    )}
                    {isAuthenticated && (
                      <button
                        onClick={signOut}
                        className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
