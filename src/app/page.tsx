import Link from "next/link";
import tests from "@/data/tests.json";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-pink-700">
          🌸 Оберіть тест для розумнички 🌟
        </h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tests.tests.map((test) => (
            <li key={test.id}>
              <Link
                href={`/test/${test.id}`}
                className="block bg-white shadow-md rounded-xl px-6 py-4 text-lg text-blue-700 font-semibold hover:bg-blue-100 hover:shadow-lg transition-all duration-300"
              >
                📝 {test.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
