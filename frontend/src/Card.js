import React from "react";
import classnames from "classnames";
import cardback from "./images/stock.jpg";
import "./Card.scss";

const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled }) => {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index);
  };

  return (
    <div
      className={classnames("card", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive
      })}
      onClick={handleClick}
    >
      <div className="card-face card-front-face">
        <img src={cardback} alt="cardback" />
      </div>
      <div className="card-face card-back-face">
        <img src={card.image} alt="cardback" />
      </div>
    </div>
  );
};

export default Card;