"use client";

type Props = {
  onKeyPress: (key: string) => void;
};

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function Keyboard({ onKeyPress }: Props) {
  return (
    <div className="mt-4 space-y-2">
      {KEYS.map((row, index) => (
        <div key={index} className="flex justify-center gap-1">
          {row.split("").map((key) => (
            <button
              key={key}
              className="bg-gray-200 px-3 py-2 rounded dont-bold"
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
