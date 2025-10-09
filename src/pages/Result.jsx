import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { name, phone, place, score, total } = state || {};
  const [topPlayers, setTopPlayers] = useState([]);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch leaderboard + rank
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch all participants sorted by score
        const { data: allPlayers, error } = await supabase
          .from("results")
          .select("*")
          .order("score", { ascending: false })
          .order("created_at", { ascending: true });

        if (error) throw error;

        // Calculate rank
        const playerIndex = allPlayers.findIndex(
          (p) =>
            p.name === name &&
            p.phone === phone &&
            p.place === place &&
            p.score === score
        );
        setRank(playerIndex >= 0 ? playerIndex + 1 : "N/A");

        // Get top 3
        const topFive = allPlayers.slice(0, 5);
        setTopPlayers(topFive);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [name, phone, place, score]);

  if (loading)
    return (
      <div className="sm:mt-10  mt-52 h-96"><DotLottieReact
      src="https://lottie.host/3695126e-4a51-4de3-84e9-b5b77db17695/TP1TtYQU4O.lottie"
      loop
      autoplay
    /></div>
    );

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg space-y-6 mb-5">
      <h1 className="text-3xl font-bold text-center">🎉 Quiz Completed!</h1>
      <p className="text-xl  text-center">கலந்து கொண்டதற்கு நன்றி கர்த்தர் உங்களை ஆசீர்வதிப்பாராக.</p>
      {/* ✅ Participant Info */}
      <div className="mb-4 text-left space-y-1 flex justify-evenly">
        <p className="text-lg font-semibold text-gray-800">
          {name} ({place})
        </p> 
        <p className="text-lg text-center font-semibold text-gray-800 mb-6">
        🏆 Your Rank:{" "}
        <span className="text-blue-600">
          {rank !== "N/A" ? `#${rank}` : "Unranked"}
        </span>
      </p>
      </div>

      {/* ✅ Score */}
      <p className="text-2xl mt-4 text-green-600 text-center">
         You scored <strong>{score}</strong> out of <strong>{total}</strong>
       </p>

      {/* ✅ Rank */}
      

      {/* ✅ Top 3 Leaderboard */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <h4 className="text-lg font-semibold text-center mb-2 text-yellow-600">🏆 Top Scorers</h4>
        <div className="space-y-2">
          {topPlayers.map((player, idx) => {
            const badge =
              idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx === 3 ? "🏅" : idx === 4 ? "🏅" : "";
            return (
              <div
                key={player.id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{badge}</span>
                  <span className="font-medium">{player.name} ( {player.place} )</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Restart Button */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
  {/* Play Again Button */}
  {/* <button
    onClick={() => navigate("/")}
    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
  >
    Play Again
  </button> */}

  {/* WhatsApp Button */}
  <button
    onClick={() =>
      window.open("https://chat.whatsapp.com/GEnGf9jl2SP7EfBRpCnqva?mode=wwt", "_blank")
    }
    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
  >
    💬 Join WhatsApp
  </button>
</div>
  
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { questions } from "../data/questions";
// import { supabase } from "../supabaseClient";

// export default function Quiz() {
//   const [current, setCurrent] = useState(0);
//   const [score, setScore] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(20);
//   const [hasSubmitted, setHasSubmitted] = useState(false);

//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const participant = state || {};

//   // 🌐 Use language from Welcome page
//   const language = participant.language || "en";

//   const q = questions[current];
//   const correctAnswer = language === "en" ? q.answer_en : q.answer_ta;
//   const options = language === "en" ? q.options_en : q.options_ta;

//   // 🕒 Timer logic
//   useEffect(() => {
//     if (showAnswer) return;
//     if (timeLeft <= 0) {
//       setShowAnswer(true);
//       setTimeout(() => handleNext(true), 800);
//       return;
//     }

//     const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft, showAnswer]);

//   // ➡️ Next question or submit
//   const handleNext = async (auto = false, selectedOption = null) => {
//     let updatedScore = score;
//     if (!auto && selectedOption === correctAnswer) {
//       updatedScore += 1;
//     }

//     if (current >= questions.length - 1) {
//       if (hasSubmitted) return;
//       setHasSubmitted(true);

//       try {
//         const { error } = await supabase.from("participants").insert([
//           {
//             name: participant.name,
//             phone: participant.phone,
//             place: participant.place,
//             score: updatedScore,
//             total: questions.length,
//           },
//         ]);
//         if (error) console.error("Supabase insert error:", error);
//       } catch (err) {
//         console.error("Error saving participant:", err);
//       }

//       navigate("/result", {
//         state: { ...participant, score: updatedScore, total: questions.length },
//       });
//     } else {
//       setCurrent((prev) => prev + 1);
//       setSelected(null);
//       setShowAnswer(false);
//       setTimeLeft(20);
//       setScore(updatedScore);
//     }
//   };

//   // 🧩 Select answer
//   const handleSelect = (option) => {
//     setSelected(option);
//     setShowAnswer(true);
//     setTimeout(() => handleNext(false, option), 800);
//   };

//   const timePercent = (timeLeft / 20) * 100;

//   return (
//     <div className="md:w-3/4 w-96 mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-lg font-semibold">
//         <p>
//           👤 {language === "en" ? "Participant" : "பங்கேற்பாளர்"}:{" "}
//           <span className="text-blue-950">{participant.name}</span>
//         </p>
//         <h5 className="text-xl font-bold text-center">
//           📖 {language === "en" ? "Chapter: Mock Round" : "Chapter: மொக் சுற்று"}
//         </h5>
//         <div className="text-gray-700">
//           {language === "en" ? "Question" : "கேள்வி"}: {current + 1} / {questions.length}
//         </div>
//       </div>

//       {/* Timer */}
//       <div className="flex justify-end mb-2 font-medium text-gray-700">
//         <span className="text-red-600 font-semibold">⏱️ : {timeLeft}s</span>
//       </div>

//       {/* Timer Progress Bar */}
//       <div className="w-full bg-gray-200 h-3 rounded mb-3">
//         <div
//           className="h-3 bg-green-500 rounded transition-all duration-1000 ease-linear"
//           style={{ width: `${timePercent}%` }}
//         />
//       </div>

//       {/* Question */}
//       <h2 className="text-lg font-semibold mb-2">{language === "en" ? q.question_en : q.question_ta}</h2>

//       {/* Options */}
//       <div className="space-y-3 mb-4">
//         {options.map((option, idx) => {
//           let cls = "w-full px-4 py-2 border rounded-lg transition-all duration-200 ";

//           if (showAnswer) {
//             if (option === correctAnswer) cls += "bg-green-500 text-white";
//             else if (selected === option && option !== correctAnswer) cls += "bg-red-500 text-white";
//             else cls += "opacity-70";
//           } else if (selected === option) cls += "bg-blue-500 text-white";
//           else cls += "hover:bg-gray-100";

//           return (
//             <button
//               key={idx}
//               onClick={() => handleSelect(option)}
//               disabled={showAnswer}
//               className={cls}
//             >
//               {option}
//             </button>
//           );
//         })}
//       </div>

//       {/* Show correct answer if wrong */}
//       {showAnswer && selected !== correctAnswer && (
//         <div className="text-center mt-4 text-green-600 font-semibold">
//           {language === "en"
//             ? `✅ Correct Answer: ${q.answer_en}`
//             : `✅ சரியான பதில்: ${q.answer_ta}`}
//         </div>
//       )}
//     </div>
//   );
// }
