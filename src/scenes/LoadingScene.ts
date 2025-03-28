import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadingScene" });
  }

  preload() {
    //Loading the Assets for the GameOver
    this.load.image("title_bg", "/assets/menu-images/title_bg.jpeg");

    this.load.image("game_over", "/assets/menu-images/gameover.png");

    this.load.image("try_again", "/assets/menu-images/tryagain.png");

    this.load.image("yes", "/assets/menu-images/yes.png");

    this.load.image("no", "/assets/menu-images/no.png");

    this.load.image("skull", "/assets/menu-images/skull.png");

    //Fake Loading Screen assets
    for (let i = 0; i < 4000; i++) {
      // this.load.image('Zombie'+ ' ' + i, skull);
    }

    //Loading the assets for the Main Menu
    this.load.image("title_bg", "/assets/menu-images/title_bg.jpeg");

    this.load.image("options_button", "/assets/menu-images/menuoptions.png");

    this.load.image("play_button", "/assets/menu-images/menuplay.png");

    this.load.image("logo", "/assets/menu-images/menuname.png");

    this.load.spritesheet(
      "player-m",
      "/assets/characters/players/player-male.png",
      {
        frameHeight: 32,
        frameWidth: 32,
      }
    );

    this.load.spritesheet(
      "player-f",
      "/assets/characters/players/player-female.png",
      {
        frameHeight: 32,
        frameWidth: 32,
      }
    );

    // Sounds
    this.load.audio("darkshadow", "/assets/sounds/darkshadows.mp3");
    this.load.audio("blood", "/assets/sounds/bloodshed.mp3");

    // Loading assets for the winning scene
    this.load.image("spacebar", "/assets/menu-images/spacebar.png");

    // Load asset for forest portal
    this.load.image("forestportal", "/assets/menu-images/forestportal.png");

    // Get the canvas dimensions
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Calculate progress bar dimensions and position
    const progressBarWidth = width * 0.4; // 40% of game width
    const progressBarHeight = height * 0.08; // 8% of game height
    const progressBarX = (width - progressBarWidth) / 2;
    const progressBarY = height / 2 - progressBarHeight / 2;

    // Create progress bar
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      progressBarX,
      progressBarY,
      progressBarWidth,
      progressBarHeight
    );

    // Create loading text
    let loadingText = this.make.text({
      x: width / 2,
      y: progressBarY - 30,
      text: "Loading...",
      style: {
        font: "24px monospace",
        color: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    // Create percentage text
    let percentText = this.make.text({
      x: width / 2,
      y: progressBarY + progressBarHeight / 2,
      text: "0%",
      style: {
        font: "20px monospace",
        color: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    // Create asset text
    let assetText = this.make.text({
      x: width / 2,
      y: progressBarY + progressBarHeight + 30,
      text: "",
      style: {
        font: "22px monospace",
        color: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    // Update progress bar
    this.load.on("progress", function (value: number) {
      progressBar.clear();
      progressBar.fillStyle(0xff0000, 1);
      progressBar.fillRect(
        progressBarX + 5, // Add small padding
        progressBarY + 5,
        (progressBarWidth - 10) * value,
        progressBarHeight - 10
      );
      percentText.setText(parseInt((value * 100).toString()) + "%");
    });

    this.load.on("fileprogress", function (file: any) {
      assetText.setText("Loading asset: " + file.key);
    });

    this.load.on("complete", function () {
      // Add a 2-second delay before destroying the loading screen
      setTimeout(() => {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
      }, 10000); // 2000ms = 2 seconds
    });
  }

  // create() {
  //     this.scene.start('startMenu');
  // }
}
