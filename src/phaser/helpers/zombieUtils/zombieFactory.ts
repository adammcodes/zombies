import Zombie from "../../characters/Zombie";

export default function zombieFactory(scene, zombieArray, spritesheetKey, target, obstacles) {
  const zombieSpeed = 120;
  let sprite = spritesheetKey;

  zombieArray.forEach((zombie, i) => {
    if (zombie.name === "ZombieBoss") {
      sprite = "zombieKing"
    }
    scene.zombies[i] = new Zombie(scene, zombie.x, zombie.y, sprite, target, zombieSpeed);
    scene.physics.add.collider(scene.zombies[i], obstacles);
  });
};