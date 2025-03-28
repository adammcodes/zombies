import { Events } from "phaser";

// Create and export the event emitter instance
export const sceneEvents: Events.EventEmitter = new Events.EventEmitter();

// Export the type for use in other files
export type SceneEventEmitter = Events.EventEmitter;
