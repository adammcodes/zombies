// Event emitter for React GameStats component & Phaser GameUI util
import { sceneEvents } from "@/phaser/utils/SceneEvents";

// Game Entities
import Player from "@/phaser/characters/Player";
import Shots from "@/phaser/entities/Shots";

// Data Helpers
import gameOver from "@/phaser/helpers/dataUtils/gameOver";
import portalCallback from "@/phaser/helpers/dataUtils/portalCallback";
import preloadAssets from "@/phaser/helpers/dataUtils/preloadAssets";

// Sample Helpers
import sampleCollector from "@/phaser/helpers/sampleUtils/sampleCollector";
import createSamples from "@/phaser/helpers/sampleUtils/createSamples";

// Zombie Helpers
import zombieFactory from "@/phaser/helpers/zombieUtils/zombieFactory";
import zombieDamage from "@/phaser/helpers/zombieUtils/zombieDamage";
import zombieHit from "@/phaser/helpers/zombieUtils/zombieHit";

export default class Forest extends Phaser.Scene {
  constructor() {
    super({ key: "Forest" });
    this.shots;
    this.player;
  }

  zombies = [];
  sampleObjs: any[] = [];
  samplesTouched = false;
  samples: any[] | null = null;
  player: Player | null = null;
  shots: Shots | null = null;

  init(data: any) {
    if (!data.sampleLocations["Forest"]) {
      this.samplesTouched = false;
      data.sampleLocations["Forest"] = [];
    } else {
      this.samplesTouched = true;
    }
  }

  preload() {
    preloadAssets(this);
  }
  create(data: any) {
    //transition into dungeon scene
    this.cameras.main.fadeIn(2000);
    // environment
    const map = this.make.tilemap({ key: "forestMap" });
    const tileset1 = map.addTilesetImage(
      "Forest-extruded",
      "forest",
      32,
      32,
      1,
      2
    );
    const tileset2 = map.addTilesetImage(
      "Graveyard-extruded",
      "graveyard",
      32,
      32,
      1,
      2
    );
    const tileset3 = map.addTilesetImage("dungeon-objects", "obj-tiles");

    if (!tileset1 || !tileset2 || !tileset3) {
      throw new Error("Tilesets not found");
    }

    map.createLayer("ground", tileset1);
    map.createLayer("below-player-2", tileset2);
    const obstacles = map.createLayer("obstacles", tileset1);
    const obstacles_2 = map.createLayer("obstacles-2", tileset2);
    map.createLayer("below-player", tileset1);
    const exitShrubs = map.createLayer("exitForest", tileset1);

    // camera
    this.cameras.main.setZoom(2);

    // Get sample object layer from Tiled data if the player doesn't already have sample data
    if (this.samplesTouched) {
      this.sampleObjs = [...data.sampleLocations["Forest"]];
    } else {
      this.sampleObjs =
        map.objects.find((layer) => layer.name === "samples")?.objects || []; // returns an []
    }

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

    if (player.body) {
      // @ts-ignore
      player.body.setCollideWorldBounds(false);
    }

    // Create samples and set overlap with player
    this.samples = createSamples(this.sampleObjs, this);
    if (this.samples) {
      // @ts-ignore
      this.samples.refresh();
    }
    this.physics.add.overlap(this.player, this.samples, (player, sample) => {
      sampleCollector(player, sample, this);
    });

    //create shots
    this.shots = new Shots(this);

    // Make camera stop at edge of map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // make camera follow player
    this.cameras.main.startFollow(this.player);

    //  Player physics properties.
    obstacles.setCollisionBetween(0, 300);
    obstacles_2.setCollisionBetween(1, 400);
    exitShrubs.setCollisionBetween(1, 400);
    this.physics.add.collider(player, obstacles);
    this.physics.add.collider(player, obstacles_2);

    // Get zombie obj array from map
    const zombieObjs = map.objects.find(
      (layer) => layer.name === "zombies"
    )?.objects;
    // Create zombies // the zombieGhost sprite can pass through obstacles_2
    zombieFactory(this, zombieObjs, "zombieGhost", this.player, obstacles);

    this.zombies.forEach((zombie) => {
      this.physics.add.overlap(player, zombie, zombieHit);
    });

    // Zombie-Zombie collisions
    this.physics.add.collider(this.zombies, this.zombies);

    // Exit scene & pass data through player object (player.gameData property)
    this.physics.add.collider(player, exitShrubs, (player, tile) => {
      portalCallback(player, tile, this, data);
    });

    // Conditional staircase to boss room if 36 samples
    if (data.inventory.length === 36) {
      const enterBoss = map.createLayer("enterBoss", tileset3);
      enterBoss.setCollisionBetween(0, 1200);
      this.physics.add.collider(player, enterBoss, (player, tile) => {
        portalCallback(player, tile, this, data);
      });
    }

    // Physics properties for shots
    this.physics.add.collider(this.shots, obstacles, () => {
      let shot = this.shots.getFirstAlive();
      if (shot) {
        shot.setVisible(false);
        shot.setActive(false);
      }
    });

    this.physics.add.collider(this.shots, obstacles_2, () => {
      let shot = this.shots.getFirstAlive();
      if (shot) {
        shot.setVisible(false);
      }
    });

    // Physics for shots/zombies
    this.zombies.forEach((zombie) => {
      this.physics.add.collider(this.shots, zombie, (shot, zombie) => {
        let individualShot = this.shots.getFirstAlive();
        if (individualShot) {
          individualShot.setVisible(false);
          individualShot.setActive(false);
          zombieDamage(shot, zombie, this, player);
        }
      });
    });

    //create layer above player and zombies
    map.createLayer("above-player", tileset1, 0, 0);

    // Adds controls for firing
    if (this.input.keyboard) {
      this.input.keyboard.on("keydown-SPACE", () => {
        if (this.shots && this.player) {
          this.shots.fireShot(
            this.player.x,
            this.player.y,
            this.player.frame.name
          );
        }
      });
    }

    sceneEvents.once("timerOver", () => {
      this.player.isDead = true;
    });
  }

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
