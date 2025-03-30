import { sceneEvents } from "@/phaser/utils/SceneEvents";

export default function sampleCollector(player, sample, thisScene) {
  thisScene.samplesTouched = true;
  const sampleLocations = thisScene.sampleLocations; // aka this.sampleLocations

  // hide sprite, disable body
  thisScene.samples.killAndHide(sample);
  sample.body.enable = false;

  // update sample locations - to be put into React component!?
  const sampleIndex = thisScene.samples.getChildren().indexOf(sample);
  const newSampleForPlayer = thisScene.samples
    .getChildren()
    .splice(sampleIndex, 1)[0]; // grab this object
  sampleLocations.splice(sampleIndex, 1);

  // Add the collected item obj to the player inv
  player.gameData.inventory.push(newSampleForPlayer);

  //emit event to update inventory icon
  sceneEvents.emit("sample-collected", player.gameData.inventory);

  // cut to BossUnlock Scene when all samples are gathered
  if (player.gameData.inventory.length === 36) {
    thisScene.scene.start("BossUnlock", player.gameData);
    thisScene.scene.stop(thisScene.scene.key);
  }
}
