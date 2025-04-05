type Props = {
    letter: string;
    status?: "correct" | "present" | "absent";
};

export default function Title({ letter, status }: Props) {
    const colors = {
        correct: "text-green-500",
        present: "text-yellow-500",
        absent: "text-gray-400",
    };

    return (
        <div className={`w-12 h-12 border text-xl flex items-center justify-center font-bold uppercase ${status ? colors[status] : 'border-gray-300'}`}>
      {letter}
    </div>
    )
}