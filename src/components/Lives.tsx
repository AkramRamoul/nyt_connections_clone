interface Props {
  lives: number;
}

export default function Lives({ lives }: Props) {
  return (
    <div className="flex gap-2 mb-4 flex-row items-center font-light justify-center text-lg">
      <p>Mistakes remaining:</p>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`h-4 w-4 rounded-full ${
            i < lives ? "bg-[#59584e]" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
