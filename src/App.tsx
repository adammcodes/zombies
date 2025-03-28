import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./components/Navigation";
import GameStats from "./components/GameStats";
import GameTabContainer from "./components/GameTabContainer";
// styles
import "./index.css";
import "./App.css";

function App() {
  const [gameSession, setGameSession] = useState(null);
  const [highscores, setHighscores] = useState([]);
  // const [user, setUser] = useState(null);

  // retrieve highscores from db on first render
  // update highscores when post request to insert a game session into db is successful
  // then setGameSession will update gameSession state with new game session
  useEffect(() => {
    if (gameSession) {
      axios
        .get(`api/users/highscores`)
        .then((res) => {
          // response from server is game sessions array (length 10) sorted by score
          // give sorted array of {} to <Highscores> as props.scores
          setHighscores(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [gameSession]);

  return (
    <>
      <Navigation />
      <div className="asideGame">
        <GameStats saveGame={setGameSession} />
        {/* <GameTabContainer captionText="Log In" /> */}
        <GameTabContainer captionText="Options" />
        <GameTabContainer captionText="Highscores" scores={highscores} />
        <GameTabContainer captionText="Controls" />
      </div>
    </>
  );
}

export default App;
