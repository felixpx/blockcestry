import Image from "next/image";
import TimeCapsuleList from "../../components/TimeCapsuleList";
import Header2 from "../../components/Header2";
import {  faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function Home() {
  return (
    <main className="">
      {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div> */}
      <Header2 />

      <div className="flex flex-col items-center mt-16">
      <h2 className="mt-2 mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">      <FontAwesomeIcon icon={faClock}   className={"text-green-600 mr-2"}  />
Time Capsules</h2>
        <TimeCapsuleList />
      </div>
    </main>
  );
}
