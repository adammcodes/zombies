import { sceneEvents } from "@/phaser/utils/SceneEvents";

export default function zombieHit(player, zombie) {
  //gets information to pass to the player bouncing back
  const directionX = player.x - zombie.x;
  const directionY = player.y - zombie.y;
  const direction = new Phaser.Math.Vector2(directionX, directionY)
    .normalize()
    .scale(300);
  //player.bounceBack(direction);
  // mess up the player more if boss
  if (zombie.textureKey === "zombieKing") {
    player.gameData.health -= 1;
    console.log("player.gameData.health", player.gameData.health);
    player.bounceBack(direction);
  } else {
    player.gameData.health -= 0.5;
    console.log("player.gameData.health", player.gameData.health);
  }

  player.tint = Math.random() * 0xffffff;

  sceneEvents.emit("zombieHit", player.gameData.health);
}
