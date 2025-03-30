import Entity from "../entities/Entity";
import { GameData, Sample } from "../types/game";
import { HEALTH_MAX } from "../scenes/dialogues/GameScore";
/* --------------------------------- Player Class ----------------------------------- */

let playerHit = 0;

export default class Player extends Entity {
  // Add static method to create animations
  static createAnimations(
    anims: Phaser.Animations.AnimationManager,
    textureKey: string
  ) {
    const animFrameRate = 10;

    if (!anims.exists("left")) {
      anims.create({
        key: "left",
        frames: anims.generateFrameNumbers(textureKey, { start: 5, end: 3 }),
        frameRate: animFrameRate,
        repeat: -1,
        yoyo: true,
      });
    }

    if (!anims.exists("right")) {
      anims.create({
        key: "right",
        frames: anims.generateFrameNumbers(textureKey, { start: 8, end: 6 }),
        frameRate: animFrameRate,
        repeat: -1,
        yoyo: true,
      });
    }

    if (!anims.exists("up")) {
      anims.create({
        key: "up",
        frames: anims.generateFrameNumbers(textureKey, { start: 9, end: 11 }),
        frameRate: animFrameRate,
        repeat: -1,
        yoyo: true,
      });
    }

    if (!anims.exists("down")) {
      anims.create({
        key: "down",
        frames: anims.generateFrameNumbers(textureKey, { start: 0, end: 2 }),
        frameRate: animFrameRate,
        repeat: -1,
        yoyo: true,
      });
    }
  }

  gameData: GameData;
  isDead: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureKey: string,
    inventory: Sample[],
    health: number,
    sampleLocations: Record<string, Phaser.Tilemaps.ObjectLayer[] | null>,
    kills: number
  ) {
    super(scene, x, y, textureKey, inventory);
    this.gameData = {
      inventory: inventory ? inventory : [], // initialized as []
      health: health ? health : HEALTH_MAX, // initialized as 500
      sampleLocations: sampleLocations,
      kills: kills ? kills : 0,
      avatar: textureKey,
      comingFrom: scene.scene.key,
    };

    this.scene = scene;

    // Call the static method instead of creating animations directly
    Player.createAnimations(scene.anims, this.textureKey);

    this.idleFrame = {
      down: 1,
      left: 4,
      right: 7,
      up: 10,
    };

    this.setFrame(this.idleFrame.down);

    /////////// Keyboard Inputs
    const { LEFT, RIGHT, UP, DOWN, W, A, S, D, SPACE } =
      Phaser.Input.Keyboard.KeyCodes;

    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      w: W,
      a: A,
      s: S,
      d: D,
      fireKey: SPACE,
    });
  } //// end constructor

  bounceBack(direction) {
    this.body.setVelocity(direction.x, direction.y);
    playerHit = 1;
  }

  update() {
    if (this.gameData.health <= 0) {
      this.isDead = true;
    }

    const { keys } = this;
    const walkingSpeed = 200; // velocity is in px / second
    const prevVelocity = this.body.velocity.clone();

    if (playerHit > 0) {
      playerHit++;
      if (playerHit > 5) {
        playerHit = 0;
      }
    } else {
      this.body.setVelocity(0);
    }

    ////// Set velocity // reset Y and X to zero for orthogonal movements to prevent diagonal movement
    if (keys.left.isDown || keys.a.isDown) {
      this.body.setVelocityY(0);
      this.body.setVelocityX(-walkingSpeed);
      this.anims.play("left", true);
    } else if (keys.right.isDown || keys.d.isDown) {
      this.body.setVelocityY(0);
      this.body.setVelocityX(walkingSpeed);
      this.anims.play("right", true);
    } else if (keys.up.isDown || keys.w.isDown) {
      this.body.setVelocityX(0);
      this.body.setVelocityY(-walkingSpeed);
      this.anims.play("up", true);
    } else if (keys.down.isDown || keys.s.isDown) {
      this.body.setVelocityX(0);
      this.body.setVelocityY(walkingSpeed);
      this.anims.play("down", true);
    } else {
      this.anims.stop();
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.body.velocity.normalize().scale(walkingSpeed);

    //// Set Idle animation frame when no keys are pressed
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      // show idle animation frame
      if (prevVelocity.x < 0) {
        this.setFrame(this.idleFrame.left);
      } else if (prevVelocity.x > 0) {
        this.setFrame(this.idleFrame.right);
      } else if (prevVelocity.y < 0) {
        this.setFrame(this.idleFrame.up);
      } else if (prevVelocity.y > 0) {
        this.setFrame(this.idleFrame.down);
      }
    }
  }
}
