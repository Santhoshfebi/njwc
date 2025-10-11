import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { questions } from "../data/questions";
import { supabase } from "../supabaseClient";

export default function Quiz() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const results = state || {};

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 🕒 10 minutes
  const [showWarning, setShowWarning] = useState(false);

  const language = results.language || "en";
  const q = questions[current];
  const correctAnswer = language === "en" ? q.answer_en : q.answer_ta;
  const options = language === "en" ? q.options_en : q.options_ta;

  // 🕒 Global Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    if (timeLeft === 120 && !showWarning) {
      setShowWarning(true);
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showWarning]);

  // Format mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 🧩 Option selection
  const handleSelect = (option) => {
    if (showAnswer) return;

    setSelected(option);
    setShowAnswer(true);

    if (option === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Move to next question only if not the last one
    if (current < questions.length - 1) {
      setTimeout(() => {
        setSelected(null);
        setShowAnswer(false);
        setCurrent((prev) => prev + 1);
      }, 800);
    }
  };

  // ✅ Manual submission
  const handleSubmit = async () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);

    try {
      const { error } = await supabase.from("results").insert([
        {
          name: results.name,
          phone: results.phone,
          place: results.place,
          score,
          total: questions.length,
        },
      ]);
      if (error) console.error("Supabase insert error:", error);
    } catch (err) {
      console.error("Error saving participant:", err);
    }

    navigate("/result", {
      state: { ...results, score, total: questions.length },
    });
  };

  const totalQuizTime = 600;
  const timePercent = (timeLeft / totalQuizTime) * 100;
  const isWarningTime = timeLeft <= 120;

  return (
    <div className="relative flex items-start justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="md:w-3/4 w-96 mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-lg font-semibold">
          <p>
            👤 {language === "en" ? "Participant" : "பங்கேற்பாளர்"}:{" "}
            <span className="text-blue-950">{results.name}</span>
          </p>
          <h5 className="text-xl font-bold text-center text-indigo-500">
            📖 {language === "en" ? "Chapter: GENESIS" : "அத்தியாயம்: ஆதியாகமம்"}
          </h5>
          <div className="text-gray-700">
            {language === "en" ? "Question" : "கேள்வி"}: {current + 1} / {questions.length}
          </div>
        </div>

        {/* Global Timer */}
        <div className="flex justify-end mb-2 font-medium text-gray-700">
          <span
            className={`font-semibold ${
              isWarningTime ? "text-red-600 animate-pulse" : "text-green-600"
            }`}
          >
            ⏱️ {formatTime(timeLeft)}
          </span>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full bg-gray-200 h-3 rounded mb-3">
          <div
            className={`h-3 rounded transition-all duration-1000 ease-linear ${
              isWarningTime ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold mb-2">
          {language === "en" ? q.question_en : q.question_ta}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {options.map((option, idx) => {
            let cls = "w-full px-4 py-2 border rounded-lg transition-all duration-200 ";

            if (showAnswer) {
              // ✅ Show only selected option color
              if (selected === option && option === correctAnswer)
                cls += "bg-green-500 text-white";
              else if (selected === option && option !== correctAnswer)
                cls += "bg-red-500 text-white";
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

        {/* ✅ Submit Button only on last question */}
        {current === questions.length - 1 && (
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700 transition-all"
          >
            {language === "en" ? "Submit Quiz" : "வினாவை சமர்ப்பிக்கவும்"}
          </button>
        )}
      </div>

      {/* ⚠️ 2-Minute Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 items-start mt-2 flex justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              ⚠️ {language === "en" ? "Time Alert!" : "நேர எச்சரிக்கை!"}
            </h2>
            <p className="text-gray-700 mb-4">
              {language === "en"
                ? "Only 2 minutes left! Please review and submit your quiz soon."
                : "இன்னும் 2 நிமிடங்கள் மட்டுமே உள்ளன! தயவுசெய்து விரைவில் சமர்ப்பிக்கவும்."}
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              {language === "en" ? "OK, Continue" : "சரி, தொடரவும்"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
