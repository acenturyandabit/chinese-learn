import * as React from "react";
import {useNavigate} from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1>Learn Chinese With Interactive Flashcards</h1>
      <h3>Learn up to HSK-9 vocabulary by typing in pinyin*, with automatic difficulty progression, on your phone!</h3>
      <h2>Spaced repetition</h2>
      <p>See more familiar cardes less often and less familiar cards more often to learn faster. Familiarity is estimated automatically based on how long you take to recall the card.</p>
      <h2>Answer entry and feedback</h2>
      <p>Type to enter pinyin* and the app will check your response.</p>
      <h2>Mobile friendly</h2>
      <p>Learn on the go with large font for small screens.</p>
      <button onClick={()=>navigate("/test")}>Start learning</button>
    </>
  );
};
