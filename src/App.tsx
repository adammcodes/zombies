import { useEffect, useRef } from "react";
import "./App.css";
import game from "./game";

function App() {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameContainer.current) {
      // Mount the game to the container
      game.scale.resize(
        gameContainer.current.clientWidth,
        gameContainer.current.clientHeight
      );
      gameContainer.current.appendChild(game.canvas);
    }

    // Cleanup function
    return () => {
      if (gameContainer.current) {
        gameContainer.current.removeChild(game.canvas);
      }
    };
  }, []);

  return (
    <div ref={gameContainer} style={{ width: "100vw", height: "100vh" }}>
      {/* Phaser game will be mounted here */}
    </div>
  );
}

export default App;
