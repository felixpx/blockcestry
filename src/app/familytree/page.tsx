import Image from "next/image";
import FamilyTree3 from "../../components/FamilyTree3";
import Header from "../../components/Header";

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col w-full items-center">
        <div className="flex flex-col items-center w-full">
          <FamilyTree3 />
        </div>
      </main>
    </div>
  );
}
