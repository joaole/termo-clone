"use client";

type KeyboardProps = {
  onKeyPress: (key: string) => void;
  usedKeys: Record<string, "correct" | "present" | "absent">;
};

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function Keyboard({ onKeyPress, usedKeys }: KeyboardProps) {
  const colors = {
    correct: "bg-green-500 text-white",
    present: "bg-yellow-500 text-white",
    absent: "bg-gray-400 text-white",
  };

  return (
    <div className="mt-4 space-y-2">
      {KEYS.map((row, index) => (
        <div key={index} className="flex justify-center gap-1">
          {row.split("").map((key) => (
            <button
              key={key}
              className={`px-3 py-2 rounded font-bold ${
                usedKeys[key] ? colors[usedKeys[key]] : "bg-gray-200"
              }`}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-1 mt-2">
        <button
          onClick={() => onKeyPress("Enter")}
          className="px-4 py-2 bg-gray-300 rounded font-bold"
        >
          Enter
        </button>
        <button
          onClick={() => onKeyPress("Backspace")}
          className="px-4 py-2 bg-gray-300 rounded font-bold"
        >
          Backspace
        </button>
      </div>
    </div>
  );
}
// This code defines a keyboard component for a word-guessing game. It displays the keys in rows and allows the user to click on them to input letters. The colors of the keys change based on their status (correct, present, absent) as defined in the `usedKeys` prop. The component also includes buttons for "Enter" and "Backspace" to handle special key actions.