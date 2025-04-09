"use client";

import { useState, useEffect } from "react";
import Title from "./Title";
import Keyboard from "./Keyboard";
import { isValidWord } from "@/data/words";

const ROWS = 6;
const COLS = 5;

export default function Board({ answer }: { answer: string }) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const handleKeyPress = (key: string) => {
    if (guesses.length >= ROWS) return;

    if (key === "Enter") {
      if (
        currentGuess.length === COLS &&
        isValidWord(currentGuess.toLowerCase())
      ) {
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess("");
      }
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < COLS) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess, guesses]);

  const getStatus = (letter: string, index: number, target: string) => {
    if (letter === target[index]) return "correct";
    if (target.includes(letter)) return "present";
    return "absent";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-rows-6 gap-1 mb-4">
        {Array.from({ length: ROWS }).map((_, rowIndex) => {
          const guess =
            guesses[rowIndex] ||
            (rowIndex === guesses.length ? currentGuess : "");
          return (
            <div key={rowIndex} className="flex gap-1">
              {Array.from({ length: COLS }).map((_, colIndex) => {
                const letter = guess[colIndex] || "";
                const status =
                  guesses[rowIndex] && letter
                    ? getStatus(letter, colIndex, answer.toUpperCase())
                    : undefined;
                return (
                  <Title key={colIndex} letter={letter || ""} status={status} />
                );
              })}
            </div>
          );
        })}
      </div>
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
}
