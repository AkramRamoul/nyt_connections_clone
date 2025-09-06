import { cn } from "@/lib/utils";

interface Props {
  word: string;
  onClick: () => void;
  selected: boolean;
}
const WordTile = ({ word, onClick, selected }: Props) => {
  return (
    <button
      className={cn(
        "h-20 w-36 font-bold text-xl rounded-md text-black p-3 border border-gray-200 bg-[#f0f0e6]",
        selected && "bg-[#59584e] text-white"
      )}
      onClick={onClick}
    >
      {word}
    </button>
  );
};

export default WordTile;
