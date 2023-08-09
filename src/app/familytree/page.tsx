import Image from "next/image";
import FamTreeBase from "../../components/FamTreeBase";
import Header from "../../components/Header";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col items-center w-full">
        <FamTreeBase />
      </div>
    </main>
  );
}
