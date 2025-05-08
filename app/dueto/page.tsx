"use client";

import { getRandomWords } from "@/utils/word-utils";
import Board from "@/components/game/Board";
import { useEffect, useState } from "react";

export default function DuetoPage() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(getRandomWords(2));
  }, []);

  if (words.length === 0) return <p>Carregando...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Modo Dueto</h1>
      <Board answers={words} />
    </main>
  );
}
