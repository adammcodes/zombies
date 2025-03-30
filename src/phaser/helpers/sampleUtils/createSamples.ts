export default function createSamples(
  sampleLocations: any,
  scene: Phaser.Scene
): Phaser.Physics.Arcade.StaticGroup {
  const numOfSamples = sampleLocations.length;
  // Create samples
  const samples = scene.physics.add.staticGroup({
    key: "samples",
    frameQuantity: numOfSamples,
    // immovable: true,
  });
  // Distribute samples over map
  samples.getChildren().forEach((sample: any, i: any) => {
    let x = sampleLocations[i].x;
    let y = sampleLocations[i].y;
    sample.setScale(0.8);
    sample.setPosition(x, y);
  });

  return samples;
}
