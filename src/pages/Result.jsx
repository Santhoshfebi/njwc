// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";

// export default function Result() {
//   const navigate = useNavigate();

//   // 🔹 Get participant info from navigation state
//   const { state } = useLocation();
//   const { name, phone, place, score, total } = state || {};

//   // 🔹 State to store top 3 players
//   const [topPlayers, setTopPlayers] = useState([]);

//   // 🔹 useEffect to insert participant & fetch top 3 winners
//   useEffect(() => {
//     const saveAndFetch = async () => {
//       if (!name || !phone || !place) return; // prevent null inserts

//       try {
//         // Insert participant
//         const { data: insertData, error: insertError } = await supabase
//           .from("participants")
//           .insert([{ name, phone, place, score, total }]);
//         if (insertError) throw insertError;

//         // Fetch top 3 winners
//         const { data: topData, error: fetchError } = await supabase
//           .from("participants")
//           .select("*")
//           .order("score", { ascending: false })
//           .order("created_at", { ascending: true })
//           .limit(3);
//         if (fetchError) throw fetchError;

//         setTopPlayers(topData);
//       } catch (error) {
//         console.error("Error saving or fetching participants:", error);
//       }
//     };

//     saveAndFetch();
//   }, [name, phone, place, score, total]); // runs once on mount

//   return (
//     <div>
//       <h1>Result Page</h1>
//       <p>Name: {name}</p>
//       <p>Score: {score} / {total}</p>

//       <ul>
//         {topPlayers.map((p, index) => (
//           <li key={p.id}>{p.name} - {p.score}/{p.total}</li>
//         ))}
//       </ul>
      
      

//     </div>
    
//   );
// }


import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Result() {
  const navigate = useNavigate();

  // 🔹 Get participant info from navigation state
  const { state } = useLocation();
  const { name, phone, place, score, total } = state || {};

  // 🔹 State to store top 3 players
  const [topPlayers, setTopPlayers] = useState([]);

  // 🔹 useEffect to insert participant & fetch top 3 winners
  useEffect(() => {
    const saveAndFetch = async () => {
      if (!name || !phone || !place) return; // prevent null inserts

      try {
        // Insert participant
        const { data: insertData, error: insertError } = await supabase
          .from("participants")
          .insert([{ name, phone, place, score, total }]);
        if (insertError) throw insertError;

        // Fetch top 3 winners
        const { data: topData, error: fetchError } = await supabase
          .from("participants")
          .select("*")
          .order("score", { ascending: false })
          .order("created_at", { ascending: true }) // tiebreaker
          .limit(3);
        if (fetchError) throw fetchError;

        setTopPlayers(topData);
      } catch (error) {
        console.error("Error saving or fetching participants:", error);
      }
    };

    saveAndFetch();
  }, [name, phone, place, score, total]);

  // 🔹 Function to get medal badges
  const getBadge = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  if (!name || !phone || !place) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg text-center">
        <h1 className="text-xl font-bold text-red-500">
          Participant info missing!
        </h1>
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-center">🎉 Quiz Completed!</h1>
      <p className="text-xl font-bold text-center">கலந்து கொண்டதற்கு நன்றி கர்த்தர் உங்களை ஆசீர்வதிப்பாராக.</p>
 
      <div className="text-left space-y-1">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Division:</strong> {place}</p>
      </div>

      <p className="text-xl mt-4 text-center">
        You scored <strong>{score}</strong> out of <strong>{total - 1}</strong>
      </p>

      {/* Top 3 leaderboard */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <h2 className="text-lg font-semibold text-center mb-2 text-yellow-600">
          🏆 Top 3 Winners
        </h2>
        <ul className="space-y-2">
          {topPlayers.map((p, index) => (
            <li
              key={p.id}
              className="flex justify-between items-center border-b py-1 last:border-b-0"
            >
              <span>{getBadge(index)} {p.name} ({p.place})</span>
              <span>{p.score}/{p.total - 1}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full"
      >
        Play Again
      </button>
    </div>
  );
}
