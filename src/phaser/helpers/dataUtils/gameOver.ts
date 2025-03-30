export default function gameOver(player, thisScene) {
  //thisScene.game.sound.stopAll();

  // Reset sample locations in all scenes
  // Pass in player.gameData for GameScore and highscores
  const data = {
    comingFrom: "GameOver",
    health: player.gameData.health,
    inventory: player.gameData.inventory,
    kills: player.gameData.kills,
    avatar: player.gameData.avatar,
    antidote: false, // set antidote to false as player either died or time ran out
    sampleLocations: {
      Dungeon: null,
      Town: null,
      Forest: null,
    },
  };

  // cut to GameOver Scene here instead of StartMenu?
  thisScene.scene.start("GameOver", data);
  thisScene.scene.stop(thisScene);
  thisScene.scene.stop("GameUI");
  thisScene.scene.stop("Timer");
}
