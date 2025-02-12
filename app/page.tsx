import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/todos");
  }

  return (
    <div className="w-screen h-screen bg-[#1e1e1e] flex flex-col justify-center items-center relative text-white">
      <Link
        href="/"
        className="absolute top-6 left-8
        cursor-pointer 
      "
      >
        <h1 className="text-3xl font-bold text-yellow-400">
          Todo <span className="text-white">App</span>
        </h1>
      </Link>

      <div className="absolute top-6 right-8">
        <Link href="/sign-in">
          <button className="border border-gray-500 px-5 py-2 rounded-lg text-lg font-semibold hover:bg-gray-700 transition">
            Login
          </button>
        </Link>
      </div>

      <div className="text-center max-w-3xl px-6">
        <h1 className="text-4xl font-bold mb-6">Welcome to Todo App</h1>

        <p className="text-lg text-gray-400 mb-12">
          Stay organized and boost your productivity with our powerful yet
          simple todo list app. Plan your tasks efficiently and accomplish more
          every day.
        </p>

        <Link href="/sign-up">
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
