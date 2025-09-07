import { cn } from "@/lib/utils";

interface Props {
  word: string;
  onClick: () => void;
  selected: boolean;
}

const WordTile = ({ word, onClick, selected }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "aspect-[3/2] w-full min-w-[70px] max-w-[140px]",
        "flex items-center justify-center text-center",
        "font-bold text-sm sm:text-base md:text-lg lg:text-xl",
        "rounded-md border border-gray-200 bg-[#f0f0e6] px-2",
        "transition-all duration-200 ease-in-out",
        selected && "bg-[#59584e] text-white scale-105 shadow-lg"
      )}
    >
      <span className="break-words leading-tight">{word}</span>{" "}
    </button>
  );
};

export default WordTile;
