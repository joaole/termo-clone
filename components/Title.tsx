type Props = {
  letter: string;
  status?: "correct" | "present" | "absent";
};

export default function Title({ letter, status }: Props) {
  const baseStyle =
    "w-12 h-12 border text-xl flex items-center justify-center font-bold uppercase transition-all duration-300";

  const colors = {
    correct: "text-green-500",
    present: "text-yellow-500",
    absent: "text-gray-400",
  };

  const style = status ? colors[status] : "border-gray-300 bg-white";

  return (
    <div className={`${baseStyle} ${style} ${letter ? "flip-in" : ""}`}>
      {letter}
    </div>
  );
}

// This code defines a Title component that displays a letter in a styled box. The box's appearance changes based on the letter's status (correct, present, absent) and includes a flip-in animation when the letter is present. The component uses Tailwind CSS classes for styling and transitions.
