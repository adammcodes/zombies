import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Load a simple square sprite
    this.load.image(
      "player",
      "https://labs.phaser.io/assets/particles/blue.png"
    );
  }

  create() {
    // Add some text to show the scene is working
    this.add.text(10, 10, "Game Scene is running!", { color: "#ffffff" });

    // Create a player sprite
    this.player = this.add.sprite(400, 300, "player");

    // Make the sprite interactive
    this.player.setInteractive();

    // Add some rotation animation
    this.tweens.add({
      targets: this.player,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: "Linear",
    });
  }

  update() {
    // Add some simple movement
    if (this.player) {
      this.player.x += Math.sin(this.time.now / 1000) * 2;
      this.player.y += Math.cos(this.time.now / 1000) * 2;
    }
  }
}
