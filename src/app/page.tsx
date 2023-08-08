import Image from "next/image";
import Landing from "../components/Landing";
import Header2 from "../components/Header2";

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col w-full items-center">
        <div className="flex flex-col items-center w-full">
          <Landing />
        </div>
      </main>
    </div>
  );
}
