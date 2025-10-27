import React from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Shuffle, Undo, SendHorizontal } from "lucide-react";
import {
  isGuessCorrect,
  isGuessRepeated,
  shuffleGameData,
} from "../../lib/game-helpers";

import { GameStatusContext } from "../../providers/GameStatusProvider";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";

function GameControlButtonsPanel({
  shuffledRows,
  setShuffledRows,
  setGridShake,
}) {
  const {
    isGameOver,
    guessCandidate,
    setGuessCandidate,
    submittedGuesses,
    setSubmittedGuesses,
    solvedGameData,
    setSolvedGameData,
  } = React.useContext(GameStatusContext);
  const { gameData, categorySize, hasRepeats } = React.useContext(PuzzleDataContext);
  const { toast } = useToast();

  function deselectAll() {
    setGuessCandidate([]);
  }

  function submitCandidateGuess() {
    // check that it's a valid guess by size
    if (guessCandidate.length !== categorySize) {
      return;
    }
    // check that the guess hasn't already been submitted previously
    if (!hasRepeats && isGuessRepeated({ submittedGuesses, guessCandidate })) {
      toast({
        label: "Notification",
        title: "Repeated Guess",
        description: "You previously made this guess!",
      });

      return;
    }
    // add guess to state
    setSubmittedGuesses([...submittedGuesses, guessCandidate]);
    const checkGameData = hasRepeats ? gameData.slice(solvedGameData.length) : gameData;
    // check if the guess is correct
    const {
      isCorrect,
      correctWords,
      correctCategory,
      isGuessOneAway,
      correctDifficulty,
      correctImageSrc,
    } = isGuessCorrect({
      guessCandidate,
      gameData: checkGameData,
    });

    // if the guess is correct:
    // set it as solved in game data
    if (isCorrect) {
      setSolvedGameData([
        ...solvedGameData,
        {
          category: correctCategory,
          words: correctWords,
          difficulty: correctDifficulty,
          imageSrc: correctImageSrc,
        },
      ]);
      setGuessCandidate([]);
    } else {
      // Shake the grid to give feedback that they were wrong
      setGridShake(true);
      if (isGuessOneAway) {
        toast({
          label: "Notification",
          title: "Close Guess",
          description:
            "You were one guess away from correctly guessing a category!",
        });
      }
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <Button
        variant="submit"
        onClick={submitCandidateGuess}
        disabled={isGameOver || guessCandidate.length !== categorySize}
      >
        <SendHorizontal className="h-4 w-4 mr-2" strokeWidth={1} />
        <p className="select-none">Submit</p>
      </Button>
    </div>
  );
}

export default GameControlButtonsPanel;
