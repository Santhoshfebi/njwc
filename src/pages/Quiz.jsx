// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { questions } from "../data/questions";

// export default function Quiz() {
//   const [current, setCurrent] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(40);
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const participant = state || {};

//   const q = questions[current];

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleNext();
//       return;
//     }
//     const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

// const handleSelect = (option) => {
//   // Check if answer is correct
//   const isCorrect = option === q.answer;

//   if (isCorrect) {
//     setScore((prev) => prev + 1);
//   }

 
//   setSelected(option);
//   setShowAnswer(true);

 
//   setTimeout(() => {
//     handleNext();
//   }, 1500);
// };


//   const handleNext = () => {
//     if (current < questions.length - 1) {
//       setCurrent((c) => c + 1);
//       setSelected(null);
//       setShowAnswer(false);
//       setTimeLeft(40);
//     } else {
//       navigate("/result", {
//         state: { ...participant, score, total: questions.length },
//       });
//     }
//   };

//   const timePercent = (timeLeft / 40) * 100;

//   return (
//     <div className="w-3/4 mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg">
//       <div className="text-center mb-4 font-semibold text-lg flex justify-evenly">
//        <p> Participant: <span className="text-blue-600">{participant.name}</span></p>
//         <h5 className="text-xl font-bold text-center">Chapter: GENESIS</h5>
//         <div className="text-gray-600"> 
//           Questions : {current + 1} / {questions.length}
//         </div>
//       </div>

//       <div className="flex justify-end mb-2 text-red-600 font-semibold">
//         <div>Time Left: {timeLeft}s</div>
        
//       </div>

//       {/* Timer Bar */}
//       <div className="w-full bg-gray-200 h-2 rounded mb-2">
//         <div
//           className="h-2 bg-green-500 rounded transition-all duration-1000 ease-linear"
//           style={{ width: `${timePercent}%` }}
//         />
//       </div>

//       <h2 className="text-xl font-semibold mb-4">{q.question}</h2>

//       <div className="space-y-3">
//         {q.options.map((option) => {
//           let cls = "w-full px-4 py-2 border rounded-lg transition-all ";
//           if (showAnswer) {
//             if (option === q.answer) cls += "bg-green-500 text-white";
//             else if (selected === option) cls += "bg-red-500 text-white";
//             else cls += "opacity-70";
//           } else if (selected === option) cls += "bg-blue-500 text-white";
//           else cls += "hover:bg-gray-100";
//           return (
//             <button key={option} disabled={showAnswer} onClick={() => handleSelect(option)} className={cls}>
//               {option}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { questions } from "../data/questions";

export default function Quiz() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const participant = state || {};

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);

  const q = questions[current];

  // 🔹 Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext(); // auto-next if time runs out
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🔹 Handle option selection
  const handleSelect = (option) => {
  if (showAnswer) return; // Prevent double counting

  const isCorrect = option.trim().toLowerCase() === q.answer.trim().toLowerCase();
  if (isCorrect) setScore(prev => prev + 1);

  setSelected(option);
  setShowAnswer(true);

  setTimeout(() => handleNext(), 1500); // delay next question
};


  // 🔹 Move to next question or Result page
  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowAnswer(false);
      setTimeLeft(40); // reset timer
    } else {
      navigate("/result", {
        state: { ...participant, score, total: questions.length },
      });
    }
  };

  // 🔹 Progress bar percentages
  const progressPercent = ((current + 1) / questions.length) * 100;
  const timePercent = (timeLeft / 40) * 100;

  return (
    <div className="w-3/4 mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg">
      {/* Participant Name */}
      <div className="text-center mb-4 font-semibold text-lg flex justify-evenly">
        <p>Participant: <span className="text-blue-950">{participant.name}</span></p>
              <h5 className="text-xl font-bold text-center">Chapter: GENESIS</h5>
        <div>Questions : {current + 1} / {questions.length}</div>
      </div>

      {/* Time & Question Count */}
      <div className="flex justify-end mb-2 text-red-600 font-semibold">
        <div>Time Left: {timeLeft}s</div>
      </div>

      {/* Timer Bar */}
      <div className="w-full bg-gray-200 h-2 rounded mb-2">
        <div
          className="h-2 bg-green-500 rounded transition-all duration-1000 ease-linear"
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold mb-4">{q.question}</h2>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((option) => {
          let cls = "w-full px-4 py-2 border rounded-lg transition-all ";
          if (showAnswer) {
            if (option === q.answer) cls += "bg-green-500 text-white";
            else if (selected === option) cls += "bg-red-500 text-white";
            else cls += "opacity-70";
          } else if (selected === option) cls += "bg-blue-500 text-white";
          else cls += "hover:bg-gray-100";
          return (
            <button
              key={option}
              disabled={showAnswer}
              onClick={() => handleSelect(option)}
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
