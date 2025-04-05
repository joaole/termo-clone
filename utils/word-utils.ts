import { WORD_LIST } from "@/data/words";

export function getRandomWord() {
    const index = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[index];
}