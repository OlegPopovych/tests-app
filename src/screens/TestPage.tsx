"use client";

import { useEffect, useState } from "react";
import testsData from "@/data/tests.json";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function TestPage({ testId }: { testId: string }) {
  const test = testsData.tests.find((t) => t.id === testId);
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [answers, setAnswers] = useState<number[][]>(() =>
    test ? test.questions.map(() => []) : []
  );

  const correctCount = test?.questions.reduce((acc, q, i) => {
    const selected = answers[i];
    const correct = q.correct;

    const isCorrect =
      selected.length === correct.length &&
      selected.every((val) => correct.includes(val));

    return acc + (isCorrect ? 1 : 0);
  }, 0);

  useEffect(() => {
    if (test && checked && correctCount === test.questions.length) {
      setShowModal(true);
    }
  }, [checked, correctCount, test?.questions.length]);

  if (!test) return notFound();
  const allAnswered = answers.every((a) => a.length > 0);

  const handleToggle = (qIndex: number, oIndex: number) => {
    if (checked) return;

    setAnswers((prev) => {
      const updated = [...prev];
      const current = updated[qIndex];

      if (current.includes(oIndex)) {
        updated[qIndex] = current.filter((i) => i !== oIndex);
      } else {
        updated[qIndex] = [...current, oIndex];
      }

      return updated;
    });
  };

  const handleCheck = () => setChecked(true);
  const handleReset = () => {
    setAnswers(test.questions.map(() => []));
    setChecked(false);
    setShowModal(false);
  };

  const allTests = testsData.tests;
  const currentIndex = allTests.findIndex((t) => t.id === testId);
  const nextIndex = (currentIndex + 1) % allTests.length;
  const nextTest = allTests[nextIndex];

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link
            href="/"
            className="inline-block bg-blue-500 text-white px-5 py-2 rounded-full shadow hover:bg-blue-600 transition"
          >
            ⬅️ Назад до тестів
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-pink-700 text-center">
          📝 {test.title}
        </h2>

        {test.questions.map((q, qIndex) => (
          <div
            key={q.id}
            className="bg-white border border-pink-200 p-5 rounded-xl shadow-md space-y-3"
          >
            <p className="font-semibold text-lg text-pink-800">
              {qIndex + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, oIndex) => {
                const selected = answers[qIndex].includes(oIndex);
                const isCorrect = q.correct.includes(oIndex);
                const isWrong = selected && !isCorrect;

                return (
                  <label
                    key={oIndex}
                    className={`block p-3 rounded-xl border cursor-pointer transition text-pink-600
                      ${
                        checked && selected && isCorrect
                          ? "bg-green-200 border-green-400"
                          : ""
                      }
                      ${checked && isWrong ? "bg-red-200 border-red-400" : ""}
                      ${
                        selected && !checked
                          ? "bg-blue-100 border-blue-300"
                          : "border-gray-300"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      name={`question-${qIndex}-${oIndex}`}
                      disabled={checked}
                      checked={selected}
                      onChange={() => handleToggle(qIndex, oIndex)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center space-x-3">
          <button
            onClick={handleCheck}
            disabled={!allAnswered || checked}
            className={`px-6 py-3 rounded-full font-semibold transition text-white ${
              allAnswered && !checked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            ✅ Перевірити
          </button>
          {checked && (
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
            >
              🔄 Почати наново
            </button>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm text-center space-y-4 border-2 border-green-200 animate-fade-in">
              <h3 className="text-2xl font-extrabold text-green-600">
                🎉 Браво!
              </h3>
              <p className="text-gray-700 text-lg">
                Усі відповіді правильні! Ти велика молодчинка 💖
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
              >
                Закрити
              </button>

              {nextTest && (
                <Link
                  href={`/test/${nextTest.id}`}
                  onClick={() => setShowModal(false)}
                  className="inline-block mt-2 px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  👉 Наступний тест: {nextTest.title}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import testsData from "@/data/tests.json";
// import { notFound } from "next/navigation";
// import Link from "next/link";

// export default function TestPage({ testId }: { testId: string }) {
//   const [showModal, setShowModal] = useState(false);
//   const test = testsData.tests.find((t) => t.id === testId);

//   const [answers, setAnswers] = useState<(number | null)[]>(() =>
//     test ? test.questions.map(() => null) : []
//   );
//   const [checked, setChecked] = useState(false);

//   const correctCount = test?.questions.reduce((acc, q, i) => {
//     const selected = answers[i];
//     return acc + (selected !== null && q.correct.includes(selected) ? 1 : 0);
//   }, 0);

//   useEffect(() => {
//     if (test && checked && correctCount === test.questions.length) {
//       setShowModal(true);
//     }
//   }, [checked, correctCount, test.questions.length]);

//   if (!test) return notFound();

//   const handleSelect = (qIndex: number, oIndex: number) => {
//     if (checked) return;
//     setAnswers((prev) => {
//       const updated = [...prev];
//       updated[qIndex] = oIndex;
//       return updated;
//     });
//   };

//   const handleCheck = () => setChecked(true);
//   const handleReset = () => {
//     setAnswers(test.questions.map(() => null));
//     setChecked(false);
//   };

//   const allAnswered = answers.every((a) => a !== null);

// const allTests = testsData.tests;
// const currentIndex = allTests.findIndex((t) => t.id === testId);

// const nextIndex = (currentIndex + 1) % allTests.length;
// const nextTest = allTests[nextIndex];

//   return (
//     // <main className="p-4 space-y-4">
//     //   <div className="mb-4">
//     //     <Link
//     //       href="/"
//     //       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//     //     >
//     //       Повернутись до вибору тестів
//     //     </Link>
//     //   </div>
//     //   <h2 className="text-xl font-semibold">{test.title}</h2>
//     //   {test.questions.map((q, qIndex) => (
//     //     <div key={q.id} className="border p-4 rounded space-y-2">
//     //       <p>{q.question}</p>
//     //       <div className="space-y-1">
//     //         {q.options.map((option, oIndex) => {
//     //           const selected = answers[qIndex] === oIndex;
//     //           const isCorrect = q.correct.includes(oIndex);
//     //           const isWrong = selected && !isCorrect;

//     //           return (
//     //             <label
//     //               key={oIndex}
//     //               className={`block p-2 rounded border cursor-pointer
//     //                 ${checked && selected && isCorrect ? "bg-green-200" : ""}
//     //                 ${checked && isWrong ? "bg-red-200" : ""}
//     //                 ${selected && !checked ? "bg-blue-100" : ""}
//     //               `}
//     //             >
//     //               <input
//     //                 type="radio"
//     //                 name={`question-${qIndex}`}
//     //                 disabled={checked}
//     //                 checked={selected}
//     //                 onChange={() => handleSelect(qIndex, oIndex)}
//     //                 className="mr-2"
//     //               />
//     //               {option}
//     //             </label>
//     //           );
//     //         })}
//     //       </div>
//     //     </div>
//     //   ))}

//     //   <div className="space-x-2">
//     //     <button
//     //       onClick={handleCheck}
//     //       disabled={!allAnswered || checked}
//     //       className={`px-4 py-2 rounded text-white ${
//     //         allAnswered && !checked
//     //           ? "bg-green-600 hover:bg-green-700"
//     //           : "bg-gray-400 cursor-not-allowed"
//     //       }`}
//     //     >
//     //       Перевірити
//     //     </button>
//     //     {checked && (
//     //       <button
//     //         onClick={handleReset}
//     //         className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
//     //       >
//     //         Почати наново
//     //       </button>
//     //     )}
//     //   </div>

//     //   {showModal && (
//     //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     //       <div className="bg-white p-6 rounded shadow-md max-w-sm text-center space-y-4">
//     //         <h3 className="text-xl font-semibold text-green-600">
//     //           Вітаємо! 🎉
//     //         </h3>
//     //         <p className="text-gray-700">
//     //           Усі відповіді правильні. Чудова робота!
//     //         </p>
//     //         <button
//     //           onClick={() => setShowModal(false)}
//     //           className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//     //         >
//     //           Закрити
//     //         </button>
//     //       </div>
//     //     </div>
//     //   )}
//     // </main>
//     <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6">
//       <div className="max-w-3xl mx-auto space-y-6">
//         <div>
//           <Link
//             href="/"
//             className="inline-block bg-blue-500 text-white px-5 py-2 rounded-full shadow hover:bg-blue-600 transition"
//           >
//             ⬅️ Назад до тестів
//           </Link>
//         </div>

//         <h2 className="text-3xl font-bold text-pink-700 text-center">
//           📝 {test.title}
//         </h2>

//         {test.questions.map((q, qIndex) => (
//           <div
//             key={q.id}
//             className="bg-white border border-pink-200 p-5 rounded-xl shadow-md space-y-3"
//           >
//             <p className="font-semibold text-lg text-pink-800">
//               {qIndex + 1}. {q.question}
//             </p>
//             <div className="space-y-2">
//               {q.options.map((option, oIndex) => {
//                 const selected = answers[qIndex] === oIndex;
//                 const isCorrect = q.correct.includes(oIndex);
//                 const isWrong = selected && !isCorrect;

//                 return (
//                   <label
//                     key={oIndex}
//                     className={`block p-3 rounded-xl border cursor-pointer transition text-pink-600
//                   ${
//                     checked && selected && isCorrect
//                       ? "bg-green-200 border-green-400"
//                       : ""
//                   }
//                   ${checked && isWrong ? "bg-red-200 border-red-400" : ""}
//                   ${
//                     selected && !checked
//                       ? "bg-blue-100 border-blue-300"
//                       : "border-gray-300"
//                   }
//                 `}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${qIndex}`}
//                       disabled={checked}
//                       checked={selected}
//                       onChange={() => handleSelect(qIndex, oIndex)}
//                       className="mr-2"
//                     />
//                     {option}
//                   </label>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         <div className="text-center space-x-3">
//           <button
//             onClick={handleCheck}
//             disabled={!allAnswered || checked}
//             className={`px-6 py-3 rounded-full font-semibold transition text-white ${
//               allAnswered && !checked
//                 ? "bg-green-600 hover:bg-green-700"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             ✅ Перевірити
//           </button>
//           {checked && (
//             <button
//               onClick={handleReset}
//               className="px-6 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
//             >
//               🔄 Почати наново
//             </button>
//           )}
//         </div>

//         {showModal && (
//           <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
//             <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm text-center space-y-4 border-2 border-green-200 animate-fade-in">
//               <h3 className="text-2xl font-extrabold text-green-600">
//                 🎉 Браво!
//               </h3>
//               <p className="text-gray-700 text-lg">
//                 Усі відповіді правильні! Ти велика молодчинка 💖
//               </p>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
//               >
//                 Закрити
//               </button>

//               {nextTest && (
//                 <Link
//                   href={`/test/${nextTest.id}`}
//                   onClick={() => setShowModal(false)}
//                   className="inline-block mt-2 px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
//                 >
//                   👉 Наступний тест: {nextTest.title}
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
