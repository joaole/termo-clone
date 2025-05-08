"use client";

import { getRandomWords } from "@/utils/word-utils";
import Board from "@/components/game/Board";
import { useState, useEffect } from "react";

export default function ClassicoPage() {
  const [word, setWord] = useState<string[]>([]);

  useEffect(() => {
    setWord(getRandomWords(1));
  }, []);

  if (!word) return <p>Carregando...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Modo Clássico</h1>
      <Board answers={word} ROWS={6} />
    </main>
  );
}
