import Shot from "./Shot";

export default class Shots extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      key: "shot",
      active: false,
      visible: false,
      classType: Shot,
    });
  }

  fireShot(x: number, y: number, playerDirection: string) {
    let shot = this.getFirstDead(false);
    if (shot) {
      shot.fire(x, y, playerDirection);
    }
  }
}
