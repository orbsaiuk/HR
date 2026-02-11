import Link from "next/link";
import { Header } from "@/shared/components/layout/Header.jsx";

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Create Beautiful Forms in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A powerful form builder for team members to collect responses,
            analyze data, and communicate with candidates.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/team-members"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Team Members
            </Link>
            <Link
              href="/sign-in"
              className="border border-blue-500 text-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
