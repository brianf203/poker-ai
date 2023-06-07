import React from 'react';
import './Home.css';
import pokerImage from '../pictures/home1.png';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home">
            <div className="content-container">
                <div className="text-container">
                    <h1>Play against the best <span style={{ color: 'rgb(58, 175, 170)' }}>poker AI</span> in the world</h1>
                    <p>Challenge the best poker AI in the world. Brian's AI has proven its dominance against top AI agents and professional players over thousands of hands with an impressive win rate of 23BB/100.</p>
                    <p>Dive into the realm of strategic thinking and master poker strategy. Analyzing vast data with sophisticated mathematical models, our nengine employs probability theory to assess odds perfectly. Witness the power of AI-driven probability decision-making with Brian's AI.</p>
                    <button className="start-game-button">
                        <Link to="/game" style={{ textDecoration: 'none', color: 'white' }}>Start Game</Link>
                    </button>
                </div>
                <div className="image-container">
                    <img src="https://uploads-ssl.webflow.com/62b9dcb3bebc7275c12af64d/638be86995fb436e0d38c8a2_Group%20464.svg" alt="Poker AI" />
                </div>
            </div>
        </div>
    );
};

export default Home;
