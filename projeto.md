Perfeito, já entendi o vibe do projeto! Então a gente vai fazer:

✅ **Frontend only (Next.js)**  
✅ **Geração dinâmica de palavras (client-side)**  
✅ **Modos: Clássico (1 palavra), Dueto (2), Quarteto (4)**  
✅ Estilo e interação parecidos com o Termo original  

---

### 👷‍♂️ Estrutura inicial do projeto (Next.js 14 / App Router):

```bash
npx create-next-app termo-clone --typescript
# ou com Tailwind (opcional)
npx create-next-app termo-clone --typescript --tailwind
```

---

### 🧱 Estrutura de pastas sugerida:

```
/app
  /[modo]               ← rota dinâmica: "classico", "dueto", "quarteto"
    page.tsx            ← renderiza o jogo conforme o modo
/components
  Board.tsx             ← o grid principal de letras
  Keyboard.tsx          ← teclado virtual
  Tile.tsx              ← componente de cada letra/quadrado
/lib
  word-utils.ts         ← lógica de seleção de palavras e validações
/data
  words.ts              ← lista de palavras válidas e palavras do dia
/styles
  globals.css           ← estilos globais
```

---

### ⚙️ Ideia de funcionamento:

- O usuário acessa `/classico`, `/dueto`, ou `/quarteto`.
- O app seleciona **1, 2 ou 4 palavras aleatórias** da lista.
- O estado do jogo (tentativas, letras digitadas, feedback) é controlado via **React state/context**.
- As palavras válidas são conferidas contra a lista.
- O teclado mostra o feedback colorido também.

---

### ✨ Dicas para começar:

1. **Gerar palavras dinamicamente**

```ts
// lib/word-utils.ts
import { WORD_LIST } from '@/data/words';

export const getRandomWords = (count: number) => {
  const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
```

2. **Rota dinâmica para os modos**

```ts
// app/[modo]/page.tsx
'use client';

import { getRandomWords } from '@/lib/word-utils';

export default function GamePage({ params }: { params: { modo: string } }) {
  const modeMap = { classico: 1, dueto: 2, quarteto: 4 };
  const wordCount = modeMap[params.modo] || 1;
  const words = getRandomWords(wordCount);

  return (
    <div>
      <h1>{params.modo.toUpperCase()}</h1>
      {/* Componente Board passando as palavras */}
    </div>
  );
}
```

3. **Componente básico de Board**

```tsx
// components/Board.tsx
export default function Board({ words }: { words: string[] }) {
  // controla os estados das tentativas, validação, etc.
  return (
    <div className="grid">
      {/* grid de 5x6 para cada palavra */}
    </div>
  );
}
```

---

Se quiser, posso montar os primeiros arquivos pra ti (tipo `Board`, `Keyboard`, o grid, controle de letras, etc.) e ir construindo junto contigo.

Quer que eu comece com a tela de jogo clássica (1 palavra) com o grid e teclado funcionando?

Show! Vamos começar com o modo **Clássico** (1 palavra) e montar a base do jogo:

- Página `/classico`
- Geração de uma palavra aleatória
- Grid 6x5 (6 tentativas, palavras de 5 letras)
- Estado do jogo
- Teclado virtual
- Validação básica e feedback (verde, amarelo, cinza)

---

### 📁 Estrutura inicial

#### ✅ `data/words.ts` (palavras válidas e possíveis respostas)

```ts
// data/words.ts
export const WORD_LIST = [
  'canto', 'troca', 'casal', 'morte', 'nuvem', 'tenso', 'lente',
  'piano', 'sorte', 'fundo', 'pacto', 'limpo', 'frase', 'ponto'
];

export const isValidWord = (word: string) => WORD_LIST.includes(word);
```

---

#### ✅ `lib/word-utils.ts` (função pra gerar palavras aleatórias)

```ts
// lib/word-utils.ts
import { WORD_LIST } from '@/data/words';

export function getRandomWord() {
  const index = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[index];
}
```

