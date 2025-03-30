import { sceneEvents } from "@/phaser/utils/SceneEvents";

export default function zombieDamage(zombie, shot, scene, player, bossRoom) {
  if (zombie.zombieData.health === 0) {
    zombie.setVisible(false);
    zombie.body.enable = false;
    // Increment kill count and emit event
    player.gameData.kills += 1;
    sceneEvents.emit("zombie-killed", player.gameData.kills);
    // Keep track of kills in bossRoom for conditional chest render
    if (bossRoom) {
      const { key, scene, map, tileset, player } = bossRoom;
      killZombie(zombie, scene, map, tileset, player, key);
    }
  } else {
    zombie.tint = Math.random() * 0xffffff;
    zombie.zombieData.health -= 1;
    const directionX = zombie.x - shot.x;
    const directionY = zombie.y - shot.y;
    const direction = new Phaser.Math.Vector2(directionX, directionY)
      .normalize()
      .scale(200);
    zombie.bounceBack(direction);
  }
}

const killZombie = (zombie, scene, map, tileset, player, key) => {
  // Remove zombie from scene zombies array
  const zombieIndex = scene.zombies.indexOf(zombie);
  scene.zombies.splice(zombieIndex, 1);

  if (key === "FinalBoss") {
    if (scene.zombies.length === 0) {
      console.log("YOU WIN!");
      renderChest(scene, map, tileset, player);
    }
  }
};

const renderChest = (scene, map, tileset, player) => {
  const chest = map.createLayer("Chest", tileset, 0, 0);
  // Set collider between player and chest to trigger "Winning" scene
  chest.setCollisionBetween(0, 500);
  scene.physics.add.collider(chest, player, (player, tile) => {
    // pass in player so that GameScore can calculate score from player.gameData
    getAntidote(scene, player);
  });
};

const getAntidote = (scene, player) => {
  // Transition to "Winning" Scene, pass in player.gameData for GameScore
  const data = {
    comingFrom: "FinalBoss",
    health: player.gameData.health,
    kills: player.gameData.kills,
    inventory: player.gameData.inventory,
    avatar: player.gameData.avatar,
    antidote: true, // score bonus for retrieving the antidote
    sampleLocations: {
      Dungeon: null,
      Town: null,
      Forest: null,
    },
  };
  scene.scene.start("Winning", data);
  scene.scene.stop("FinalBoss");
};
