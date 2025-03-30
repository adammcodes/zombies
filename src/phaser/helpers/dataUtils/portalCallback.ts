/* ---- player portal & data transfer between game scenes ---*/

export default function portalCallback(player, tile, thisScene, data) {
  const layer = tile.layer.name; 
  let destination;
  let comingFrom; 

  switch (layer) {
    case "downstairs":  
      destination = "Dungeon";
      comingFrom = "Town";
    break
    case "exitDungeon": 
      destination = "Town";
      comingFrom = "Dungeon";
    break
    case "intoTrees":
      destination = "Forest";
      comingFrom = "Town";
    break
    case "exitForest":
      destination = "Town";
      comingFrom = "Forest";
    break
    case "enterBoss":
      destination = "FinalBoss";
      comingFrom = "Forest";
    break
    default: 
      console.log("Unrecognized portal tile layer, sending you to Town");
      destination = "Town";
  }
  
  tile.collisionCallback = (collidingPlayer, collidingTile) => {
    console.log(`Leaving ${comingFrom}, entering ${destination}`);
    
    const sceneSamples = thisScene.sampleObjs; // []
    player.gameData.sampleLocations[comingFrom] = sceneSamples;

    const data = {
      comingFrom: comingFrom,  // string
      health: player.gameData.health, // number
      inventory: player.gameData.inventory, // []
      avatar: player.textureKey,
      sampleLocations: player.gameData.sampleLocations, // { [], [], [] }
      kills: player.gameData.kills // number
    };
    
    // We pass in the 'data' object to the next scene
    thisScene.scene.start(destination, data);
    thisScene.scene.stop(comingFrom);
  }
};