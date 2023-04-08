// pages/403.tsx
import { NextPage } from "next";
import Link from "next/link";
const Custom403: NextPage = () => {
  return (
    <main className="flex min-h-screen align-middle flex-col items-center  bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex m-auto flex-col items-center justify-center gap-6 px-4 py-16 ">
        <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded-full" href="/">
          Home Page
        </Link>
        <h1 className="text-2xl">403 - Unauthorized</h1>
      </div>
    </main>
  );
};

export default Custom403;