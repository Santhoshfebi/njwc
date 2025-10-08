import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isQuizAvailable, setIsQuizAvailable] = useState(false);


  const navigate = useNavigate();

  // Set your scheduled quiz start time here (YYYY-MM-DDTHH:MM:SS)
  const scheduledTime = new Date("2025-10-12T04:00:00");

  // Countdown / time check
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setIsQuizAvailable(now >= scheduledTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Start Quiz handler
  const handleStart = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!name || !phone || !place) {
      alert("Please fill all fields");
      return;
    }
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    navigate("/quiz", { state: { name, phone, place } });
  };

  // Countdown display
  // Calculate remaining time
const timeLeftMs = Math.max(0, scheduledTime - currentTime);
const totalSeconds = Math.floor(timeLeftMs / 1000);

const days = Math.floor(totalSeconds / (24 * 3600));
const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;


  return (
    <div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-gray-50 p-4">
      {/* Left: Input Form */}
      <div className=" mt-20 w-96 bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Welcome to the Quiz!</h1>
        <p className="text-center">Enjoy the Quiz...!</p>
        <h5 className="text-xl font-bold text-center">Chapter: GENESIS</h5>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg "
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          maxLength={10} />
        <input
          type="text"
          placeholder="Division"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg "
        />

        <button
          onClick={handleStart}
          disabled={!isQuizAvailable}
          className={`w-full py-2 rounded-lg text-white transition-all ${isQuizAvailable
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {isQuizAvailable ? "Start Quiz" : "Quiz Not Started Yet"}
        </button>

        {/* Countdown */}
        {!isQuizAvailable && (
          <p className="text-center mt-4 text-red-500 font-semibold">
            Quiz starts in{" "}
            {days > 0 && `${days} day${days > 1 ? "s" : ""}, `}
            {hours}h {minutes}m {seconds}s ⏳
          </p>
        )}

      
      </div>

      {/* Right: Tips */}
      <div className="md:ml-8 mt-20 md:mt-20 bg-white p-6 rounded-2xl shadow-md w-full md:w-1/3">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">💡 Quiz Tips</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm leading-relaxed">
          <li>ஒவ்வொரு கேள்விக்கும் பதில் சொல்ல 20 விநாடிகள் மட்டுமே உண்டு.</li>
          <li>ஒரு முறை தேர்ந்தெடுத்த பதிலை மாற்ற முடியாது.</li>
          <li>அனைத்து கேள்விகளுக்கும் பதில் சொல்ல முயலுங்கள்.</li>
          <li>சரியான பதில்களுக்கு மதிப்பெண் வழங்கப்படும்.</li>
          <li>முடிவில் உங்கள் ரேங்க் மற்றும் முன்னணி பட்டியல் காணலாம்.</li>
        </ul>
      </div>
    </div>
  );
}
