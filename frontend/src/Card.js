import React from "react";
import classnames from "classnames";
import logo from './logo.svg';
import "./Card.scss";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card:   {
        type: "stock",
        image: require(`./images/player612.jpeg`)
      }, 
      index: -1, 
      isInactive: false, 
      isFlipped: false, 
      isDisabled: false
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('this is:', this);
    this.setState(prevState => ({
      isFlipped: !prevState.isFlipped,
      isDisabled: !prevState.isDisabled,
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    const handleClick = () => {
      !this.state.isFlipped && !this.state.isDisabled && this.state.onClick(this.state.index);
    };

    return (
      <div className={classnames("card", {
          "is-flipped": this.state.isFlipped,
          "is-inactive": this.state.isInactive
        })}
        onClick={this.handleClick}
      >
        <div className="card-face card-front-face">
          <img src={this.state.card.image} alt="cardback" />
        </div>
        <div className="card-face card-back-face">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </div>
    );
  }
}

export default Card;