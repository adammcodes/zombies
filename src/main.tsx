import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { Game, Types } from "phaser";

// scenes
import LoadingScene from "./scenes/dialogues/LoadingScene.ts";
import StartMenu from "./scenes/dialogues/StartMenu.ts";
import Intro from "./scenes/dialogues/Intro.ts";
import Town from "./scenes/maps/Town.ts";
import Forest from "./scenes/maps/Forest.ts";
import Dungeon from "./scenes/maps/Dungeon.ts";
import Boss from "./scenes/maps/Boss.ts";
import BossUnlock from "./scenes/dialogues/BossUnlockScene.ts";
import Winning from "./scenes/dialogues/WinningScene.ts";
import GameScore from "./scenes/dialogues/GameScore.ts";
import GameOver from "./scenes/dialogues/GameOverScene.ts";
import GameUI from "./phaser/utils/GameUI.ts";
import Timer from "./phaser/utils/Time.ts";

// Phaser Game Configuration
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO, // Will try WebGL renderer if supported, falls back to Canvas
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [
    // First scene in the array will be entry into the game
    LoadingScene,
    StartMenu,
    Intro,
    Town,
    Forest,
    Dungeon,
    Boss,
    BossUnlock,
    Winning,
    GameScore,
    GameOver,
    Timer,
    GameUI,
  ],
  render: {
    pixelArt: true,
  },
};

// Inserts game into a <canvas> element
new Game(config);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
