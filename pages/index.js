
import Head from "next/head";
import dynamic from "next/dynamic";

const DragDropGrid = dynamic(() => import("../components/DragDropGrid"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Military Load Planner</title>
      </Head>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Military Load Planner</h1>
        <DragDropGrid aircraft="C-130J" />
      </main>
    </>
  );
}
