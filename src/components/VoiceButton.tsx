import { useState } from "react";

interface Props {
  onTranscript: (text: string) => void;
  label?: string;
}

const VoiceButton: React.FC<Props> = ({ onTranscript, label }) => {
  const [listening, setListening] = useState(false);

  const handleClick = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("הדפדפן לא תומך בזיהוי דיבור.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "he-IL";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
        listening
          ? "border-green-500 text-green-700 bg-green-50"
          : "border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
      }`}
    >
      🎙️ {listening ? "מאזין..." : label || "הפעל קול"}
    </button>
  );
};

export default VoiceButton;
