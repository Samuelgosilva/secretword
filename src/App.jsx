// CSS
import './App.css'

// React
import { useCallback, useEffect, useState } from 'react'

// data
import { wordsList } from './data/words'

//components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'},
]

const guessesQty = 3

function App() {
  
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // pegar uma categoria aleatória
    const categories = Object.keys(words)
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // pegar uma palavra aleatoria
    const word = words[category][Math.floor(Math.random() * words[category].length)]  

    return {word, category}
  }, [words])


  // start the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStages()

    // pegar uma palavra e uma categoria
    const {word, category} = pickWordAndCategory()

    //criando array de letras
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    console.log(word, category)
    console.log(wordLetters)

    //setando status
    setPickedWord(word)
    setPickCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])
 
  //process the letter input

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    // chegar se a letra ja foi utilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)
    ){
      return
    }

    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStages = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check if guesses ended
  useEffect(() => {

    if(guesses <= 0){
      // resetar o jogo após o end game
      clearLetterStages()

      setGameStage(stages[2].name)
    }

  }, [guesses])

  // check win condition
  useEffect(() => {

    const uniqueLetters = [... new Set(letters)]

    // win condition
    if(guessedLetters.length === uniqueLetters.length){
      // add score
      setScore((actualScore) => actualScore += 100)

      //restart game with new word
      startGame()
    }

  }, [guessedLetters, letters, startGame])

  //restart the game
  const retry =() => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}

    </div>
  )
}

export default App
