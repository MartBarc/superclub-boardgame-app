import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom/client'
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle
} from "@mui/material";
import Card from "./Card.js";
import "./App.scss";


const uniqueElementsArray = [
  {
    type: "stock1",
    image: require(`./images/player612.jpeg`)
  },
  {
    type: "stock2",
    image: require(`./images/player612.jpeg`)
  },
  {
    type: "stock3",
    image: require(`./images/player612.jpeg`)
  },
  {
    type: "stock4",
    image: require(`./images/player612.jpeg`)
  },
  {
    type: "stock5",
    image: require(`./images/player612.jpeg`)
  },
  {
    type: "stock6",
    image: require(`./images/player612.jpeg`)
  },
  {
    type: "stock7",
    image: require(`./images/player612.jpeg`)
  },
];

function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

export default function App() {
  const [getMessage, setGetMessage] = useState({})
  useEffect(()=>{
    axios.get('https://superclub-boardgame-app.herokuapp.com/flask/hello').then(response => {
      console.log("SUCCESS", response)
      setGetMessage(response)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  const [cards, setCards] = useState(
    shuffleCards.bind(null, uniqueElementsArray.concat(uniqueElementsArray))
  );
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueElementsArray.length) {
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore);
    }
  };

  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };

  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);
  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.type]);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    // set a shuffled deck of cards
    setCards(shuffleCards(uniqueElementsArray.concat(uniqueElementsArray)));
  };

  const handleAddToBench = () => {

  };

  //const root = ReactDOM.createRoot(document.getElementById('root'));

/*
return (
  <Card
    key={index}
    card={card}
    index={index}
    isDisabled={shouldDisableAllCards}
    isInactive={checkIsInactive(card)}
    isFlipped={checkIsFlipped(index)}
    onClick={handleCardClick}
  />
);

return (
  root.render(
    <Card
      key={index}
      card={card}
      index={index}
      isDisabled={shouldDisableAllCards}
      isInactive={checkIsInactive(card)}
      isFlipped={checkIsFlipped(index)}
      onClick={handleCardClick}
    />
  )
);
*/

  return (
    <div className="App">

      <header className="App-header">
        <h3>Superclub Manager Mode</h3>
        <div>
          Select cards to move them from bench or starting lineup.
        </div>
      </header>

      <div class="float-container">
        <div class="float-child">
          <div className="container-cards">
            {cards.map((card, index) => {
              return (
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isDisabled={shouldDisableAllCards}
                  isInactive={checkIsInactive(card)}
                  isFlipped={checkIsFlipped(index)}
                />
              );
            })}
          </div>
        </div>
        <div class="float-child">
          <div className="container-cards">
            {cards.map((card, index) => {
              return (
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isDisabled={shouldDisableAllCards}
                  isInactive={checkIsInactive(card)}
                  isFlipped={checkIsFlipped(index)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div class="float-container">
        <div class="float-child">
          <Card
            key={0} //index
            card={uniqueElementsArray[0]} //card
            index={0} //index
            isDisabled={shouldDisableAllCards}
            isInactive={checkIsInactive(uniqueElementsArray[0])} //card
            isFlipped={checkIsFlipped(0)} //index
            onClick={handleCardClick}
          />
        </div>
        <div class="float-child">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="score">
            <div className="moves">
              <span className="bold">Moves:</span> {moves}
            </div>
            {localStorage.getItem("bestScore") && (
              <div className="high-score">
                <span className="bold">Best Score:</span> {bestScore}
              </div>
            )}
          </div>
          <div className="restart">
            <Button onClick={handleRestart} color="primary" variant="contained">
              Restart
            </Button>
            <Button onClick={handleAddToBench} color="primary" variant="contained">
              Add To Bench
            </Button>
          </div>
        </div>
      </div>

      <footer>
        <p>React + Flask</p>
        <div>{getMessage.status === 200 ? 
          <h3>{getMessage.data.message}</h3>
          :
          <h3>LOADING PYTHON API</h3>}
        </div>
      </footer>

      <Dialog
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hurray!!! You completed the challenge
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You completed the game in {moves} moves. Your best score is{" "}
            {bestScore} moves.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestart} color="primary">
            Restart
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}