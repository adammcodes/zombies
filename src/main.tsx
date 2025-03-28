import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { Game, Types } from "phaser";

// scenes
import LoadingScene from "./scenes/LoadingScene.ts";

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
    // startMenu,
    // Intro,
    // Town,
    // Forest,
    // Dungeon,
    // Boss,
    // BossUnlock,
    // Winning,
    // GameScore,
    // GameOver,
    // Timer,
    // GameUI
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