---
#### ✅ `components/Tile.tsx` (cada letra/quadrado)

```tsx
// components/Tile.tsx
type Props = {
  letter: string;
  status?: 'correct' | 'present' | 'absent';
};

export default function Tile({ letter, status }: Props) {
  const colors = {
    correct: 'bg-green-500',
    present: 'bg-yellow-500',
    absent: 'bg-gray-400',
  };

  return (
    <div className={`w-12 h-12 border text-xl flex items-center justify-center font-bold uppercase ${status ? colors[status] : 'border-gray-300'}`}>
      {letter}
    </div>
  );
}
```

---

#### ✅ `components/Keyboard.tsx` (teclado virtual simples)

```tsx
// components/Keyboard.tsx
type Props = {
  onKeyPress: (key: string) => void;
};

const KEYS = [
  'QWERTYUIOP',
  'ASDFGHJKL',
  'ZXCVBNM',
];

export default function Keyboard({ onKeyPress }: Props) {
  return (
    <div className="mt-4 space-y-2">
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.split('').map((k) => (
            <button
              key={k}
              className="bg-gray-200 px-3 py-2 rounded font-bold"
              onClick={() => onKeyPress(k)}
            >
              {k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---
# AQUI
#### ✅ `components/Board.tsx` (grid principal)

```tsx
// components/Board.tsx
'use client';

import { useState, useEffect } from 'react';
import Tile from './Tile';
import Keyboard from './Keyboard';
import { isValidWord } from '@/data/words';

const ROWS = 6;
const COLS = 5;

export default function Board({ answer }: { answer: string }) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');

  const handleKeyPress = (key: string) => {
    if (guesses.length >= ROWS) return;

    if (key === 'ENTER') {
      if (currentGuess.length === COLS && isValidWord(currentGuess.toLowerCase())) {
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess('');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < COLS) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const getStatus = (letter: string, index: number, target: string) => {
    if (letter === target[index]) return 'correct';
    else if (target.includes(letter)) return 'present';
    else return 'absent';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-rows-6 gap-1 mb-4">
        {Array.from({ length: ROWS }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : '');
          return (
            <div key={rowIndex} className="flex gap-1">
              {Array.from({ length: COLS }).map((_, colIndex) => {
                const letter = guess[colIndex] || '';
                const status =
                  guesses[rowIndex] && letter
                    ? getStatus(letter, colIndex, answer.toUpperCase())
                    : undefined;
                return <Tile key={colIndex} letter={letter || ''} status={status} />;
              })}
            </div>
          );
        })}
      </div>
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
}
```

---

#### ✅ `app/classico/page.tsx` (página principal do jogo)

```tsx
// app/classico/page.tsx
'use client';

import { getRandomWord } from '@/lib/word-utils';
import Board from '@/components/Board';
import { useState, useEffect } from 'react';

export default function ClassicoPage() {
  const [word, setWord] = useState('');

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  if (!word) return <p>Carregando...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Modo Clássico</h1>
      <Board answer={word} />
    </main>
  );
}
```

---

### ✅ Estilos (com Tailwind)

Se você não usou o `--tailwind` na criação, posso te ajudar a configurar rapidinho.

---

Quer que eu monte agora o **modo Dueto** reutilizando essa estrutura? Ele vai só chamar duas palavras e renderizar dois tabuleiros sincronizados. Posso mandar a próxima etapa se quiser. 😎

Perfeito! Com Tailwind já configurado, bora montar o **modo Dueto**! Vamos reaproveitar tudo o que já criamos e adaptar para suportar **múltiplas palavras simultâneas**.

---

### 🧠 Lógica geral do Dueto:

- Duas palavras aleatórias
- Duas grades 6x5 lado a lado
- O teclado serve para ambas: cada tentativa vale para as duas palavras
- A tentativa só avança se for uma palavra válida
- O feedback é dado para cada tabuleiro individualmente

---

## ✅ 1. Modifique `Board.tsx` para suportar múltiplas respostas

Vamos torná-lo mais flexível.

```tsx
// components/Board.tsx
'use client';

