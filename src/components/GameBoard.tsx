import { motion, AnimatePresence } from "framer-motion";
import WordTile from "./WordTile";
import React from "react";
import { toast } from "sonner";

interface GameBoardProps {
  words: string[];
  onSelect: (word: string) => void;
  selected: string[];
  Solved: { category: string; words: string[]; color: string }[];
  wrong?: boolean;
  lives: number;
  correctGroups: { category: string; words: string[]; color: string }[];
}

const GameBoard = ({
  words,
  onSelect,
  selected,
  Solved,
  wrong,
  lives,
  correctGroups,
}: GameBoardProps) => {
  const solvedWords = Solved.flatMap((g) => g.words);
  const remainingWords = words.filter((w) => !solvedWords.includes(w));

  const [revealed, setRevealed] = React.useState<
    { category: string; words: string[]; color: string }[]
  >([]);

  const handleClick = (word: string) => {
    if (selected.includes(word)) {
      onSelect(word);
    } else if (selected.length < 4) {
      onSelect(word);
    }
  };

  React.useEffect(() => {
    console.log("lives changed:", lives);
    if (lives <= 0) {
      setRevealed(correctGroups.filter((g) => !Solved.includes(g)));
      toast("Next time", {
        position: "top-center",
        style: {
          position: "fixed",
          left: "50%",
          top: "18px",
          transform: "translateX(-50%)",
          zIndex: 9999,

          display: "inline-block",
          width: "auto",
          padding: "8px 18px",
          borderRadius: "8px",
          backgroundColor: "#000",
          color: "#fff",

          fontWeight: 900,
          fontSize: "15px",
          lineHeight: "1.2",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          textAlign: "center",
          whiteSpace: "nowrap",
        },
      });
    }
  }, [lives, correctGroups, Solved]);

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {[...Solved, ...revealed].map((group) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-4 gap-4 p-4 rounded-lg text-black w-full"
            style={{ backgroundColor: group.color }}
          >
            <div className="col-span-4 flex flex-col items-center gap-1">
              <span className="font-extrabold uppercase text-xl">
                {group.category}
              </span>
              <span className="font-semibold text-xl text-center">
                {group.words.join(", ")}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hide word grid if game over */}
      {lives > 0 && (
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
                  onClick={() => handleClick(word)}
                  selected={isSelected}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
