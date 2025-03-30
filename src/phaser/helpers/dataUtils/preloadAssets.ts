// Src assets

// maps and other json files
import map from "@/assets/overworldv4.json";
import forestMap from "@/assets/finalForest.json";
import dungMap from "@/assets/dungeonMap.json";
import finalBoss from "@/assets/finalBoss.json";
import boy1json from "@/assets/testnpc.json";

// Public assets

// tile sets
import forest from "/assets/tilesets/forest-tileset-extruded.png";
import graveyard from "/assets/tilesets/graveyard-tileset-extruded.png";
import dungeonTiles from "/assets/tilesets/dungeon-tileset-extruded.png";
import tiles from "/assets/tilesets/town32-extruded.png";
import obj_tiles from "/assets/tilesets/dungeon-objects.png";

// character sprites and atlas maps
import player_male from "/assets/characters/players/player-male.png";
import player_female from "/assets/characters/players/player-female.png";
import boy1 from "/assets/characters/players/testnpc.png";

// enemy sprites
import zombie7 from "/assets/characters/enemies/zombie7.png";
import zombie from "/assets/characters/enemies/zombie1.png";
import zombieKing from "/assets/characters/enemies/zombie2.png";
import zombieGhost from "/assets/characters/enemies/zombieGhost.png";

// object sprites
import shot from "/assets/weapons/smBlueBlast.png";
import empty_heart from "/assets/symbols-and-items/ui_heart_empty32.png";
import full_heart from "/assets/symbols-and-items/ui_heart_full32.png";
import half_heart from "/assets/symbols-and-items/ui_heart_half.png";
import samples from "/assets/symbols-and-items/sample2.png";
import chest from "/assets/symbols-and-items/chest.png";

export default function preloadAssets(scene: Phaser.Scene) {
  //font loader
  scene.load.script(
    "webfont",
    "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
  );

  // Town preload
  scene.load.image("tiles", tiles);
  scene.load.image("obj-tiles", obj_tiles);
  scene.load.tilemapTiledJSON("map", map);
  scene.load.spritesheet("player-m", player_male, {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.spritesheet("player-f", player_female, {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.atlas("boy1", boy1, boy1json);

  // image for shots
  scene.load.image("shot", shot);

  // zombie spritesheet(s)
  scene.load.spritesheet("zombie7", zombie7, {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.spritesheet("zombie", zombie, { frameWidth: 32, frameHeight: 32 });
  scene.load.spritesheet("zombieKing", zombieKing, {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.spritesheet("zombieGhost", zombieGhost, {
    frameWidth: 32,
    frameHeight: 32,
  });

  //image for hearts
  scene.load.image("empty-heart", empty_heart);
  scene.load.image("full-heart", full_heart);
  scene.load.image("half-heart", half_heart);
  //image for samples
  scene.load.image("samples", samples);

  // Forest preload
  scene.load.image("forest", forest);
  scene.load.image("graveyard", graveyard);
  scene.load.tilemapTiledJSON("forestMap", forestMap);

  // Dungeon preload
  scene.load.image("dungeonTiles", dungeonTiles);
  scene.load.tilemapTiledJSON("dungMap", dungMap);

  //final boss preload
  scene.load.image("chest", chest);
  scene.load.tilemapTiledJSON("finalBoss", finalBoss);
}
