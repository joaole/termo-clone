import { WORD_LIST } from "@/data/words";

export function getRandomWord(): string {
    const index = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[index];
}

export function getRandomWords(count: number): string[] {
    const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}