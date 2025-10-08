import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { questions } from "../data/questions";
import { supabase } from "../supabaseClient"; // ✅ import Supabase client

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // ⏱ 20s per question
  const navigate = useNavigate();
  const { state } = useLocation();
  const results = state || {};

  const q = questions[current];

  // 🕒 Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      // show correct answer before moving on
      setShowAnswer(true);
      setTimeout(() => handleNext(true), 700);
      return;
    }

    if (showAnswer) return; // stop countdown if answer shown

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showAnswer]);

  // ✅ Move to next or finish
  const handleNext = async (auto = false, selectedOption = null) => {
    let updatedScore = score;

    if (!auto && selectedOption === q.answer) {
      updatedScore += 1;
    }

    // Last question — save to Supabase
    if (current >= questions.length - 1) {
      try {
        const { error } = await supabase.from("results").insert([
          {
            name: results.name,
            phone: results.phone,
            place: results.place,
            score: updatedScore,
            total: questions.length,
          },
        ]);
        if (error) console.error("❌ Supabase insert error:", error);
      } catch (err) {
        console.error("⚠️ Error saving participant:", err);
      }

      navigate("/result", {
        state: { ...results, score: updatedScore, total: questions.length },
      });
    } else {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setShowAnswer(false);
      setTimeLeft(20);
      setScore(updatedScore);
    }
  };

  // ✅ When selecting an answer
  const handleSelect = (option) => {
    setSelected(option);
    setShowAnswer(true);
    // delay before next
    setTimeout(() => handleNext(false, option), 700);
  };

  const timePercent = (timeLeft / 20) * 100;

  return (
    <div className="md:w-3/4 w-96 mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg">
      {/* 🧍 Participant Name */}
      <div className="md:justify-evenly md:flex text-center mb-4 font-semibold text-lg  ">
         <p>Participant: <span className="text-blue-950">{results.name}</span></p>
               <h5 className="text-xl font-bold text-center">Chapter: Mock Round</h5>
         <div className="font-medium text-gray-700">Questions : {current + 1} / {questions.length}</div>
       </div>

      {/* Question Info */}
      <div className="flex justify-end mb-2 font-medium text-gray-700">
        <span className="text-red-600 font-semibold">⏱️ : {timeLeft}s</span>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full bg-gray-200 h-3 rounded mb-3">
        <div
          className="h-3 bg-green-500 rounded transition-all duration-1000 ease-linear"
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold mb-4">{q.question}</h2>

      {/* Options */}
      <div className="space-y-3 mb-4">
        {q.options.map((option) => {
          let cls =
            "w-full px-4 py-2 border rounded-lg transition-all duration-200 ";
          if (showAnswer) {
            if (option === q.answer) cls += "bg-green-500 text-white";
            else if (selected === option) cls += "bg-red-500 text-white";
            else cls += "opacity-70";
          } else if (selected === option) cls += "bg-blue-500 text-white";
          else cls += "hover:bg-gray-100";

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={showAnswer}
              className={cls}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
