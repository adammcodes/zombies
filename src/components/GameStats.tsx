import { useState, useEffect } from "react";
import axios from "axios";
import { sceneEvents } from "../phaser/utils/SceneEvents";

export default function GameStats({
  saveGame,
}: {
  saveGame: (gameData: any) => void;
}) {
  // saveGame is setGameSession in App.jsx
  // to trigger another fetch of highscores
  // after succesful post to 'api/games'
  // const { saveGame } = props;

  const [inventory, setInventory] = useState(0);
  const [killCount, setKillCount] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [timer, setTimer] = useState("00:00");
  const [danger, setDanger] = useState(false);

  const score = finalScore || inventory * 100 + killCount * 500;

  useEffect(() => {
    sceneEvents.on("sample-collected", (playerInventory: any) => {
      setInventory(playerInventory.length);
    });

    sceneEvents.on("zombie-killed", (playerKills: any) => {
      setKillCount(playerKills);
    });

    sceneEvents.on("player-death", (data: any) => {
      setInventory(data.inventory.length);
      setKillCount(data.kills);
      setTimer("00:00");
      setDanger(false);
    });

    sceneEvents.on("reset-score", () => {
      setInventory(0);
      setKillCount(0);
      setFinalScore(null);
      setTimer("00:00");
      setDanger(false);
    });

    sceneEvents.on("timer", (timer: any, danger: any) => {
      // danger is set to true and passed in as true when 60 seconds remain or less
      // timer css color is changed to red when danger is true
      setDanger(danger);
      setTimer(timer);
    });

    // final score is calculated & emitted from
    // phaser/helpers/dataUtils/calculateScore.js at end game
    sceneEvents.on("final-score", (finalScore: any) => {
      setFinalScore(finalScore);
    });

    sceneEvents.on("save-game", (gameData: any) => {
      // make post request to 'api/games' to insert game session data
      // request body { samples, kills, score, died, antidote, mode }
      axios
        .post("api/games", gameData)
        .then((res) => {
          // setGameSession in App.jsx to re-render highscores
          saveGame(res.data);
          // Reset score
          sceneEvents.emit("reset-score");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, []);

  return (
    <ul className="gameStats sidetab">
      <li className={danger ? "danger" : "none"}>Timer: {timer}</li>
      <li>Kills: {killCount}</li>
      <li>Score: {score} </li>
    </ul>
  );
}
