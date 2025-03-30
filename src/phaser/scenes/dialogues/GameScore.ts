import { sceneEvents } from "@/phaser/utils/SceneEvents";
import calculateScore from "@/phaser/helpers/dataUtils/calculateScore";

declare const WebFont: any;

export const HEALTH_MAX = 500;

/* ------------------------------------ GameScore Scene  ------------------------ */
// Shows the player their game session score & game statistics
// Gives option for user to register to save their score into db (if not logged in)
// or Score is automatically saved to db (if logged in)
// After score is saved in either case Navigation:
// --> Show playerScore (React component side panel)
// --> Play Again
// --> Start Menu (for options)

export default class GameScore extends Phaser.Scene {
  constructor() {
    super("GameScore");
  }
  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
  }

  create(data: any) {
    const {
      health, // health remaining /500
      samples, // total samples collected
      kills, // total zombie kills
      antidote, // whether or not antidote was obtained
      score, // final calculated score
    } = calculateScore(data);

    // Default values
    const died = !antidote; // boolean, true is either time-out or 0 health,
    const mode = "medium"; // default difficulty (not yet implemented)

    // playerScore template string columns are separated by tabs
    const playerScore = `\n
      HEALTH:   ${health}/${HEALTH_MAX}
      SAMPLES:  ${samples}/36
      KILLS:    ${kills}
      ANTIDOTE: ${antidote ? `+10000` : `None`}
      SCORE:    ${score}\n
      `;

    const saveScore = `Save your score?`;

    const textStyle = {
      fontSize: 42,
      lineSpacing: 0,
      fontFamily: "VT323",
      color: "WHITE",
      boundsAlignH: "center",
      boundsAlignV: "middle",
    };

    // Mark center width (x position)
    const centerX = this.game.renderer.width / 3;
    const saveTextY = this.game.renderer.height / 1.75;

    // camera transition effect
    // this.cameras.main.fadeIn(3000);
    // Set title image in background
    this.add.image(0, 0, "title_bg").setOrigin(0).setDepth(0);

    // load fonts
    WebFont.load({
      google: {
        families: ["VT323"],
      },
      active: () => {
        // playerScore text block.. arguments are (X, Y, text, style)
        this.add.text(160, 32, playerScore, textStyle);
        // Save score text block.. arguments are (X, Y, text, style)
        this.add.text(centerX, saveTextY, saveScore, textStyle);
      },
    });

    // Give options to save score --> redirect new user register with react components or login
    // Make post request to store game session in db (yes)
    // or play again without saving --> transition to StartMenu to replay game (no)
    // with yes/no buttons

    // Buttons for Options to Save score
    let yesButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 1.5 + 30,
        "yes"
      )
      .setDepth(1);
    let noButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 1.5 + 100,
        "no"
      )
      .setDepth(1);

    let hoverSprite2 = this.add.image(100, 100, "skull");
    hoverSprite2.setScale(1);
    hoverSprite2.setVisible(false);

    //start music again
    this.game.sound.stopAll();
    this.sound.play("darkshadow", {
      loop: true,
    });

    // Reset local gameData
    const resetData = {
      comingFrom: "Intro",
      health: HEALTH_MAX,
      kills: 0,
      inventory: [],
      avatar: data.avatar,
      sampleLocations: {
        Dungeon: null,
        Town: null,
        Forest: null,
      },
    };

    // takes you to the StartMenu scene again, with resetData (with either yes or no)

    yesButton.setInteractive();
    yesButton.on("pointerover", () => {
      hoverSprite2.setVisible(true);
      hoverSprite2.x = yesButton.x - yesButton.width * 1.5;
      hoverSprite2.y = yesButton.y;
    });
    yesButton.on("pointerout", () => {
      hoverSprite2.setVisible(false);
    });
    yesButton.on("pointerup", () => {
      sceneEvents.emit("save-game", {
        samples,
        kills,
        score,
        died,
        antidote,
        mode,
      });
      this.sound.play("blood");
      // Return to StartMenu
      this.scene.start("StartMenu", resetData);
    });

    noButton.setInteractive();
    noButton.on("pointerover", () => {
      hoverSprite2.setVisible(true);
      hoverSprite2.x = noButton.x - noButton.width * 2.1;
      hoverSprite2.y = noButton.y;
    });

    noButton.on("pointerout", () => {
      hoverSprite2.setVisible(false);
    });

    noButton.on("pointerup", () => {
      sceneEvents.emit("player-death", data);
      // Reset GameStats component
      sceneEvents.emit("reset-score");
      // Return to StartMenu with gameData reset
      this.scene.start("StartMenu", resetData);
    });
  }
}
