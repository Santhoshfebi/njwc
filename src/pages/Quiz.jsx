import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { questions } from "../data/questions";
import { supabase } from "../supabaseClient";

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const results = state || {};

  // 🌐 Use language from Welcome page
  const language = results.language || "en";

  const q = questions[current];
  const correctAnswer = language === "en" ? q.answer_en : q.answer_ta;
  const options = language === "en" ? q.options_en : q.options_ta;

  // 🕒 Timer logic
  useEffect(() => {
    if (showAnswer) return;
    if (timeLeft <= 0) {
      setShowAnswer(true);
      setTimeout(() => handleNext(true), 800);
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showAnswer]);

  // ➡️ Next question or submit
  const handleNext = async (auto = false, selectedOption = null) => {
    let updatedScore = score;
    if (!auto && selectedOption === correctAnswer) {
      updatedScore += 1;
    }

    if (current >= questions.length - 1) {
      if (hasSubmitted) return;
      setHasSubmitted(true);

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
        if (error) console.error("Supabase insert error:", error);
      } catch (err) {
        console.error("Error saving participant:", err);
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

  // 🧩 Select answer
  const handleSelect = (option) => {
    setSelected(option);
    setShowAnswer(true);
    setTimeout(() => handleNext(false, option), 800);
  };

  const timePercent = (timeLeft / 20) * 100;

  return (
    <div className=" items-start justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="md:w-3/4 w-96 mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg ">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-lg font-semibold">
          <p>
            👤 {language === "en" ? "Participant" : "பங்கேற்பாளர்"}:{" "}
            <span className="text-blue-950">{results.name}</span>
          </p>
          <h5 className="text-xl font-bold text-center">
            📖 {language === "en" ? "Chapter: GENESIS" : "Chapter: ஆதியாகமம்"}
          </h5>
          <div className="text-gray-700">
            {language === "en" ? "Question" : "கேள்வி"}: {current + 1} / {questions.length}
          </div>
        </div>

        {/* Timer */}
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
        <h2 className="text-lg font-semibold mb-2">{language === "en" ? q.question_en : q.question_ta}</h2>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {options.map((option, idx) => {
            let cls = "w-full px-4 py-2 border rounded-lg transition-all duration-200 ";

            if (showAnswer) {
              if (option === correctAnswer) cls += "bg-green-500 text-white";
              else if (selected === option && option !== correctAnswer) cls += "bg-red-500 text-white";
              else cls += "opacity-70";
            } else if (selected === option) cls += "bg-blue-500 text-white";
            else cls += "hover:bg-gray-100";

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={showAnswer}
                className={cls}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Show correct answer if wrong */}
        {showAnswer && selected !== correctAnswer && (
          <div className="text-center mt-4 text-green-600 font-semibold">
            {language === "en"
              ? `✅ Correct Answer: ${q.answer_en}`
              : `✅ சரியான பதில்: ${q.answer_ta}`}
          </div>
        )}
      </div>
    </div>
  );
}
