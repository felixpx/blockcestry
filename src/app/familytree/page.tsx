import FamTreeBase from "../../components/FamTreeBase";

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col w-full items-center">
        <div className="flex flex-col items-center w-full">
          <FamTreeBase />
        </div>
      </main>
    </div>
  );
}
