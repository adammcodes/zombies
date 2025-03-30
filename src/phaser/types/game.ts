import Phaser from "phaser";
import Player from "../characters/Player";

export type GameData = {
  avatar: string;
  comingFrom: string;
  health: number;
  kills: number;
  inventory: Sample[];
  sampleLocations: {
    [key: string]: Phaser.Tilemaps.ObjectLayer[] | null;
  };
};

export type Sample = Phaser.GameObjects.Sprite & {
  id: number;
  height: number;
  width: number;
  x: number;
  y: number;
  name: string;
  type: string;
  visible: boolean;
  properties: {
    [key: string]: string;
  };
};

export type BossRoom = {
  key: string;
  scene: Phaser.Scene;
  map: Phaser.Tilemaps.Tilemap;
  tileset: Phaser.Tilemaps.Tileset;
  player: Player;
};