import { useState } from 'react';
import Tile from './Tile';
import Keyboard from './Keyboard';
import { isValidWord } from '@/data/words';

const ROWS = 6;
const COLS = 5;

type Props = {
  answers: string[]; // agora pode ser 1 ou mais palavras
};

export default function Board({ answers }: Props) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');

  const handleKeyPress = (key: string) => {
    if (guesses.length >= ROWS) return;

    if (key === 'ENTER') {
      const guess = currentGuess.toLowerCase();
      if (currentGuess.length === COLS && isValidWord(guess)) {
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess('');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < COLS) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const getStatus = (letter: string, index: number, target: string) => {
    if (letter === target[index]) return 'correct';
    else if (target.includes(letter)) return 'present';
    else return 'absent';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Vários boards lado a lado */}
      <div className={`flex gap-8 mb-4`}>
        {answers.map((answer, boardIndex) => (
          <div key={boardIndex} className="grid grid-rows-6 gap-1">
            {Array.from({ length: ROWS }).map((_, rowIndex) => {
              const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : '');
              return (
                <div key={rowIndex} className="flex gap-1">
                  {Array.from({ length: COLS }).map((_, colIndex) => {
                    const letter = guess[colIndex] || '';
                    const status =
                      guesses[rowIndex] && letter
                        ? getStatus(letter, colIndex, answer.toUpperCase())
                        : undefined;
                    return (
                      <Tile key={colIndex} letter={letter || ''} status={status} />
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
}
```

---

## ✅ 2. Crie a página do Dueto

```tsx
// app/dueto/page.tsx
'use client';

import { getRandomWords } from '@/lib/word-utils';
import Board from '@/components/Board';
import { useEffect, useState } from 'react';

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
```

---

## ✅ 3. Atualize `word-utils.ts` para exportar `getRandomWords`

```ts
// lib/word-utils.ts
import { WORD_LIST } from '@/data/words';

export function getRandomWord(): string {
  const index = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[index];
}

export function getRandomWords(count: number): string[] {
  const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
```

---

### ✅ 4. Navegação entre modos (opcional)

Você pode criar um `Menu` simples na home:

```tsx
// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-4xl font-bold mb-6">Clone do Termo</h1>
      <Link href="/classico" className="text-lg font-semibold text-blue-600 hover:underline">
        Modo Clássico
      </Link>
      <Link href="/dueto" className="text-lg font-semibold text-blue-600 hover:underline">
        Modo Dueto
      </Link>
      {/* Depois colocamos o Quarteto aqui também */}
    </main>
  );
}
```

---

E aí, tudo funcionando até aqui?  
Se quiser, já posso montar o **modo Quarteto** (mesma lógica, 4 palavras), e depois a gente pode:

- Adicionar **animações nas letras**
- Melhorar feedback do teclado
- Mostrar mensagens tipo “Parabéns!” ou “Tente de novo”
- Adicionar botão de reiniciar / nova palavra

Me avisa o que quer priorizar a seguir 😄
Perfeito! Agora vamos deixar seu clone do Termo **mais interativo e polido** com:

1. ✅ Animação nas letras (ao entrar e mostrar resultado)  
2. ✅ Feedback visual no teclado (verde, amarelo, cinza)  
3. ✅ Mensagens de acerto/erro  
4. ✅ Botão de reiniciar o jogo

---

## ✅ 1. Animação nas letras

Vamos usar **Tailwind CSS** + **@keyframes** para animar a entrada das letras.

### 🔧 Adicione animações no CSS:

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .flip-in {
    animation: flipIn 0.3s ease forwards;
  }

  @keyframes flipIn {
    0% {
      transform: rotateX(90deg);
      opacity: 0;
    }
    100% {
      transform: rotateX(0deg);
      opacity: 1;
    }
  }
}
```

### ✨ Atualize `Tile.tsx`:

```tsx
// components/Tile.tsx
type Props = {
  letter: string;
  status?: 'correct' | 'present' | 'absent';
};

export default function Tile({ letter, status }: Props) {
  const baseStyle = 'w-12 h-12 border text-xl flex items-center justify-center font-bold uppercase transition-all duration-300';
  const colors = {
    correct: 'bg-green-500 text-white',
    present: 'bg-yellow-500 text-white',
    absent: 'bg-gray-500 text-white',
  };

  const style = status ? colors[status] : 'border-gray-300 bg-white';

  return (
    <div className={`${baseStyle} ${style} ${letter ? 'flip-in' : ''}`}>
      {letter}
    </div>
  );
}
```

---

## ✅ 2. Feedback no teclado

Precisamos rastrear quais letras já foram usadas e qual o status de cada uma.

### ✨ Atualize `Keyboard.tsx`:

```tsx
// components/Keyboard.tsx
type Props = {
  onKeyPress: (key: string) => void;
  usedKeys: Record<string, 'correct' | 'present' | 'absent'>;
};

const KEYS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export default function Keyboard({ onKeyPress, usedKeys }: Props) {
  const colors = {
    correct: 'bg-green-500 text-white',
    present: 'bg-yellow-500 text-white',
    absent: 'bg-gray-400 text-white',
  };

  return (
    <div className="mt-4 space-y-2">
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.split('').map((k) => (
            <button
              key={k}
              className={`px-3 py-2 rounded font-bold ${usedKeys[k] ? colors[usedKeys[k]] : 'bg-gray-200'}`}
              onClick={() => onKeyPress(k)}
            >
              {k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

### ✨ Atualize `Board.tsx` para controlar `usedKeys`:

Adicione estado e lógica:

```tsx
const [usedKeys, setUsedKeys] = useState<Record<string, 'correct' | 'present' | 'absent'>>({});
const [message, setMessage] = useState('');
const [finished, setFinished] = useState(false);

const updateUsedKeys = (guess: string, answers: string[]) => {
  const updated = { ...usedKeys };

  guess.toUpperCase().split('').forEach((letter, i) => {
    answers.forEach((answer) => {
      if (letter === answer[i].toUpperCase()) {
        updated[letter] = 'correct';
      } else if (answer.toUpperCase().includes(letter) && updated[letter] !== 'correct') {
        updated[letter] = 'present';
      } else if (!answer.toUpperCase().includes(letter) && !updated[letter]) {
        updated[letter] = 'absent';
      }
    });
  });

  setUsedKeys(updated);
};
```

E dentro do `handleKeyPress`, depois de adicionar o `guess`:

```tsx
updateUsedKeys(currentGuess, answers);

if (answers.every(a => a.toUpperCase() === currentGuess.toUpperCase())) {
  setMessage('🎉 Parabéns! Você acertou!');
  setFinished(true);
} else if (guesses.length + 1 >= ROWS) {
  setMessage(`😢 Fim de jogo! Palavras: ${answers.join(', ')}`);
  setFinished(true);
}
```

---

## ✅ 3. Mensagem + botão de reinício

Logo após o `<Keyboard />`:

```tsx
{message && (
  <div className="mt-4 text-lg font-semibold text-center">
    {message}
    <button
      onClick={() => window.location.reload()}
      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Jogar Novamente
    </button>
  </div>
)}
```

---

### Resultado:
✅ Letras com animação  
✅ Teclado colorido baseado nas tentativas  
✅ Mensagens automáticas ao ganhar ou perder  
✅ Botão de “Jogar Novamente” com recarregamento

---

### 🟡 Próximo nível?

Se quiser, os próximos upgrades podem ser:

- Histórico de vitórias/derrotas com localStorage
- “Palavra do dia” fixa para cada modo
- Compartilhamento do resultado (tipo 🟩🟨⬜)
- Timer ou modo rápido

Quer seguir por alguma dessas ideias ou montar o **modo Quarteto** agora? 😎