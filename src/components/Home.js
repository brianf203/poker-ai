import React from 'react';
import './Home.css';
import pokerImage from '../pictures/home1.png';

const Home = () => {
  return (
    <div className="home">
      <div className="content-container">
        <div className="text-container">
          <h1>Welcome to Brian's Poker AI</h1>
          <p>Discover the power of our advanced poker AI.</p>
          <button>Start Game</button>
        </div>
        <div className="image-container">
          <img src={pokerImage} alt="Poker AI" />
        </div>
      </div>
    </div>
  );
};

export default Home;
