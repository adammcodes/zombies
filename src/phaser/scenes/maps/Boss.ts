// Game Entities
import Player from "@/phaser/characters/Player";
import Shots from "@/phaser/entities/Shots";

// Data Helpers
import gameOver from "@/phaser/helpers/dataUtils/gameOver";
import preloadAssets from "@/phaser/helpers/dataUtils/preloadAssets";

// Zombie Helpers
import zombieFactory from "@/phaser/helpers/zombieUtils/zombieFactory";
import zombieDamage from "@/phaser/helpers/zombieUtils/zombieDamage";
import zombieHit from "@/phaser/helpers/zombieUtils/zombieHit";

import { sceneEvents } from "@/phaser/utils/SceneEvents";

// Game Types
import { BossRoom, GameData } from "@/phaser/types/game";
import Zombie from "@/phaser/characters/Zombie";

export default class FinalBoss extends Phaser.Scene {
  constructor() {
    super({ key: "FinalBoss" });
  }

  zombies = [];
  shots!: Shots;
  player!: Player;
  zombieBoss = [];
  bossRoom!: BossRoom;

  init(_: GameData) {}

  preload() {
    preloadAssets(this);
  }

  create(data: GameData) {
    //transition into dungeon scene
    this.cameras.main.fadeIn(2000);
    // environment
    const map = this.make.tilemap({ key: "finalBoss" });

    const tileset = map.addTilesetImage(
      "dungeon-tileset",
      "dungeonTiles",
      32,
      32,
      1,
      2
    );
    if (!tileset) {
      throw new Error("Tileset not found");
    }

    const dungObjs = map.addTilesetImage("dungeon-objects", "obj-tiles");

    if (!dungObjs) {
      throw new Error("Dungeon objects not found");
    }

    map.createLayer("Ground", tileset, 0, 0);
    const walls = map.createLayer("Walls", tileset, 0, 0);
    if (!walls) {
      throw new Error("Walls layer not found");
    }

    // camera
    this.cameras.main.setZoom(1.7);

    // Create player at start location
    this.player = new Player(
      this,
      385,
      580,
      data.avatar,
      data.inventory,
      data.health,
      data.sampleLocations,
      data.kills
    );
    const player = this.player;
    // Create shots
    this.shots = new Shots(this);

    if (player.body) {
      // @ts-ignore
      player.body.setCollideWorldBounds(true);
    }

    // Make camera stop at edge of map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make camera follow player
    this.cameras.main.startFollow(this.player);

    walls.setCollisionBetween(0, 300);
    this.physics.add.collider(player, walls);

    // Get zombie obj array from map
    const zombieObjs = map.objects.find(
      (layer) => layer.name === "Zombies"
    )?.objects;

    // Create zombie animations first
    Zombie.createAnimations(this.anims, "zombieGhost");
    Zombie.createAnimations(this.anims, "zombieKing");

    // Create zombies
    zombieFactory(this, zombieObjs, "zombieGhost", this.player, walls);

    this.zombies.forEach((zombie) => {
      this.physics.add.overlap(player, zombie, zombieHit);
    });

    // Physics properties for shots
    this.physics.add.collider(this.shots, walls, () => {
      let shot = this.shots.getFirstAlive();
      if (shot) {
        shot.setVisible(false);
        shot.setActive(false);
      }
    });

    this.bossRoom = {
      key: "FinalBoss",
      scene: this,
      map: map,
      tileset: dungObjs,
      player: player,
    };

    // Physics for shots/zombies
    this.zombies.forEach((zombie) => {
      this.physics.add.collider(this.shots, zombie, (shot) => {
        let individualShot = this.shots.getFirstAlive();
        if (individualShot) {
          individualShot.setVisible(false);
          individualShot.setActive(false);
          zombieDamage({
            shot: shot as Phaser.GameObjects.Sprite,
            zombie: zombie as Zombie,
            player: this.player,
            bossRoom: this.bossRoom,
          });
        }
      });
    });

    // Adds controls for firing
    this.input.keyboard.on("keydown-SPACE", () => {
      this.shots.fireShot(this.player.x, this.player.y, this.player.frame.name);
    });

    sceneEvents.once("timerOver", () => {
      this.player.isDead = true;
    });
  } // end create()

  update() {
    if (this.player.isDead) {
      gameOver(this.player, this);
    } else {
      this.player.update();
    }
    this.zombies.forEach((z) => z.update());
    if (this.player.body.embedded) {
      this.player.body.touching.none = false;
    }
    if (this.player.body.touching.none && !this.player.body.wasTouching.none) {
      this.player.clearTint();
    }
  }
}
