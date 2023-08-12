import Image from "next/image";
import ViewTimeCapBase from "../../../components/ViewTimeCapBase";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col items-center w-full">
        <ViewTimeCapBase />
      </div>
    </main>
  );
}
