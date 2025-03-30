import { sceneEvents } from "@/phaser/utils/SceneEvents";
import { GameData } from "@/phaser/types/game";

import Phaser from "phaser";

export default class StartMenu extends Phaser.Scene {
  constructor() {
    super("StartMenu");
  }

  create(data: GameData) {
    // set avatar texture key to male as default if not defined
    let avatarTexture = data.avatar || "player-m";
    // enable options on scene creation
    sceneEvents.emit("toggle-enable-options");

    this.cameras.main.fadeIn(5000);

    this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height * 0.2,
        "logo"
      )
      .setDepth(1);

    this.add.image(0, 0, "title_bg").setOrigin(0).setDepth(0);

    let playButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 1.5,
        "play_button"
      )
      .setDepth(1);

    let optionButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 1.5 + 100,
        "options_button"
      )
      .setDepth(1);

    let hoverSprite = this.add.sprite(100, 100, avatarTexture);
    hoverSprite.setScale(2);
    hoverSprite.setVisible(false);

    this.anims.create({
      key: "walk-player-m",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("player-m", {
        frames: [0, 1, 2],
      }),
      yoyo: true,
    });

    this.anims.create({
      key: "walk-player-f",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("player-f", {
        frames: [0, 1, 2],
      }),
      yoyo: true,
    });

    // keeps sound playing even if not in the browser
    //this.sound.pauseOnBlur = false

    //plays the sound
    this.game.sound.stopAll();
    this.sound.play("darkshadow", {
      loop: true,
    });
    this.sound.setVolume(0.5);

    // Play Button configuration
    playButton.setInteractive();

    playButton.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play(`walk-${avatarTexture}`);
      hoverSprite.x = playButton.x - playButton.width / 1.5;
      hoverSprite.y = playButton.y;
    });
    playButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
    });

    playButton.on("pointerup", () => {
      this.sound.play("blood");
      data.avatar = avatarTexture; // assign selected avatar
      this.scene.start("Intro", data);
      sceneEvents.emit("reset-score", data);
      // disable Options react component elements: avatar, mode, and save
      // so that avatar or game mode cannot be changed while playing
      sceneEvents.emit("toggle-enable-options");
    });

    //Options Button configuration
    optionButton.setInteractive();

    optionButton.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play(`walk-${avatarTexture}`);
      hoverSprite.x = optionButton.x - optionButton.width / 1.5;
      hoverSprite.y = optionButton.y;
    });
    optionButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
    });

    optionButton.on("pointerup", () => {
      // Toggle open state of Options react component
      sceneEvents.emit("toggle-options");
    });

    sceneEvents.on("toggle-sound", () => {
      this.game.sound.mute = !this.game.sound.mute;
    });

    sceneEvents.on("save-options", (options: any) => {
      // ensure avatar or game mode cannot be changed while playing
      // unless on StartMenu scene
      if (this.scene.manager.isActive("StartMenu")) {
        avatarTexture = options.avatar; // reassign avatar texture key
        // in future change gameMode (no implementation yet)
      }
    });
  }
}
