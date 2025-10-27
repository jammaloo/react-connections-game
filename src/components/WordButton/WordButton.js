import React from "react";
import * as styles from "./WordButton.module.css";
import { Toggle } from "../ui/toggle";

import { GameStatusContext } from "../../providers/GameStatusProvider";

function WordButton({ word, fullCandidateSize }) {
  const { guessCandidate, setGuessCandidate } =
    React.useContext(GameStatusContext);
  const [isSelected, setIsSelected] = React.useState(
      false
  );

  const isCandidateListFull = guessCandidate.length === fullCandidateSize;

  React.useEffect(() => {
    if (guessCandidate.length === 0) {
      setIsSelected(false);
    }
  }, [guessCandidate]);

  function flipSelection() {
    if (isSelected) {
      // remove from candidateGuess
      const updatedGuessCandidate = guessCandidate.filter((w) => {
        return w !== word;
      });
      setGuessCandidate(updatedGuessCandidate);
      // set state to *not* selected
      setIsSelected(false);
    } else {
      // check if the candidate array is full
      if (!isCandidateListFull) {
        // add to candidateGuess array
        setGuessCandidate([...guessCandidate, word]);
        // set state to *selected*
        setIsSelected(true);
      }
    }
  }

  //const fontSizeByWordLength = 9characters works with 0.6rem

  function getFontSize(word) {
    const baseLength = 7;
    let wordLength = word.length;
    let fontSize = 1;
    if (wordLength > baseLength) {
      const numExtraChars = wordLength - baseLength;
      fontSize = fontSize - numExtraChars * 0.1;
      fontSize = Math.max(0.5, fontSize);
      return `${fontSize}em`;
    } else {
      return null;
    }
  }
  // word = "washingtonian";
  return (
    <Toggle
      className={`${styles.growShrink} select-none`}
      variant="outline"
      pressed={isSelected}
      onClick={flipSelection}
      style={{backgroundColor: isSelected ? '#5a594e' : '#efefe6',
      color: isSelected ? '#ffffff' : '#152342'}}
    >
      <p
        style={{ fontSize: getFontSize(word) }}
        className="font-space-mono uppercase sm:text-xs md:text-xs"
      >
        {word}
      </p>
    </Toggle>
  );
}

export default WordButton;
