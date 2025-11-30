import { useState } from "react";
import { clsx } from "clsx";
import { languages } from "./languages";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti";

/**
 * Backlog:
 *
 *  Farewell messages in status section
 *  Disable the keyboard when the game is over
 *  Fix a11y issues
 *  Choose a random word from a list of words
 *  Make the New Game button reset the game
 *  Reveal what the word was if the user loses the game
 *  Confetti drop when the user wins
 */

export default function AssemblyEndgame() {
  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord()) //string
  const [guessedLetters, setGuessedLetters] = useState([]) //array
 
  // Derived values
  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split('').every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameLost || isGameWon
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  //function to add guessed letter.  use conditional and spread operator
  function addGuessedLetter(letter) {
    setGuessedLetters(prev => prev.includes(letter) ? prev : [...prev, letter])
  }


  //function to start a new game
  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }


  //langauge dom with variables
  //variable to show which language is gone using index. any language less than current index
  //const style variable for just what kind of color they are and font color
  //const className variable with clsx conditionals.  Already has 'chip', conditional for 'lost'
  //dom return with spans and styles and actual values in dom
  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const style = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    const className = clsx('chip', isLanguageLost && 'lost')
    return (
      <span 
        style={style}
        key={lang.name}
        className={className}>
        {lang.name}
      </span>
    )
  })


  //letter elements dom to reveal letters or not reveal them when guessed correctly incorrectly. letter and index map
  //const if the letter passed should be revealed (2x in the game it should, either when the game is lost or if it's in the currentword)
  //const className clsx for letters that are missed, which happens when game is lost and guessed letters don't include previous state, make it 'missed-letter'
  //the return ternary, if span should reveal the letter(and make it uppercase) or if nothing happens
  const letterElements = currentWord.split('').map((prev, index) => {
    const shouldLetterRevealed = isGameLost || guessedLetters.includes(prev) //does the previous state called letter, have the guessed letter
    const className = clsx(isGameLost && !guessedLetters.includes(prev) && 'missed-letter')
    return (
      <span>
        {shouldLetterRevealed ? prev.toUpperCase() : ''}
      </span>
    )
  })


  //keyboard elements (map again, split it because it's a string)
  //const has it been guessed?
  //const is it correct guess?
  //const is it a wrong guess?
  //const className for clsx
  //return buttons for keyboard


  //gameStatus Class for clsx css to show in the section that shows statuses. farewell will have a ternary.  clsx will always have "game-status"


  //function for rendering game status combine it with the clsx class you made
  //farewell text for incorrect guess (function using languages and a way to index the language bye to), game Won, game Lost, otherwise, return null


  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section aria-live="polite" role="status" className={gameStatusClass}>
        
      </section>

      <section className="language-chips"> 
        {languageElements}
      </section>

      <section className="word">  </section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>

      <section className="keyboard"> </section>

      <button className="new-game"  >New Game</button>
    </main>
  );
}
