import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Termo Clone</h1>
      <p className="text-lg mb-4">Escolha um modo de jogo:</p>
      <div className="flex gap-4">
        <Link
          href="/classico"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Clássico
        </Link>
        <Link
          href="/dueto"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Dueto
        </Link>
        <Link
          href="/quarteto"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Quartetos
        </Link>
      </div>
    </div>
  );
}
