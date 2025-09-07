"use client";

import GameBoard from "@/components/GameBoard";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Lives from "@/components/Lives";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getTodayKey, Puzzle } from "@/lib/utils";

import allPuzzles from "../data/puzzle.json";

export default function Home() {
  const puzzles = allPuzzles as Puzzle[];

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    const todayKey = getTodayKey();
    const todayPuzzle = puzzles.find((p) => p.date === todayKey);

    if (!todayPuzzle) {
      console.error("no puzzle ", todayKey);
      setPuzzle(puzzles[puzzles.length - 1]);
      return;
    }

    setPuzzle(todayPuzzle);

    const saved = localStorage.getItem(`connections-game-${todayKey}`);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setSolved(state.solved || []);
        setLives(state.lives ?? 4);
        setAttempts(state.attempts || 0);
        setGameOver(state.gameOver || false);
        setShuffled(
          state.shuffled || todayPuzzle.groups.flatMap((g) => g.words)
        );
        setOpen(state.open || false);
        return;
      } catch (err) {
        console.error("Failed to parse saved state:", err);
      }
    }

    const allWords = todayPuzzle.groups.flatMap((g) => g.words);
    setShuffled([...allWords].sort(() => Math.random() - 0.5));
  }, [puzzles]);

  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<
    { category: string; words: string[]; color: string }[]
  >([]);
  const [lives, setLives] = useState(4);
  const [wrong, setWrong] = useState(false);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [open, setOpen] = useState(false);

  const todayKey = getTodayKey();
  const storageKey = `connections-game-${todayKey}`;

  useEffect(() => {
    const state = {
      solved,
      lives,
      attempts,
      gameOver,
      shuffled,
      open,
    };

    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [solved, lives, attempts, gameOver, shuffled, open, storageKey]);

  const handleSelect = (word: string) => {
    setSelected((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  function isOneAway(selected: string[], groups: { words: string[] }[]) {
    for (const g of groups) {
      const matches = g.words.filter((w) => selected.includes(w)).length;
      if (matches === 3 && selected.length === 4) {
        return true;
      }
    }
    return false;
  }

  const checkGroup = () => {
    if (selected.length !== 4) return;

    const found = puzzle?.groups.find((g) =>
      g.words.every((w) => selected.includes(w))
    );

    if (found && !solved.some((s) => s.category === found.category)) {
      setSolved((prev) => [...prev, found]);
      setSelected([]);

      if (solved.length + 1 === puzzle?.groups.length) {
        setGameOver(true);
        setOpen(true);
      }
    } else {
      setAttempts((prev) => prev + 1);

      if (isOneAway(selected, puzzle?.groups || [])) {
        toast("One away...", {
          position: "top-center",
          duration: 1400,
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
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
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

      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          setOpen(true);
        }
        return newLives;
      });

      setWrong(true);
      setTimeout(() => setWrong(false), 600);
    }
  };

  const shuffle = () => {
    setShuffled((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#ffffff]">
      <h2 className="text-2xl mb-6 text-black">Create four groups of four!</h2>

      {shuffled.length > 0 && (
        <GameBoard
          words={shuffled}
          onSelect={handleSelect}
          selected={selected}
          Solved={solved}
          wrong={wrong}
          correctGroups={puzzle?.groups || []}
          lives={lives}
        />
      )}

      {!gameOver ? (
        <>
          <Lives lives={lives} />
          <div className="flex flex-row gap-4 mt-4">
            <Button
              onClick={shuffle}
              className="rounded-full h-12 border text-xl font-semibold"
              variant={"outline"}
            >
              Shuffle
            </Button>
            <Button
              onClick={() => setSelected([])}
              className="rounded-full h-12 border text-xl font-semibold"
              variant={"outline"}
            >
              Deselect All
            </Button>
            <Button
              disabled={selected.length !== 4}
              onClick={checkGroup}
              className="text-xl font-semibold rounded-full bg-black h-12"
            >
              Submit
            </Button>
          </div>
        </>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="text-xl font-semibold rounded-full bg-black h-12 mt-4"
        >
          View Results
        </Button>
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Results</DrawerTitle>
              <DrawerDescription>
                {gameOver &&
                  (lives > 0
                    ? `You got it in ${attempts} ${
                        attempts === 1 ? "try" : "tries"
                      } today!`
                    : "Try again next time!")}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold tracking-tight">
                    {lives > 0 ? "🎉 Victory!" : "💀 Game Over"}
                  </div>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Back to puzzle</Button>
              </DrawerClose>
              <Button
                onClick={() => {
                  localStorage.removeItem(storageKey);
                  window.location.reload();
                }}
                variant={"outline"}
              >
                Reset Game
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
