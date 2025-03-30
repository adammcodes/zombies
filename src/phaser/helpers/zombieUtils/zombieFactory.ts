import Zombie from "../../characters/Zombie";

export default function zombieFactory(
  scene,
  zombieArray,
  spritesheetKey,
  target,
  obstacles
) {
  const zombieSpeed = 120;
  const zombieHealth = 3; // Default health for regular zombies
  let sprite = spritesheetKey;

  zombieArray.forEach((zombie, i) => {
    if (zombie.name === "ZombieBoss") {
      sprite = "zombieKing";
    }
    scene.zombies[i] = new Zombie(
      scene,
      zombie.x,
      zombie.y,
      sprite,
      target,
      zombieSpeed,
      zombieHealth
    );
    scene.physics.add.collider(scene.zombies[i], obstacles);
  });
}
