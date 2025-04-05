"use client";

import { getRandomWords } from "@/utils/word-utils";

export default function GamePage({ params }: { params: { modo: string } }) {
    const modeMap = {
        classico: 1,
        dueto: 2,
        quarteto: 4,
    };
    const wordCount = modeMap[params.modo] || 1;
    const words = getRandomWords(wordCount);

    return(
        <div>
            <h1>{params.modo.toUpperCase}</h1>
        </div>
    )
}
