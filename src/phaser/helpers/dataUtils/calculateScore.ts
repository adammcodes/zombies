import { sceneEvents } from "@/phaser/utils/SceneEvents";

export default function calculateScore(data) {
  const health = Math.floor(Math.max(0, data.health)); // remaining health bonus
  const samples = data.inventory.length;
  const kills = data.kills;
  const antidote = data.antidote; // boolean
  const antidoteBonus = antidote ? 10000 : 0; // antidote bonus addition to score
  const score = samples * 100 + kills * 500 + health * 50 + antidoteBonus;

  // emit final score to react GameStats component
  sceneEvents.emit("final-score", score);

  return { samples, kills, score, health, antidote };
}
