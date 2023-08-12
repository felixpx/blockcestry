import Image from "next/image";
import CreateFamTreeBase from "../../components/CreateFamTreeBase";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col items-center w-full">
        <CreateFamTreeBase />
      </div>
    </main>
  );
}
