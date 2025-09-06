import { motion, AnimatePresence } from "framer-motion";
import WordTile from "./WordTile";

interface GameBoardProps {
  words: string[];
  onSelect: (word: string) => void;
  selected: string[];
  Solved: { category: string; words: string[]; color: string }[];
  wrong?: boolean;
}

const GameBoard = ({
  words,
  onSelect,
  selected,
  Solved,
  wrong,
}: GameBoardProps) => {
  const solvedWords = Solved.flatMap((g) => g.words);
  const remainingWords = words.filter((w) => !solvedWords.includes(w));

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {Solved.map((group) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col items-center justify-center gap-1 p-4 rounded-lg text-black`}
            style={{ backgroundColor: group.color }}
          >
            <span className="font-extrabold uppercase text-xl">
              {group.category}
            </span>
            <span className="font-semibold text-xl">
              {group.words.join(", ")}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {remainingWords.map((word) => {
          const isSelected = selected.includes(word);
          return (
            <motion.div
              key={word}
              animate={
                wrong && isSelected ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }
              }
              transition={{ duration: 0.6 }}
            >
              <WordTile
                word={word}
                onClick={() => onSelect(word)}
                selected={isSelected}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
