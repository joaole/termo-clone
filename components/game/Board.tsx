"use client";

import { useState, useEffect } from "react";
import Title from "./Title";
import Keyboard from "./Keyboard";
import { isValidWord } from "@/data/words";

type BoardProps = {
  answers: string[];
  ROWS: number;
};

const COLS = 5; // Número de colunas (letras) por linha

export default function Board({ answers, ROWS }: BoardProps) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [usedKeys, setUsedKeys] = useState<
    Record<string, "correct" | "present" | "absent">
  >({});
  const [message, setMessage] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);

  const updateUsedKeys = (guess: string) => {
    const updated = { ...usedKeys };

    // Iterar sobre todas as respostas para marcar as letras
    answers.forEach((answer) => {
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
        updateUsedKeys(currentGuess);

        // Verificar se o palpite está correto para qualquer uma das respostas
        const isCorrect = answers.some(
          (answer) => answer.toUpperCase() === currentGuess.toUpperCase()
        );

        if (isCorrect) {
          setMessage("🎉 Congratulations! You guessed one of the words!");
          setFinished(true);
        } else if (newGuesses.length === ROWS) {
          setMessage(
            `❌ Game Over! The words were: ${answers
              .map((a) => a.toUpperCase())
              .join(", ")}.`
          );
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

  const getStatus = (letter: string, index: number) => {
    // Verificar se a letra está correta para qualquer uma das respostas
    const statuses = answers.map((answer) => {
      if (letter === answer.toUpperCase()[index]) return "correct";
      if (answer.toUpperCase().includes(letter)) return "present";
      return "absent";
    });

    // Prioridade: "correct" > "present" > "absent"
    if (statuses.includes("correct")) return "correct";
    if (statuses.includes("present")) return "present";
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
                    ? getStatus(letter, colIndex)
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
