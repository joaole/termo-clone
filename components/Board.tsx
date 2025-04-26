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
  const [usedKeys, setUsedKeys] = useState<
    Record<string, "correct" | "present" | "absent">
  >({});
  const [message, setMessage] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);

  const updateUsedKeys = (guess: string, answer: string) => {
    const updated = { ...usedKeys };
    const answerArr = answer.toUpperCase().split("");

    guess
      .toUpperCase()
      .split("")
      .forEach((letter, index) => {
        if (letter === answerArr[index]) {
          updated[letter] = "correct";
        } else if (answerArr.includes(letter)) {
          if (updated[letter] !== "correct") {
            updated[letter] = "present";
          }
        } else {
          if (!updated[letter]) {
            updated[letter] = "absent";
          }
        }
      });

    setUsedKeys(updated);
  };

  const handleKeyPress = (key: string) => {
    if (finished) return;

    if (key === "Enter") {
      if (
        currentGuess.length === COLS &&
        isValidWord(currentGuess.toLowerCase())
      ) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        updateUsedKeys(currentGuess, answer);

        if (answer.toUpperCase() === currentGuess.toUpperCase()) {
          setMessage("🎉 Congratulations! You guessed the word!");
          setFinished(true);
        } else if (newGuesses.length === ROWS) {
          setMessage(`❌ Game Over! The word was ${answer.toUpperCase()}.`);
          setFinished(true);
        }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuess, guesses, finished]);

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
                return <Title key={colIndex} letter={letter} status={status} />;
              })}
            </div>
          );
        })}
      </div>
      <Keyboard onKeyPress={handleKeyPress} usedKeys={usedKeys} />
      {message && (
        <div className="mt-4 text-lg font-semibold text-center">
          {message}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
// This code defines a word-guessing game board component. It manages the state of guesses, current input, and keyboard interactions. The component updates the used keys based on the player's guesses and provides feedback on the game status. The player can input letters, submit guesses, and see the results visually. The game ends when the player either guesses the word correctly or exhausts all attempts.