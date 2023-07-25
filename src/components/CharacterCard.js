import React from 'react';
import { Picker } from 'emoji-mart';

const CharacterCard = () => {
  const detectiveConanEmoji = 'detective';
  const onSelectEmoji = (emoji) => {
    // Handle emoji selection if needed
    console.log(emoji);
  };

  return (
    <div className="character-card">
      <Picker onSelect={onSelectEmoji} set="apple" emoji={detectiveConanEmoji} title="Pick your emoji" />
      <div className="character-details">
        <h2>Detective Conan</h2>
        <p>Age: 17</p>
        <p>Occupation: High School Detective</p>
        {/* Add more character details as needed */}
      </div>
    </div>
  );
};

export default CharacterCard;
