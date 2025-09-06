"use client";

import GameBoard from "@/components/GameBoard";
import puzzle from "../data/puzzle.json";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Lives from "@/components/Lives";
import { toast } from "sonner";

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<
    { category: string; words: string[]; color: string }[]
  >([]);
  const [lives, setLives] = useState(4);

  const [wrong, setWrong] = useState<boolean>(false);

  const [shuffled, setShuffled] = useState<string[]>([]);

  useEffect(() => {
    const allWords = puzzle.groups.flatMap((g) => g.words);
    setShuffled([...allWords].sort(() => Math.random() - 0.5));
  }, []);

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

    const found = puzzle.groups.find((g) =>
      g.words.every((w) => selected.includes(w))
    );

    if (found && !solved.some((s) => s.category === found.category)) {
      // ✅ correct group
      setSolved((prev) => [...prev, found]);
      setSelected([]);
    } else {
      if (isOneAway(selected, puzzle.groups)) {
        console.log("One away!");
        toast("You're one away!", {
          description: "Try swapping one word.",
        });
      }

      setLives((prev) => prev - 1);
      setWrong(true);

      setTimeout(() => {
        setWrong(false);
        setSelected([]);
      }, 600);
    }
  };
  const shuffle = () => {
    setShuffled((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#ffffff]">
      <h1 className="text-3xl font-bold mb-6 text-black">Connections Clone</h1>

      <GameBoard
        words={shuffled}
        onSelect={handleSelect}
        selected={selected}
        Solved={solved}
        wrong={wrong}
      />

      <Lives lives={lives} />

      <div className="flex flex-row gap-4 mt-4">
        <Button
          onClick={shuffle}
          className="rounded-full h-12 border"
          variant={"outline"}
        >
          Shuffle
        </Button>
        <Button
          onClick={() => setSelected([])}
          className="rounded-full h-12 border"
          variant={"outline"}
        >
          Deselct All
        </Button>
        <Button onClick={checkGroup} className="rounded-full bg-black h-12">
          Check Group
        </Button>
      </div>
    </main>
  );
}
